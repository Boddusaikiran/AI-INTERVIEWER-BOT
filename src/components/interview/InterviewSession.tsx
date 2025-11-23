import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle, User, Bot } from 'lucide-react';
import { QuestionDisplay } from './QuestionDisplay';
import { AnswerInput } from './AnswerInput';
import { FeedbackCard } from './FeedbackCard';
import { ProgressIndicator } from './ProgressIndicator';
import { EvaluationReport } from './EvaluationReport';
import type { 
  InterviewConfig, 
  ConversationMessage, 
  QuestionFeedback,
  FinalEvaluation 
} from '@/types/interview';
import { 
  streamInterviewResponse, 
  generateInterviewPrompt, 
  generateFinalEvaluationPrompt 
} from '@/services/interviewApi';
import { toast } from 'sonner';

interface InterviewSessionProps {
  config: InterviewConfig;
  onRestart: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  feedback?: QuestionFeedback;
  timestamp: Date;
}

const TARGET_QUESTIONS = 5;

export const InterviewSession = ({ config, onRestart }: InterviewSessionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalEvaluation, setFinalEvaluation] = useState<FinalEvaluation | null>(null);
  const [isGeneratingEvaluation, setIsGeneratingEvaluation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startInterview();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentQuestion]);

  const startInterview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const initialPrompt = generateInterviewPrompt(config, true);
      const initialMessage: ConversationMessage = {
        role: 'user',
        parts: [{ text: initialPrompt }],
      };

      const newHistory = [initialMessage];
      setConversationHistory(newHistory);

      let fullResponse = '';
      for await (const chunk of streamInterviewResponse(newHistory)) {
        if (!chunk.isComplete) {
          fullResponse += chunk.text;
          setCurrentQuestion(fullResponse);
        }
      }

      const assistantMessage: ConversationMessage = {
        role: 'model',
        parts: [{ text: fullResponse }],
      };
      setConversationHistory([...newHistory, assistantMessage]);

      setMessages([{
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start interview';
      setError(errorMessage);
      toast.error('Interview Error', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    setIsSubmitting(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      content: answer,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const userConversation: ConversationMessage = {
      role: 'user',
      parts: [{ text: answer }],
    };

    const newHistory = [...conversationHistory, userConversation];
    setConversationHistory(newHistory);

    try {
      const nextPrompt = generateInterviewPrompt(config, false);
      const promptMessage: ConversationMessage = {
        role: 'user',
        parts: [{ text: nextPrompt }],
      };

      const historyWithPrompt = [...newHistory, promptMessage];

      let fullResponse = '';
      setCurrentQuestion('');
      
      for await (const chunk of streamInterviewResponse(historyWithPrompt)) {
        if (!chunk.isComplete) {
          fullResponse += chunk.text;
          setCurrentQuestion(fullResponse);
        }
      }

      const assistantMessage: ConversationMessage = {
        role: 'model',
        parts: [{ text: fullResponse }],
      };
      setConversationHistory([...historyWithPrompt, assistantMessage]);

      const newAnsweredCount = answeredCount + 1;
      setAnsweredCount(newAnsweredCount);

      const feedback = extractFeedback(fullResponse);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fullResponse,
        feedback,
        timestamp: new Date(),
      }]);

      if (newAnsweredCount >= TARGET_QUESTIONS) {
        await generateFinalEvaluation([...historyWithPrompt, assistantMessage]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process answer';
      setError(errorMessage);
      toast.error('Submission Error', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractFeedback = (response: string): QuestionFeedback | undefined => {
    const scoreMatch = response.match(/score[:\s]+(\d+)\/10/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

    const strengthsMatch = response.match(/strengths?[:\s]+(.*?)(?=areas? for improvement|improvements?|suggestions?|score|$)/is);
    const improvementsMatch = response.match(/areas? for improvement|improvements?[:\s]+(.*?)(?=suggestions?|score|$)/is);
    const suggestionsMatch = response.match(/suggestions?[:\s]+(.*?)(?=score|$)/is);

    const parseList = (text: string | undefined): string[] => {
      if (!text) return [];
      return text
        .split(/[•\-\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && item.length < 200)
        .slice(0, 3);
    };

    return {
      score,
      strengths: parseList(strengthsMatch?.[1]),
      improvements: parseList(improvementsMatch?.[1]),
      suggestions: suggestionsMatch?.[1]?.trim().slice(0, 300) || 'Continue practicing and refining your responses.',
    };
  };

  const generateFinalEvaluation = async (history: ConversationMessage[]) => {
    setIsGeneratingEvaluation(true);
    
    try {
      const evaluationPrompt = generateFinalEvaluationPrompt();
      const evaluationMessage: ConversationMessage = {
        role: 'user',
        parts: [{ text: evaluationPrompt }],
      };

      const evaluationHistory = [...history, evaluationMessage];

      let fullResponse = '';
      for await (const chunk of streamInterviewResponse(evaluationHistory)) {
        if (!chunk.isComplete) {
          fullResponse += chunk.text;
        }
      }

      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]) as FinalEvaluation;
        setFinalEvaluation(evaluation);
        setIsComplete(true);
      } else {
        throw new Error('Failed to parse evaluation response');
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      const fallbackEvaluation: FinalEvaluation = {
        technicalScore: 7,
        behavioralScore: 7,
        situationalScore: 7,
        communicationScore: 7,
        overallScore: 7,
        strengths: ['Good communication', 'Thoughtful responses', 'Professional demeanor'],
        weaknesses: ['Could provide more specific examples', 'Consider elaborating on technical details'],
        improvementPlan: [
          'Practice answering common interview questions',
          'Prepare specific examples from your experience',
          'Research the company and role thoroughly',
        ],
        resources: [
          'Practice with mock interviews',
          'Review common interview questions for your field',
          'Study the STAR method for behavioral questions',
        ],
        advice: 'You demonstrated good potential in this interview. Focus on providing more specific examples and elaborating on your technical knowledge. Keep practicing and you will continue to improve!',
      };
      setFinalEvaluation(fallbackEvaluation);
      setIsComplete(true);
    } finally {
      setIsGeneratingEvaluation(false);
    }
  };

  if (isComplete && finalEvaluation) {
    return <EvaluationReport evaluation={finalEvaluation} candidateName={config.name} onRestart={onRestart} />;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Interview in Progress</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {config.name} • {config.desiredRole} • {config.mode} mode
                </p>
              </div>
              <Button variant="outline" onClick={onRestart} size="sm">
                Exit Interview
              </Button>
            </div>
            <ProgressIndicator 
              currentQuestion={answeredCount + 1}
              totalQuestions={TARGET_QUESTIONS}
              answeredQuestions={answeredCount}
            />
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[calc(100vh-300px)]" ref={scrollRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-3">
                {message.role === 'user' ? (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">Your Answer</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-accent/10 rounded-full">
                            <Bot className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">AI Interviewer</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {message.feedback && <FeedbackCard feedback={message.feedback} />}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Starting interview...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentQuestion && !isLoading && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/10 rounded-full">
                      <Bot className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-1">AI Interviewer</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{currentQuestion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isGeneratingEvaluation && (
              <Card className="bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm text-foreground">Generating your final evaluation...</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {!isLoading && !isGeneratingEvaluation && currentQuestion && (
          <AnswerInput 
            onSubmit={handleAnswerSubmit} 
            isSubmitting={isSubmitting}
            disabled={isComplete}
          />
        )}
      </div>
    </div>
  );
};

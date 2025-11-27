import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle, User, Bot } from 'lucide-react';
import { AnswerInput } from './AnswerInput';
import { FeedbackCard } from './FeedbackCard';
import { ProgressIndicator } from './ProgressIndicator';
import { EvaluationReport } from './EvaluationReport';
import type {
  InterviewConfig,
  ConversationMessage,
  QuestionFeedback,
  FinalEvaluation,
  InterviewRound,
  DifficultyLevel,
  InterviewerRole
} from '@/types/interview';
import {
  streamInterviewResponse,
  generateInterviewPrompt,
  generateFinalEvaluationPrompt
} from '@/services/interviewApi';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';

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

const QUESTIONS_PER_ROUND = 3;
const ROUNDS: InterviewRound[] = ['screening', 'technical', 'behavioral'];

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


  // Multi-round state
  const [currentRound, setCurrentRound] = useState<InterviewRound>(config.round);
  const [roundQuestionCount, setRoundQuestionCount] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>('medium');
  const [averageScore, setAverageScore] = useState(0);
  const [currentRole, setCurrentRole] = useState<InterviewerRole>('hr');

  const scrollRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    startInterview();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentQuestion]);

  // Effect to read new questions when they are fully generated


  const startInterview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const initialPrompt = generateInterviewPrompt(config, true, currentRound);
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

  const handleAnswerSubmit = async (answer: string, _typingMetrics?: { startTime: number; endTime: number; characterCount: number; pauseCount: number; correctionCount: number }) => {

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
      // Determine if we need to switch rounds
      let nextRound = currentRound;
      let isRoundTransition = false;

      if (config.mode === 'comprehensive' && roundQuestionCount + 1 >= QUESTIONS_PER_ROUND) {
        const currentRoundIndex = ROUNDS.indexOf(currentRound);
        if (currentRoundIndex < ROUNDS.length - 1) {
          nextRound = ROUNDS[currentRoundIndex + 1];
          isRoundTransition = true;
        }
      }

      const nextPrompt = generateInterviewPrompt(
        config,
        false,
        nextRound,
        isRoundTransition,
        currentRole,
        currentDifficulty,
        averageScore,
        answeredCount + 1
      );
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

      if (isRoundTransition) {
        setCurrentRound(nextRound);
        setRoundQuestionCount(0);
        toast.success(`Advancing to ${nextRound.charAt(0).toUpperCase() + nextRound.slice(1)} Round`);
      } else {
        setRoundQuestionCount(prev => prev + 1);
      }

      const feedback = extractFeedback(fullResponse);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fullResponse,
        feedback,
        timestamp: new Date(),
      }]);

      if (feedback) {
        if (feedback.difficulty) {
          setCurrentDifficulty(feedback.difficulty);
        }
        if (feedback.interviewerRole) {
          setCurrentRole(feedback.interviewerRole);
        }
        // Update average score
        const newTotalScore = (averageScore * answeredCount) + feedback.score;
        const newAverage = newTotalScore / (answeredCount + 1);
        setAverageScore(newAverage);
      }

      // Check for completion: either max total questions or finished all rounds in comprehensive mode
      // For now, let's stick to the round logic for comprehensive, and a fixed number for others
      const targetTotal = config.mode === 'comprehensive' ? QUESTIONS_PER_ROUND * 3 : 5;

      if (newAnsweredCount >= targetTotal) {
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
    const modelAnswerMatch = response.match(/model answer[:\s]+(.*?)(?=\n\n|$)/is);
    const roleMatch = response.match(/(HR Manager|Technical Lead|Behavioral Coach|Domain Expert)/i);
    const difficultyMatch = response.match(/difficulty[:\s]+(easy|medium|hard|expert)/i);

    const parseList = (text: string | undefined): string[] => {
      if (!text) return [];
      return text
        .split(/[•\-\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && item.length < 200)
        .slice(0, 3);
    };

    const getRole = (roleText: string | undefined): 'hr' | 'technical-lead' | 'behavioral-coach' | 'domain-expert' => {
      if (!roleText) return 'hr';
      const lower = roleText.toLowerCase();
      if (lower.includes('technical')) return 'technical-lead';
      if (lower.includes('behavioral')) return 'behavioral-coach';
      if (lower.includes('domain') || lower.includes('expert')) return 'domain-expert';
      return 'hr';
    };

    const getPersonality = (roleText: string | undefined): 'strict-engineer' | 'friendly-hr' | 'logical-analyst' | 'creative-solver' | 'ceo-visionary' => {
      if (!roleText) return 'friendly-hr';
      const lower = roleText.toLowerCase();
      if (lower.includes('strict')) return 'strict-engineer';
      if (lower.includes('logical')) return 'logical-analyst';
      if (lower.includes('creative')) return 'creative-solver';
      if (lower.includes('ceo') || lower.includes('visionary')) return 'ceo-visionary';
      return 'friendly-hr';
    };

    return {
      score,
      multiDimensionalScore: {
        technicalKnowledge: score,
        problemSolving: score,
        communication: score,
        behavioralSkills: score,
        culturalFit: score,
        overall: score,
      },
      strengths: parseList(strengthsMatch?.[1]),
      improvements: parseList(improvementsMatch?.[1]),
      suggestions: suggestionsMatch?.[1]?.trim().slice(0, 300) || 'Continue practicing and refining your responses.',
      modelAnswer: modelAnswerMatch?.[1]?.trim(),
      interviewerRole: getRole(roleMatch?.[1]),
      interviewerPersonality: getPersonality(roleMatch?.[1]),
      difficulty: (difficultyMatch?.[1]?.toLowerCase() as 'easy' | 'medium' | 'hard' | 'expert') || 'medium',
      timeSpent: 0,
    };
  };

  const generateFinalEvaluation = async (history: ConversationMessage[]) => {
    setIsGeneratingEvaluation(true);

    try {
      const evaluationPrompt = generateFinalEvaluationPrompt(config);
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
        problemSolvingScore: 7,
        culturalFitScore: 7,
        overallScore: 7,
        strengths: ['Good communication', 'Thoughtful responses', 'Professional demeanor'],
        weaknesses: ['Could provide more specific examples', 'Consider elaborating on technical details'],
        improvementPlan: [
          {
            week: 1,
            focus: 'Foundation Building',
            activities: ['Practice answering common interview questions', 'Prepare specific examples from your experience'],
            resources: [
              { title: 'Interview Preparation Guide', type: 'article', description: 'Comprehensive guide to interview prep', priority: 'high' }
            ],
            milestones: ['Complete 10 practice questions', 'Document 5 STAR stories']
          },
          {
            week: 2,
            focus: 'Technical Skills',
            activities: ['Review technical concepts', 'Practice coding challenges'],
            resources: [
              { title: 'Technical Interview Handbook', type: 'book', description: 'Essential technical interview guide', priority: 'high' }
            ],
            milestones: ['Solve 20 coding problems', 'Review core concepts']
          },
          {
            week: 3,
            focus: 'Behavioral Questions',
            activities: ['Study the STAR method', 'Prepare behavioral stories'],
            resources: [
              { title: 'STAR Method Course', type: 'course', description: 'Master behavioral interviews', priority: 'medium' }
            ],
            milestones: ['Prepare 10 behavioral stories', 'Practice with peers']
          },
          {
            week: 4,
            focus: 'Mock Interviews',
            activities: ['Conduct mock interviews', 'Get feedback from peers'],
            resources: [
              { title: 'Mock Interview Platform', type: 'exercise', description: 'Practice with real scenarios', priority: 'high' }
            ],
            milestones: ['Complete 3 mock interviews', 'Refine weak areas']
          }
        ],
        resources: [
          { title: 'Practice with mock interviews', type: 'exercise', description: 'Regular practice sessions', priority: 'high' },
          { title: 'Review common interview questions for your field', type: 'article', description: 'Industry-specific questions', priority: 'medium' },
          { title: 'Study the STAR method for behavioral questions', type: 'course', description: 'Behavioral interview technique', priority: 'medium' },
        ],
        advice: 'You demonstrated good potential in this interview. Focus on providing more specific examples and elaborating on your technical knowledge. Keep practicing and you will continue to improve!',
        performanceTrend: 'consistent',
        readinessLevel: 'needs-practice',
        detailedScorecard: [
          { category: 'Technical Knowledge', score: 7, feedback: 'Good foundation, needs more depth' },
          { category: 'Problem Solving', score: 7, feedback: 'Solid approach to problems' },
          { category: 'Communication', score: 7, feedback: 'Clear and professional' },
          { category: 'Behavioral Skills', score: 7, feedback: 'Good interpersonal awareness' },
          { category: 'Cultural Fit', score: 7, feedback: 'Aligns well with team values' },
        ],
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
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-foreground">Interview in Progress</h2>
                  <Badge variant="secondary" className="uppercase text-xs font-bold tracking-wider">
                    {currentRound} Round
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {config.name} • {config.desiredRole} • {config.mode} mode
                </p>
              </div>
              <div className="flex items-center gap-2">

                <Button variant="outline" onClick={onRestart} size="sm">
                  Exit Interview
                </Button>
              </div>
            </div>
            <ProgressIndicator
              currentQuestion={answeredCount + 1}
              totalQuestions={config.mode === 'comprehensive' ? QUESTIONS_PER_ROUND * 3 : 5}
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
            enableCognitiveTracking={config.enablePsychometricAnalysis}
          />
        )}
      </div>
    </div>
  );
};

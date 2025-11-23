import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, AlertCircle, Lightbulb, TrendingUp, Eye, EyeOff, Clock, Target } from 'lucide-react';
import type { QuestionFeedback } from '@/types/interview';

interface FeedbackCardProps {
  feedback: QuestionFeedback;
}

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-success';
  if (score >= 6) return 'text-warning';
  return 'text-destructive';
};

const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 8) return 'default';
  if (score >= 6) return 'secondary';
  return 'destructive';
};

const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    'hr': 'HR Manager',
    'technical-lead': 'Technical Lead',
    'behavioral-coach': 'Behavioral Coach',
    'domain-expert': 'Domain Expert',
  };
  return labels[role] || role;
};

const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    'easy': 'bg-success/10 text-success border-success/20',
    'medium': 'bg-warning/10 text-warning border-warning/20',
    'hard': 'bg-accent/10 text-accent border-accent/20',
    'expert': 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return colors[difficulty] || colors.medium;
};

export const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  return (
    <Card className="shadow-md border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Feedback</CardTitle>
            <Badge variant="outline" className="text-xs">
              {getRoleLabel(feedback.interviewerRole)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getDifficultyColor(feedback.difficulty)}>
              {feedback.difficulty.toUpperCase()}
            </Badge>
            <Badge variant={getScoreBadgeVariant(feedback.score)} className="text-base px-3 py-1">
              {feedback.score}/10
            </Badge>
          </div>
        </div>
        {feedback.timeSpent && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Clock className="w-3 h-3" />
            <span>Time spent: {Math.floor(feedback.timeSpent / 60)}m {feedback.timeSpent % 60}s</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Target className="w-4 h-4 text-primary" />
            <span>Multi-Dimensional Scores</span>
          </div>
          <div className="space-y-2">
            <ScoreBar label="Technical Knowledge" score={feedback.multiDimensionalScore.technicalKnowledge} />
            <ScoreBar label="Problem Solving" score={feedback.multiDimensionalScore.problemSolving} />
            <ScoreBar label="Communication" score={feedback.multiDimensionalScore.communication} />
            <ScoreBar label="Behavioral Skills" score={feedback.multiDimensionalScore.behavioralSkills} />
            <ScoreBar label="Cultural Fit" score={feedback.multiDimensionalScore.culturalFit} />
          </div>
        </div>

        {feedback.strengths.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-success">
              <ThumbsUp className="w-4 h-4" />
              <span className="font-semibold text-sm">Strengths</span>
            </div>
            <ul className="space-y-1 ml-6">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-foreground list-disc">
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.improvements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold text-sm">Areas for Improvement</span>
            </div>
            <ul className="space-y-1 ml-6">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="text-sm text-foreground list-disc">
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.suggestions && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="w-4 h-4" />
              <span className="font-semibold text-sm">Suggestions</span>
            </div>
            <p className="text-sm text-foreground ml-6">
              {feedback.suggestions}
            </p>
          </div>
        )}

        {feedback.modelAnswer && (
          <div className="space-y-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="w-full gap-2"
            >
              {showModelAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showModelAnswer ? 'Hide' : 'Show'} Model Answer
            </Button>
            {showModelAnswer && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {feedback.modelAnswer}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>Keep improving with each answer!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  const percentage = (score / 10) * 100;
  const getColor = (score: number) => {
    if (score >= 8) return 'bg-success';
    if (score >= 6) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{score}/10</span>
      </div>
      <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`absolute h-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
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

export const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  return (
    <Card className="shadow-md border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Feedback</CardTitle>
          <Badge variant={getScoreBadgeVariant(feedback.score)} className="text-base px-3 py-1">
            Score: {feedback.score}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

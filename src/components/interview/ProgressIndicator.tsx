import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export const ProgressIndicator = ({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions 
}: ProgressIndicatorProps) => {
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Interview Progress</span>
          <span className="text-muted-foreground">
            {answeredQuestions} of {totalQuestions} questions answered
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Answered: {answeredQuestions}</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-4 h-4 text-muted-foreground" />
            <span>Remaining: {totalQuestions - answeredQuestions}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

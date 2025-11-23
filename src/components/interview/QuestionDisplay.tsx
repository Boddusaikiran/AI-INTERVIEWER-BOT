import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Loader2 } from 'lucide-react';

interface QuestionDisplayProps {
  question: string;
  category?: 'technical' | 'behavioral' | 'situational' | 'communication';
  questionNumber: number;
  isLoading?: boolean;
}

const categoryColors = {
  technical: 'bg-primary/10 text-primary border-primary/20',
  behavioral: 'bg-accent/10 text-accent border-accent/20',
  situational: 'bg-success/10 text-success border-success/20',
  communication: 'bg-warning/10 text-warning border-warning/20',
};

const categoryLabels = {
  technical: 'Technical',
  behavioral: 'Behavioral',
  situational: 'Situational',
  communication: 'Communication',
};

export const QuestionDisplay = ({ 
  question, 
  category, 
  questionNumber, 
  isLoading 
}: QuestionDisplayProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Question {questionNumber}</span>
          </div>
          {category && (
            <Badge variant="outline" className={categoryColors[category]}>
              {categoryLabels[category]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Generating question...</span>
          </div>
        ) : (
          <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
            {question}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

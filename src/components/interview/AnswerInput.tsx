import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export const AnswerInput = ({ onSubmit, isSubmitting, disabled }: AnswerInputProps) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim() && !isSubmitting) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Answer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Type your answer here... (Ctrl+Enter to submit)"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting}
          className="min-h-[120px] resize-none"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {answer.length} characters
          </span>
          <Button 
            onClick={handleSubmit} 
            disabled={!answer.trim() || isSubmitting || disabled}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

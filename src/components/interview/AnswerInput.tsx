import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TypingMetrics {
  startTime: number;
  endTime: number;
  characterCount: number;
  pauseCount: number;
  correctionCount: number;
}

interface AnswerInputProps {
  onSubmit: (answer: string, metrics: TypingMetrics) => void;
  isSubmitting: boolean;
  disabled?: boolean;
  enableCognitiveTracking?: boolean;
}

export const AnswerInput = ({ onSubmit, isSubmitting, disabled, enableCognitiveTracking = true }: AnswerInputProps) => {
  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [correctionCount, setCorrectionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const lastKeystrokeTime = useRef<number>(0);
  const previousLength = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);





  useEffect(() => {
    if (startTime > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, isSubmitting]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const now = Date.now();

    if (!startTime) {
      setStartTime(now);
    }

    if (enableCognitiveTracking) {
      if (lastKeystrokeTime.current > 0 && now - lastKeystrokeTime.current > 2000) {
        setPauseCount(prev => prev + 1);
      }

      if (newValue.length < previousLength.current) {
        setCorrectionCount(prev => prev + 1);
      }

      lastKeystrokeTime.current = now;
      previousLength.current = newValue.length;
    }

    setAnswer(newValue);
  };

  const handleSubmit = () => {
    if (answer.trim() && !isSubmitting) {
      const metrics: TypingMetrics = {
        startTime: startTime || Date.now(),
        endTime: Date.now(),
        characterCount: answer.length,
        pauseCount,
        correctionCount,
      };
      onSubmit(answer.trim(), metrics);
      setAnswer('');
      setStartTime(0);
      setPauseCount(0);
      setCorrectionCount(0);
      setElapsedTime(0);
      lastKeystrokeTime.current = 0;
      previousLength.current = 0;

    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Answer</CardTitle>
          <div className="flex items-center gap-3">

            {enableCognitiveTracking && startTime > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Type your answer here... (Ctrl+Enter to submit)"
          value={answer}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting}
          className={cn(
            "min-h-[120px] resize-none transition-colors"
          )}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{answer.length} characters</span>
            {enableCognitiveTracking && startTime > 0 && (
              <>
                <span>•</span>
                <span>{pauseCount} pauses</span>
                <span>•</span>
                <span>{correctionCount} corrections</span>
              </>
            )}
          </div>
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


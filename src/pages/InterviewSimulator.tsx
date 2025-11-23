import React, { useState } from 'react';
import { ConfigurationForm } from '@/components/interview/ConfigurationForm';
import { InterviewSession } from '@/components/interview/InterviewSession';
import type { InterviewConfig } from '@/types/interview';

const InterviewSimulator = () => {
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);

  const handleStart = (config: InterviewConfig) => {
    setInterviewConfig(config);
  };

  const handleRestart = () => {
    setInterviewConfig(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {!interviewConfig ? (
        <ConfigurationForm onStart={handleStart} />
      ) : (
        <InterviewSession config={interviewConfig} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default InterviewSimulator;

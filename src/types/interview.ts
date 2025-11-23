export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'executive';
export type InterviewMode = 'technical' | 'behavioral' | 'comprehensive' | 'custom';
export type InterviewStage = 'configuration' | 'in-progress' | 'completed';

export interface CandidateProfile {
  name: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  desiredRole: string;
  jobDomain: string;
}

export interface InterviewConfig extends CandidateProfile {
  mode: InterviewMode;
}

export interface QuestionFeedback {
  strengths: string[];
  improvements: string[];
  score: number;
  suggestions: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'communication';
  timestamp: Date;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  feedback?: QuestionFeedback;
  timestamp: Date;
}

export interface ConversationMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface FinalEvaluation {
  technicalScore: number;
  behavioralScore: number;
  situationalScore: number;
  communicationScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementPlan: string[];
  resources: string[];
  advice: string;
}

export interface InterviewSession {
  config: InterviewConfig;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  currentQuestionIndex: number;
  stage: InterviewStage;
  conversationHistory: ConversationMessage[];
  finalEvaluation?: FinalEvaluation;
}

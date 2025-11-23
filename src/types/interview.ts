export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'executive';
export type InterviewMode = 'technical' | 'behavioral' | 'comprehensive' | 'custom';
export type InterviewStage = 'configuration' | 'in-progress' | 'completed';
export type InterviewRound = 'screening' | 'technical' | 'behavioral' | 'final';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type InterviewerRole = 'hr' | 'technical-lead' | 'behavioral-coach' | 'domain-expert';

export interface CandidateProfile {
  name: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  desiredRole: string;
  jobDomain: string;
}

export interface InterviewConfig extends CandidateProfile {
  mode: InterviewMode;
  round: InterviewRound;
  enablePressureMode: boolean;
  enableHints: boolean;
}

export interface MultiDimensionalScore {
  technicalKnowledge: number;
  problemSolving: number;
  communication: number;
  behavioralSkills: number;
  culturalFit: number;
  overall: number;
}

export interface QuestionFeedback {
  strengths: string[];
  improvements: string[];
  score: number;
  multiDimensionalScore: MultiDimensionalScore;
  suggestions: string;
  modelAnswer?: string;
  interviewerRole: InterviewerRole;
  difficulty: DifficultyLevel;
  timeSpent?: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'communication' | 'quick-fire';
  difficulty: DifficultyLevel;
  interviewerRole: InterviewerRole;
  timestamp: Date;
  timeLimit?: number;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  feedback?: QuestionFeedback;
  timestamp: Date;
  timeSpent: number;
  hintsUsed: number;
}

export interface ConversationMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface LearningResource {
  title: string;
  type: 'course' | 'book' | 'article' | 'exercise' | 'video';
  description: string;
  url?: string;
}

export interface ImprovementPlanStep {
  week: number;
  focus: string;
  activities: string[];
  resources: LearningResource[];
}

export interface FinalEvaluation {
  technicalScore: number;
  behavioralScore: number;
  situationalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  culturalFitScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementPlan: ImprovementPlanStep[];
  resources: LearningResource[];
  advice: string;
  performanceTrend: 'improving' | 'consistent' | 'declining';
  readinessLevel: 'ready' | 'needs-practice' | 'needs-significant-work';
}

export interface PerformanceMetrics {
  averageScore: number;
  averageTimePerQuestion: number;
  hintsUsed: number;
  difficultyProgression: DifficultyLevel[];
  strongCategories: string[];
  weakCategories: string[];
}

export interface InterviewSession {
  config: InterviewConfig;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  currentQuestionIndex: number;
  stage: InterviewStage;
  conversationHistory: ConversationMessage[];
  finalEvaluation?: FinalEvaluation;
  performanceMetrics: PerformanceMetrics;
  currentDifficulty: DifficultyLevel;
}

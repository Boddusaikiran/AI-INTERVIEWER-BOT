export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'executive';
export type InterviewMode = 'technical' | 'behavioral' | 'comprehensive' | 'custom';
export type InterviewStage = 'configuration' | 'in-progress' | 'completed';
export type InterviewRound = 'screening' | 'technical' | 'behavioral' | 'final';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
export type InterviewerRole = 'hr' | 'technical-lead' | 'behavioral-coach' | 'domain-expert';
export type InterviewerPersonality = 'strict-engineer' | 'friendly-hr' | 'logical-analyst' | 'creative-solver' | 'ceo-visionary';
export type BrainMode = 'analytical' | 'creative' | 'execution' | 'social';
export type ScenarioType = 'crisis-management' | 'team-conflict' | 'deadline-pressure' | 'client-escalation' | 'budget-limitation' | 'leadership-challenge';

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
  enableCodingChallenges: boolean;
  enablePsychometricAnalysis: boolean;
  selectedPersonalities: InterviewerPersonality[];
  brainMode: BrainMode;
}

export interface CognitiveMetrics {
  thinkingSpeed: number;
  logicalStructure: number;
  depthOfReasoning: number;
  emotionalTone: 'positive' | 'neutral' | 'stressed' | 'confident';
  stressLevel: number;
  typingPatterns: {
    averageSpeed: number;
    pauseFrequency: number;
    correctionRate: number;
  };
}

export interface PsychometricProfile {
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  mbtiType: string;
  iqScore: number;
  motivationScore: number;
  reliabilityScore: number;
  leadershipStyle: string;
  communicationStyle: string;
}

export interface BehavioralAnalysis {
  empathy: number;
  leadershipPotential: number;
  decisionMakingSpeed: number;
  communicationEffectiveness: number;
  motivationSignals: string[];
  pressureHandling: number;
  teamworkOrientation: number;
  conflictResolution: number;
}

export interface KnowledgeGap {
  topic: string;
  severity: 'minor' | 'moderate' | 'critical';
  detectedAt: number;
  suggestedResources: LearningResource[];
}

export interface DeceptionIndicators {
  overconfidenceDetected: boolean;
  bluffingSignals: string[];
  memorizedAnswers: boolean;
  accountabilityAvoidance: boolean;
  confidenceScore: number;
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
  interviewerPersonality: InterviewerPersonality;
  difficulty: DifficultyLevel;
  timeSpent?: number;
  cognitiveMetrics?: CognitiveMetrics;
  knowledgeGaps?: KnowledgeGap[];
  deceptionIndicators?: DeceptionIndicators;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'communication' | 'quick-fire' | 'coding' | 'scenario';
  difficulty: DifficultyLevel;
  interviewerRole: InterviewerRole;
  interviewerPersonality: InterviewerPersonality;
  brainMode: BrainMode;
  scenarioType?: ScenarioType;
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
  typingMetrics: {
    startTime: number;
    endTime: number;
    characterCount: number;
    pauseCount: number;
    correctionCount: number;
  };
}

export interface ConversationMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface LearningResource {
  title: string;
  type: 'course' | 'book' | 'article' | 'exercise' | 'video' | 'practice-platform';
  description: string;
  url?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: string;
}

export interface ImprovementPlanStep {
  week: number;
  focus: string;
  activities: string[];
  resources: LearningResource[];
  milestones: string[];
}

export interface JobFitPrediction {
  overallFitScore: number;
  industryAlignment: number;
  roleAlignment: number;
  cultureAlignment: number;
  successLikelihood: number;
  comparisonWithSuccessfulCandidates: string;
  recommendations: string[];
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
  psychometricProfile?: PsychometricProfile;
  behavioralAnalysis?: BehavioralAnalysis;
  cognitiveProfile?: CognitiveMetrics;
  knowledgeGaps?: KnowledgeGap[];
  jobFitPrediction?: JobFitPrediction;
  detailedScorecard: {
    category: string;
    score: number;
    feedback: string;
  }[];
}

export interface PerformanceMetrics {
  averageScore: number;
  averageTimePerQuestion: number;
  hintsUsed: number;
  difficultyProgression: DifficultyLevel[];
  strongCategories: string[];
  weakCategories: string[];
  cognitiveMetrics: CognitiveMetrics;
  behavioralMetrics: BehavioralAnalysis;
}

export interface SessionHistory {
  sessionId: string;
  date: Date;
  overallScore: number;
  duration: number;
  questionsAnswered: number;
  improvements: string[];
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
  currentBrainMode: BrainMode;
  currentPersonality: InterviewerPersonality;
  sessionHistory: SessionHistory[];
  userId: string;
}

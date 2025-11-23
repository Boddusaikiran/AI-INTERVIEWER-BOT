import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, AlertTriangle, BookOpen, Lightbulb, RotateCcw, Brain, Target, Zap, Users } from 'lucide-react';
import type { FinalEvaluation } from '@/types/interview';

interface EvaluationReportProps {
  evaluation: FinalEvaluation;
  candidateName: string;
  onRestart: () => void;
}

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  const percentage = (score / 10) * 100;
  const getColor = (score: number) => {
    if (score >= 8) return 'bg-success';
    if (score >= 6) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-foreground">{score}/10</span>
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`absolute h-full ${getColor(score)} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const EvaluationReport = ({ evaluation, candidateName, onRestart }: EvaluationReportProps) => {
  const getOverallRating = (score: number): { label: string; color: string } => {
    if (score >= 9) return { label: 'Excellent', color: 'bg-success text-success-foreground' };
    if (score >= 7) return { label: 'Good', color: 'bg-primary text-primary-foreground' };
    if (score >= 5) return { label: 'Fair', color: 'bg-warning text-warning-foreground' };
    return { label: 'Needs Improvement', color: 'bg-destructive text-destructive-foreground' };
  };

  const rating = getOverallRating(evaluation.overallScore);

  return (
    <div className="min-h-screen p-4 space-y-6">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Interview Complete!</CardTitle>
              <p className="text-muted-foreground">
                Comprehensive evaluation for {candidateName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-accent" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-4 p-6 bg-muted/50 rounded-lg">
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-primary mb-2">
                {evaluation.overallScore.toFixed(1)}
              </div>
              <Badge className={rating.color}>
                {rating.label}
              </Badge>
              <div className="flex gap-2 justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  Trend: {evaluation.performanceTrend}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {evaluation.readinessLevel.replace(/-/g, ' ')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Breakdown
            </h3>
            <div className="space-y-4">
              <ScoreBar label="Technical Skills" score={evaluation.technicalScore} />
              <ScoreBar label="Behavioral Competencies" score={evaluation.behavioralScore} />
              <ScoreBar label="Situational Judgment" score={evaluation.situationalScore} />
              <ScoreBar label="Communication Skills" score={evaluation.communicationScore} />
              <ScoreBar label="Problem Solving" score={evaluation.problemSolvingScore} />
              <ScoreBar label="Cultural Fit" score={evaluation.culturalFitScore} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-success" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-success mt-1">✓</span>
                  <span className="text-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-warning mt-1">⚠</span>
                  <span className="text-foreground">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            Personalized Improvement Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {evaluation.improvementPlan.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {step.week}
                  </span>
                  <span className="font-semibold text-sm text-foreground">{step.focus}</span>
                </div>
                <ul className="ml-8 space-y-1">
                  {step.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="text-sm text-muted-foreground list-disc">
                      {activity}
                    </li>
                  ))}
                </ul>
                {step.resources.length > 0 && (
                  <div className="ml-8 mt-2">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Resources:</p>
                    <ul className="space-y-1">
                      {step.resources.map((resource, resIndex) => (
                        <li key={resIndex} className="text-xs text-muted-foreground">
                          • {resource.title} ({resource.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Recommended Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {evaluation.resources.map((resource, index) => (
              <li key={index} className="space-y-1">
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-1">📚</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                    <span className="text-xs text-primary">{resource.type}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {evaluation.psychometricProfile && (
        <Card className="shadow-md border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Psychometric Profile Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Big Five Personality Traits (OCEAN)</h4>
              <div className="space-y-3">
                <ScoreBar label="Openness" score={evaluation.psychometricProfile.bigFive.openness} />
                <ScoreBar label="Conscientiousness" score={evaluation.psychometricProfile.bigFive.conscientiousness} />
                <ScoreBar label="Extraversion" score={evaluation.psychometricProfile.bigFive.extraversion} />
                <ScoreBar label="Agreeableness" score={evaluation.psychometricProfile.bigFive.agreeableness} />
                <ScoreBar label="Neuroticism (Emotional Stability)" score={10 - evaluation.psychometricProfile.bigFive.neuroticism} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">MBTI Type</p>
                <Badge variant="secondary" className="text-sm font-bold">{evaluation.psychometricProfile.mbtiType}</Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">IQ Score</p>
                <Badge variant="secondary" className="text-sm font-bold">{evaluation.psychometricProfile.iqScore}</Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Motivation</p>
                <Badge variant="secondary" className="text-sm font-bold">{evaluation.psychometricProfile.motivationScore}/10</Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Reliability</p>
                <Badge variant="secondary" className="text-sm font-bold">{evaluation.psychometricProfile.reliabilityScore}/10</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Leadership Style</p>
                <p className="text-sm font-medium text-foreground">{evaluation.psychometricProfile.leadershipStyle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Communication Style</p>
                <p className="text-sm font-medium text-foreground">{evaluation.psychometricProfile.communicationStyle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {evaluation.behavioralAnalysis && (
        <Card className="shadow-md border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Behavioral & Soft Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreBar label="Empathy" score={evaluation.behavioralAnalysis.empathy} />
            <ScoreBar label="Leadership Potential" score={evaluation.behavioralAnalysis.leadershipPotential} />
            <ScoreBar label="Decision Making Speed" score={evaluation.behavioralAnalysis.decisionMakingSpeed} />
            <ScoreBar label="Communication Effectiveness" score={evaluation.behavioralAnalysis.communicationEffectiveness} />
            <ScoreBar label="Pressure Handling" score={evaluation.behavioralAnalysis.pressureHandling} />
            <ScoreBar label="Teamwork Orientation" score={evaluation.behavioralAnalysis.teamworkOrientation} />
            <ScoreBar label="Conflict Resolution" score={evaluation.behavioralAnalysis.conflictResolution} />
            
            {evaluation.behavioralAnalysis.motivationSignals.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Motivation Signals Detected:</p>
                <div className="flex flex-wrap gap-2">
                  {evaluation.behavioralAnalysis.motivationSignals.map((signal, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{signal}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {evaluation.cognitiveProfile && (
        <Card className="shadow-md border-l-4 border-l-success">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-success" />
              Cognitive Intelligence Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreBar label="Thinking Speed" score={evaluation.cognitiveProfile.thinkingSpeed} />
            <ScoreBar label="Logical Structure" score={evaluation.cognitiveProfile.logicalStructure} />
            <ScoreBar label="Depth of Reasoning" score={evaluation.cognitiveProfile.depthOfReasoning} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Emotional Tone</p>
                <Badge variant="secondary" className="text-xs capitalize">{evaluation.cognitiveProfile.emotionalTone}</Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Stress Level</p>
                <Badge variant="secondary" className="text-xs">{evaluation.cognitiveProfile.stressLevel}/10</Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Typing Speed</p>
                <Badge variant="secondary" className="text-xs">{evaluation.cognitiveProfile.typingPatterns.averageSpeed} cpm</Badge>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Corrections</p>
                <Badge variant="secondary" className="text-xs">{evaluation.cognitiveProfile.typingPatterns.correctionRate}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {evaluation.jobFitPrediction && (
        <Card className="shadow-md border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              Job-Fit Prediction & Success Likelihood
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Overall Fit</p>
                <p className="text-2xl font-bold text-primary">{evaluation.jobFitPrediction.overallFitScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Industry Alignment</p>
                <p className="text-2xl font-bold text-foreground">{evaluation.jobFitPrediction.industryAlignment}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Role Alignment</p>
                <p className="text-2xl font-bold text-foreground">{evaluation.jobFitPrediction.roleAlignment}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Success Likelihood</p>
                <p className="text-2xl font-bold text-success">{evaluation.jobFitPrediction.successLikelihood}%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Comparison with Successful Candidates:</p>
              <p className="text-sm text-foreground">{evaluation.jobFitPrediction.comparisonWithSuccessfulCandidates}</p>
            </div>

            {evaluation.jobFitPrediction.recommendations.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {evaluation.jobFitPrediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-warning mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {evaluation.knowledgeGaps && evaluation.knowledgeGaps.length > 0 && (
        <Card className="shadow-md border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Knowledge Gaps Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evaluation.knowledgeGaps.map((gap, idx) => (
                <div key={idx} className="p-3 bg-destructive/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{gap.topic}</p>
                    <Badge 
                      variant={gap.severity === 'critical' ? 'destructive' : gap.severity === 'moderate' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {gap.severity}
                    </Badge>
                  </div>
                  {gap.suggestedResources.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Suggested Resources:</p>
                      <ul className="space-y-1">
                        {gap.suggestedResources.map((resource, ridx) => (
                          <li key={ridx} className="text-xs text-foreground">
                            • {resource.title} ({resource.type})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Final Advice for Real Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {evaluation.advice}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button onClick={onRestart} size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Start New Interview
        </Button>
      </div>
    </div>
  );
};

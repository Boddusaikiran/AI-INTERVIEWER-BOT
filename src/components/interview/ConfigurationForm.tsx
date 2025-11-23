import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Briefcase, Users, Zap, Lightbulb, Brain, Target, Code } from 'lucide-react';
import type { InterviewConfig, ExperienceLevel, InterviewMode, InterviewRound, BrainMode, InterviewerPersonality } from '@/types/interview';

interface ConfigurationFormProps {
  onStart: (config: InterviewConfig) => void;
}

export const ConfigurationForm = ({ onStart }: ConfigurationFormProps) => {
  const [name, setName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('mid');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [desiredRole, setDesiredRole] = useState('');
  const [jobDomain, setJobDomain] = useState('');
  const [mode, setMode] = useState<InterviewMode>('comprehensive');
  const [round, setRound] = useState<InterviewRound>('screening');
  const [brainMode, setBrainMode] = useState<BrainMode>('analytical');
  const [enablePressureMode, setEnablePressureMode] = useState(false);
  const [enableHints, setEnableHints] = useState(true);
  const [enableCodingChallenges, setEnableCodingChallenges] = useState(false);
  const [enablePsychometricAnalysis, setEnablePsychometricAnalysis] = useState(true);
  const [selectedPersonalities, setSelectedPersonalities] = useState<InterviewerPersonality[]>(['friendly-hr', 'logical-analyst']);

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const togglePersonality = (personality: InterviewerPersonality) => {
    if (selectedPersonalities.includes(personality)) {
      setSelectedPersonalities(selectedPersonalities.filter(p => p !== personality));
    } else {
      if (selectedPersonalities.length < 3) {
        setSelectedPersonalities([...selectedPersonalities, personality]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !desiredRole.trim() || !jobDomain.trim() || skills.length === 0) {
      return;
    }

    onStart({
      name: name.trim(),
      experienceLevel,
      skills,
      desiredRole: desiredRole.trim(),
      jobDomain: jobDomain.trim(),
      mode,
      round,
      brainMode,
      enablePressureMode,
      enableHints,
      enableCodingChallenges,
      enablePsychometricAnalysis,
      selectedPersonalities: selectedPersonalities.length > 0 ? selectedPersonalities : ['friendly-hr'],
    });
  };

  const isFormValid = name.trim() && desiredRole.trim() && jobDomain.trim() && skills.length > 0;

  const personalityLabels: Record<InterviewerPersonality, string> = {
    'strict-engineer': '🔧 Strict Engineer',
    'friendly-hr': '😊 Friendly HR',
    'logical-analyst': '🧠 Logical Analyst',
    'creative-solver': '🎨 Creative Solver',
    'ceo-visionary': '👔 CEO Visionary',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Professional Interview Simulator</CardTitle>
              <CardDescription className="text-base mt-1">
                Configure your profile for an ultra-realistic, psychologically intelligent interview
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={(value) => setExperienceLevel(value as ExperienceLevel)}>
                  <SelectTrigger id="experienceLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                    <SelectItem value="executive">Executive (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mode">Interview Mode</Label>
                <Select value={mode} onValueChange={(value) => setMode(value as InterviewMode)}>
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Focus</SelectItem>
                    <SelectItem value="behavioral">Behavioral Focus</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="round">Interview Round</Label>
                <Select value={round} onValueChange={(value) => setRound(value as InterviewRound)}>
                  <SelectTrigger id="round">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screening">Screening Round</SelectItem>
                    <SelectItem value="technical">Technical Round</SelectItem>
                    <SelectItem value="behavioral">Behavioral Round</SelectItem>
                    <SelectItem value="final">Final Round</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brainMode">Brain Mode</Label>
                <Select value={brainMode} onValueChange={(value) => setBrainMode(value as BrainMode)}>
                  <SelectTrigger id="brainMode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analytical">🧮 Analytical Brain</SelectItem>
                    <SelectItem value="creative">🎨 Creative Brain</SelectItem>
                    <SelectItem value="execution">⚡ Execution Brain</SelectItem>
                    <SelectItem value="social">🤝 Social Brain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desiredRole">Desired Role</Label>
              <Input
                id="desiredRole"
                placeholder="e.g., Senior Software Engineer, Product Manager"
                value={desiredRole}
                onChange={(e) => setDesiredRole(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDomain">Job Domain</Label>
              <Input
                id="jobDomain"
                placeholder="e.g., Web Development, Data Science, Marketing"
                value={jobDomain}
                onChange={(e) => setJobDomain(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  placeholder="Add a skill and press Enter or click Add"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <Label className="text-base font-semibold">Interviewer Personalities (Select up to 3)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.keys(personalityLabels) as InterviewerPersonality[]).map((personality) => (
                  <Button
                    key={personality}
                    type="button"
                    variant={selectedPersonalities.includes(personality) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePersonality(personality)}
                    className="justify-start text-xs"
                  >
                    {personalityLabels[personality]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <div>
                    <Label htmlFor="pressureMode" className="cursor-pointer">Pressure Test Mode</Label>
                    <p className="text-xs text-muted-foreground">Rapid-fire questions and high-stress scenarios</p>
                  </div>
                </div>
                <Switch
                  id="pressureMode"
                  checked={enablePressureMode}
                  onCheckedChange={setEnablePressureMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-warning" />
                  <div>
                    <Label htmlFor="hints" className="cursor-pointer">Enable Hints</Label>
                    <p className="text-xs text-muted-foreground">Get helpful guidance when struggling</p>
                  </div>
                </div>
                <Switch
                  id="hints"
                  checked={enableHints}
                  onCheckedChange={setEnableHints}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  <div>
                    <Label htmlFor="coding" className="cursor-pointer">Coding Challenges</Label>
                    <p className="text-xs text-muted-foreground">Include live coding and debugging tasks</p>
                  </div>
                </div>
                <Switch
                  id="coding"
                  checked={enableCodingChallenges}
                  onCheckedChange={setEnableCodingChallenges}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-success" />
                  <div>
                    <Label htmlFor="psychometric" className="cursor-pointer">Psychometric Analysis</Label>
                    <p className="text-xs text-muted-foreground">Big 5, MBTI, cognitive & behavioral profiling</p>
                  </div>
                </div>
                <Switch
                  id="psychometric"
                  checked={enablePsychometricAnalysis}
                  onCheckedChange={setEnablePsychometricAnalysis}
                />
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Ultra-Realistic AI Interview Experience</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Experience a psychologically intelligent interview with cognitive analysis, behavioral profiling, 
                knowledge gap detection, and job-fit prediction. Multiple interviewer personalities will assess 
                different aspects of your capabilities.
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!isFormValid}>
              Start Advanced Interview
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Briefcase } from 'lucide-react';
import type { InterviewConfig, ExperienceLevel, InterviewMode } from '@/types/interview';

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

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
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
    });
  };

  const isFormValid = name.trim() && desiredRole.trim() && jobDomain.trim() && skills.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Professional Interview Simulator</CardTitle>
              <CardDescription className="text-base mt-1">
                Configure your profile to begin the interview simulation
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

            <Button type="submit" className="w-full" size="lg" disabled={!isFormValid}>
              Start Interview
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

import type { ConversationMessage, InterviewConfig, DifficultyLevel, InterviewerRole } from '@/types/interview';

const API_URL = 'https://api-integrations.appmedo.com/app-7r2i8yv7gnwh/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';
const APP_ID = import.meta.env.VITE_APP_ID || 'app-7r2i8yv7gnwh';

export interface StreamChunk {
  text: string;
  isComplete: boolean;
}

const getInterviewerRoleDescription = (role: InterviewerRole): string => {
  const roles = {
    'hr': 'HR Manager focusing on cultural fit, communication skills, and behavioral competencies',
    'technical-lead': 'Technical Lead evaluating technical knowledge, problem-solving abilities, and coding skills',
    'behavioral-coach': 'Behavioral Coach assessing emotional intelligence, teamwork, leadership, and adaptability using STAR method',
    'domain-expert': 'Domain Expert testing deep industry knowledge and real-world scenario handling'
  };
  return roles[role];
};

const getDifficultyGuidance = (difficulty: DifficultyLevel, averageScore: number): string => {
  if (averageScore >= 8) {
    return 'The candidate is performing excellently. Increase difficulty to expert level with complex scenarios and edge cases.';
  }
  if (averageScore >= 6) {
    return 'The candidate is performing well. Maintain medium to hard difficulty with challenging but fair questions.';
  }
  if (averageScore >= 4) {
    return 'The candidate is struggling. Provide easier questions and consider offering hints to build confidence.';
  }
  return 'The candidate needs significant support. Ask foundational questions and provide encouraging hints.';
};

export const generateInterviewPrompt = (
  config: InterviewConfig, 
  isInitial: boolean, 
  currentRole: InterviewerRole = 'hr',
  currentDifficulty: DifficultyLevel = 'medium',
  averageScore: number = 0,
  questionCount: number = 0
): string => {
  if (isInitial) {
    return `You are conducting a multi-role panel interview simulation. You will rotate between different interviewer perspectives:

1. HR Manager - Cultural fit, communication, behavioral competencies
2. Technical Lead - Technical skills, problem-solving, coding abilities
3. Behavioral Coach - Emotional intelligence, STAR method, leadership
4. Domain Expert - Industry knowledge, real-world scenarios

Interview Configuration:
- Candidate: ${config.name}
- Experience Level: ${config.experienceLevel}
- Skills: ${config.skills.join(', ')}
- Desired Role: ${config.desiredRole}
- Job Domain: ${config.jobDomain}
- Interview Mode: ${config.mode}
- Interview Round: ${config.round}
- Pressure Mode: ${config.enablePressureMode ? 'Enabled (include time-sensitive questions)' : 'Disabled'}
- Hints Available: ${config.enableHints ? 'Yes' : 'No'}

CRITICAL INSTRUCTIONS:
1. Start with a warm, professional greeting introducing the panel interview format
2. Explain that different interviewers will ask questions from their perspectives
3. Begin with the FIRST question from the HR Manager perspective
4. Ask ONLY ONE question at a time
5. For behavioral questions, explicitly mention using the STAR method (Situation, Task, Action, Result)
6. Adapt difficulty based on candidate performance
7. After each answer, provide detailed feedback with:
   - Interviewer role providing feedback
   - Multi-dimensional scores (Technical Knowledge, Problem Solving, Communication, Behavioral Skills, Cultural Fit)
   - Specific strengths and improvements
   - A model answer example
   - Suggestions for improvement
   - Overall score (1-10)
   - Difficulty level of the question

Format your response as:
[GREETING AND INTRODUCTION]

[INTERVIEWER ROLE]: [Question]

Begin now with your greeting and first question from HR Manager.`;
  }

  const roleDescription = getInterviewerRoleDescription(currentRole);
  const difficultyGuidance = getDifficultyGuidance(currentDifficulty, averageScore);

  return `You are now speaking as: ${roleDescription}

Current Performance Context:
- Questions answered: ${questionCount}
- Average score so far: ${averageScore.toFixed(1)}/10
- Current difficulty level: ${currentDifficulty}
- ${difficultyGuidance}

INSTRUCTIONS:
1. First, provide comprehensive feedback on the candidate's previous answer:
   - State your interviewer role
   - Give multi-dimensional scores (Technical Knowledge, Problem Solving, Communication, Behavioral Skills, Cultural Fit) each out of 10
   - List 2-3 specific strengths
   - List 1-2 areas for improvement
   - Provide a brief model answer example
   - Give actionable suggestions
   - Provide overall score (1-10)
   - State the difficulty level

2. Then, ask the NEXT question appropriate for your role and the candidate's performance level
3. If candidate is struggling and hints are enabled, subtly guide them
4. Rotate interviewer roles naturally (HR → Technical Lead → Behavioral Coach → Domain Expert → repeat)
5. For behavioral questions, remind candidate to use STAR method
6. ${config.enablePressureMode ? 'Include time pressure or complex scenarios' : 'Keep questions fair and balanced'}

Provide your feedback and next question now.`;
};

export const generateFinalEvaluationPrompt = (): string => {
  return `Based on the entire interview conversation, provide a comprehensive final evaluation in the following JSON format:

{
  "technicalScore": <number 1-10>,
  "behavioralScore": <number 1-10>,
  "situationalScore": <number 1-10>,
  "communicationScore": <number 1-10>,
  "problemSolvingScore": <number 1-10>,
  "culturalFitScore": <number 1-10>,
  "overallScore": <number 1-10>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvementPlan": [
    {
      "week": 1,
      "focus": "Focus area for week 1",
      "activities": ["activity 1", "activity 2"],
      "resources": [
        {
          "title": "Resource title",
          "type": "course",
          "description": "Resource description",
          "url": "https://example.com"
        }
      ]
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "type": "book",
      "description": "Resource description"
    }
  ],
  "advice": "Detailed advice for real interviews",
  "performanceTrend": "improving",
  "readinessLevel": "needs-practice"
}

IMPORTANT:
- Provide a 4-week improvement plan with specific weekly focus areas
- Include diverse learning resources (courses, books, articles, exercises, videos)
- Analyze performance trend (improving/consistent/declining) based on score progression
- Assess readiness level (ready/needs-practice/needs-significant-work)
- Give specific, actionable advice for real interviews
- Be encouraging but honest in the assessment

Provide only the JSON object, no additional text.`;
};

export const generateHintPrompt = (question: string, answer: string): string => {
  return `The candidate is struggling with this question:
"${question}"

Their current answer attempt:
"${answer}"

Provide a helpful hint that:
1. Guides them toward a better answer without giving it away completely
2. Highlights what they might be missing
3. Encourages them to think about specific aspects
4. Remains supportive and constructive

Keep the hint brief (2-3 sentences) and actionable.`;
};

export async function* streamInterviewResponse(
  conversationHistory: ConversationMessage[]
): AsyncGenerator<StreamChunk> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({
        contents: conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            yield { text: '', isComplete: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
              yield { text, isComplete: false };
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    yield { text: '', isComplete: true };
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
}

export const callInterviewAPI = async (
  conversationHistory: ConversationMessage[]
): Promise<string> => {
  let fullResponse = '';
  
  for await (const chunk of streamInterviewResponse(conversationHistory)) {
    if (!chunk.isComplete) {
      fullResponse += chunk.text;
    }
  }
  
  return fullResponse;
};

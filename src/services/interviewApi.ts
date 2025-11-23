import type { ConversationMessage, InterviewConfig } from '@/types/interview';

const API_URL = 'https://api-integrations.appmedo.com/app-7r2i8yv7gnwh/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';
const APP_ID = import.meta.env.VITE_APP_ID || 'app-7r2i8yv7gnwh';

export interface StreamChunk {
  text: string;
  isComplete: boolean;
}

export const generateInterviewPrompt = (config: InterviewConfig, isInitial: boolean): string => {
  if (isInitial) {
    return `You are an expert AI interviewer combining perspectives from senior HR, technical leadership, behavioral psychology, and career coaching. You are conducting a ${config.mode} interview for a ${config.experienceLevel} level ${config.desiredRole} position in the ${config.jobDomain} domain.

Candidate Profile:
- Name: ${config.name}
- Experience Level: ${config.experienceLevel}
- Skills: ${config.skills.join(', ')}
- Desired Role: ${config.desiredRole}
- Job Domain: ${config.jobDomain}

Your task:
1. Start with a professional greeting and brief explanation of the interview structure
2. Ask ONE question at a time covering:
   - Core technical skills (if technical/comprehensive mode)
   - Problem-solving and analytical thinking
   - Behavioral competencies (teamwork, leadership, adaptability)
   - Situational judgment and real-world scenarios
   - Cultural fit and communication skills
3. Adjust difficulty based on candidate responses
4. Ask intelligent follow-up questions for deeper probing
5. Provide constructive feedback after each answer including:
   - Strengths in the response
   - Areas for improvement
   - Score (1-10) for the answer
   - Suggestions for better responses

Keep a professional, welcoming tone. Make the interview feel realistic and engaging.

Begin the interview now with your greeting and first question.`;
  }

  return 'Based on the candidate\'s previous answer, provide immediate feedback and then ask the next appropriate question. Remember to adjust difficulty based on their performance.';
};

export const generateFinalEvaluationPrompt = (): string => {
  return `Based on the entire interview conversation, provide a comprehensive final evaluation in the following JSON format:

{
  "technicalScore": <number 1-10>,
  "behavioralScore": <number 1-10>,
  "situationalScore": <number 1-10>,
  "communicationScore": <number 1-10>,
  "overallScore": <number 1-10>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvementPlan": ["action 1", "action 2", "action 3"],
  "resources": ["resource 1", "resource 2", "resource 3"],
  "advice": "Detailed advice for real interviews"
}

Provide only the JSON object, no additional text.`;
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

import type { ConversationMessage, InterviewConfig, DifficultyLevel, InterviewerRole, InterviewRound } from '@/types/interview';

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

const getDifficultyGuidance = (averageScore: number): string => {
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
  currentRound: InterviewRound = 'screening',
  isRoundTransition: boolean = false,
  currentRole: InterviewerRole = 'hr',
  currentDifficulty: DifficultyLevel = 'medium',
  averageScore: number = 0,
  questionCount: number = 0
): string => {
  const personalityDescriptions = {
    'strict-engineer': 'Strict, detail-oriented, focuses on edge cases and optimization. Low tolerance for vague answers.',
    'friendly-hr': 'Warm, professional, focuses on culture fit and soft skills. Encouraging but observant.',
    'logical-analyst': 'Methodical, data-driven, deconstructs arguments. Looks for structured thinking.',
    'creative-solver': 'Open-minded, appreciates novel solutions. Asks "what if" questions.',
    'ceo-visionary': 'Big-picture focused, strategic, business-value oriented. Impatient with minor details.'
  };

  const brainModeDescriptions = {
    'analytical': 'Focus on logic, data structures, algorithms, and system architecture.',
    'creative': 'Focus on innovation, design thinking, and problem-solving flexibility.',
    'execution': 'Focus on delivery, project management, and getting things done.',
    'social': 'Focus on team dynamics, leadership, and communication.'
  };

  const roundFocus: Record<InterviewRound, string> = {
    'screening': 'Verify resume details, basic qualifications, communication skills, and cultural fit. Keep questions relatively high-level but probing.',
    'technical': 'Deep dive into technical skills, system design, coding concepts, and problem-solving. Challenge the candidate with specific technical scenarios.',
    'behavioral': 'Focus on STAR method (Situation, Task, Action, Result). Assess leadership, conflict resolution, and soft skills.',
    'final': 'Executive presence, strategic thinking, long-term vision, and cultural alignment at a leadership level.'
  };

  if (isInitial) {
    return `You are an ULTRA-ADVANCED AI INTERVIEW SIMULATOR with psychologically intelligent capabilities. You will conduct a comprehensive interview using multiple advanced analysis frameworks.

CURRENT ROUND: ${currentRound.toUpperCase()}
ROUND FOCUS: ${roundFocus[currentRound]}

🧠 COGNITIVE ANALYSIS FRAMEWORKS:
1. **Cognitive Reasoning Tree (CoT + ToT + GoT Fusion)**
   - Chain of Thought: Track linear reasoning
   - Tree of Thought: Map decision branching
   - Graph of Thought: Analyze interconnected thinking patterns
   - Produce: Thought-pattern mapping, logical branching analysis, problem-solving style detection

2. **Meta-Learning Evaluation**
   - Track if candidate learns from mistakes
   - Monitor strategy adaptation during interview
   - Assess real-time feedback integration
   - Measure improvement trajectory

3. **Cognitive Bias Detection**
   - Identify: confirmation bias, authority bias, overconfidence, emotional bias, avoidance behavior
   - Provide professional-level bias analysis

4. **Attention Drift Mapping**
   - Detect consistency of thought, loss of focus, hesitation, abrupt reasoning shifts

5. **Brain-Lateralization Assessment**
   - Identify left-brain dominance (logic, structure) vs right-brain dominance (creativity, vision)
   - Adjust questions accordingly

🎭 INTERVIEWER CONFIGURATION:
- Selected Personalities: ${config.selectedPersonalities.map(p => personalityDescriptions[p]).join(' | ')}
- Brain Mode: ${brainModeDescriptions[config.brainMode]}
- Interview Round: ${currentRound}
- Pressure Mode: ${config.enablePressureMode ? 'ENABLED - Include rapid-fire, multi-layer challenges, crisis scenarios' : 'Standard'}
- Coding Challenges: ${config.enableCodingChallenges ? 'ENABLED - Include live coding, debugging, system design' : 'Disabled'}
- Psychometric Analysis: ${config.enablePsychometricAnalysis ? 'ENABLED - Full Big 5, MBTI, IQ, behavioral profiling' : 'Disabled'}

👤 CANDIDATE PROFILE:
- Name: ${config.name}
- Experience: ${config.experienceLevel}
- Skills: ${config.skills.join(', ')}
- Target Role: ${config.desiredRole}
- Domain: ${config.jobDomain}
- Mode: ${config.mode}
${config.resumeText ? `\n📄 RESUME CONTEXT:\nThe candidate has provided their resume. Use this specific information to ask targeted questions about their actual experience, projects, and achievements:\n${config.resumeText.slice(0, 2000)}...\n(Focus on verifying these specific claims)` : ''}

🔬 ADVANCED TESTING MODES TO APPLY:

**Long-Horizon Decision Simulation:**
- Present multi-step scenarios spanning weeks/months
- Change conditions mid-way (budget cuts, team conflicts, tech failures)
- Test adaptation across time

**Adversarial Resistance Test:**
- Include trick questions, misinformation, contradictions
- Evaluate if candidate corrects AI, stands firm on facts, avoids bluffing

**Chain Reaction Scenario Mode:**
- Start scenario → candidate decides → generate consequences → candidate reacts → new consequences
- Simulate crisis, leadership, escalation, strategy

**Ethical & Moral Judgment Simulation:**
- Present ethical conflicts, compliance issues, confidentiality dilemmas
- Rate moral decision-making and professional integrity

**Hybrid Role Simulation:**
- Merge multiple jobs into one scenario to test versatility
- Example: "You're an engineer, but PM is absent and client is angry. How do you manage?"

**Cross-Culture Intelligence Testing:**
- Test communication with diverse teams, cultural awareness, global mindset

**Multi-Perspective Replay:**
- Evaluate answers from CEO, Senior Engineer, HR, and Product Manager perspectives

🎯 CRITICAL INSTRUCTIONS:
1. Start with a warm, professional greeting explaining this is an advanced AI interview with cognitive analysis. Mention we are starting with the ${currentRound} round.
2. Rotate between selected interviewer personalities
3. Ask ONE question at a time
4. Apply the brain mode focus (${config.brainMode})
5. Use Chain of Thought reasoning to analyze candidate responses
6. Track meta-learning: note if candidate improves, adapts, learns from feedback
7. Detect cognitive biases and attention patterns
8. For behavioral questions, use STAR method
9. Adapt difficulty dynamically based on performance
10. PRIORITY: Ask specific questions based on the candidate's resume projects and experience.
11. **TRICKY QUESTION MODE**: Do NOT ask generic "tell me about X" questions. Ask specific, challenging scenarios, edge cases, or "gotcha" questions to test true depth of knowledge.
12. **VISIBILITY**: Make the "Next Question" extremely clear and distinct from the feedback.

📊 FEEDBACK FORMAT (after each answer):
- Interviewer Personality: [which personality is speaking]
- Cognitive Analysis: [thought patterns, reasoning structure, bias detection]
- Meta-Learning Score: [0-10, how well they're adapting]
- Multi-Dimensional Scores: Technical Knowledge, Problem Solving, Communication, Behavioral Skills, Cultural Fit (each 0-10)
- Strengths: [2-3 specific points]
- Improvements: [1-2 areas]
- Model Answer: [brief example]
- Suggestions: [actionable advice]
- Overall Score: [1-10]
- Difficulty Level: [easy/medium/hard/expert]

Begin now with your greeting and first question from one of the selected personalities: ${config.selectedPersonalities[0]}`;
  }

  if (isRoundTransition) {
    return `TRANSITIONING TO NEXT ROUND: ${currentRound.toUpperCase()}

    The candidate has completed the previous round. Now, switch your focus entirely to the ${currentRound} round.

    ROUND FOCUS: ${roundFocus[currentRound]}

    Instructions:
    1. Acknowledge the transition to the candidate (e.g., "Thank you. Now let's move on to the ${currentRound} portion of the interview.").
    2. Ask the first question for this new round.
    3. Ensure the difficulty matches the candidate's previous performance.

    Maintain the same feedback format.`;
  }

  const roleDescription = getInterviewerRoleDescription(currentRole);
  const difficultyGuidance = getDifficultyGuidance(averageScore);

  return `You are now speaking as: ${roleDescription}
Current Personality: ${config.selectedPersonalities[questionCount % config.selectedPersonalities.length]}
Brain Mode Focus: ${brainModeDescriptions[config.brainMode]}

📊 PERFORMANCE CONTEXT:
- Questions answered: ${questionCount}
- Average score: ${averageScore.toFixed(1)}/10
- Current difficulty: ${currentDifficulty}
- ${difficultyGuidance}

🧠 COGNITIVE ANALYSIS REQUIREMENTS:
1. **Thought Pattern Analysis**: Evaluate the reasoning structure (linear, branching, interconnected)
2. **Meta-Learning Check**: Did the candidate improve from previous feedback?
3. **Bias Detection**: Identify any cognitive biases in the response
4. **Attention Consistency**: Note any focus drift or reasoning shifts
5. **Brain Lateralization**: Is the response more left-brain (logical) or right-brain (creative)?

🎯 ADVANCED TESTING MODES (apply 1-2 per question):
${config.enablePressureMode ? '- **Pressure Test**: Rapid-fire follow-ups, time-sensitive scenarios, multi-layer challenges' : ''}
${config.enableCodingChallenges && questionCount % 3 === 0 ? '- **Coding Challenge**: Present a coding/debugging/system design problem' : ''}
- **Long-Horizon Simulation**: Multi-step scenario with changing conditions
- **Adversarial Test**: Include subtle trick or contradiction to test critical thinking
- **Chain Reaction**: Present consequence-based scenario
- **Ethical Dilemma**: Test moral judgment and professional integrity
- **Hybrid Role**: Merge multiple responsibilities in one scenario
- **Cross-Culture**: Test global mindset and diverse team communication

📋 RESPONSE FORMAT:
1. **Comprehensive Feedback on Previous Answer:**
   - Cognitive Analysis: [thought patterns, reasoning quality, bias detection]
   - Meta-Learning Score: [0-10]
   - Attention Consistency: [focused/drifting]
   - Brain Lateralization: [left-brain/right-brain/balanced]
   - Multi-Dimensional Scores: Technical, Problem Solving, Communication, Behavioral, Cultural Fit (each 0-10)
   - Strengths: [2-3 points]
   - Improvements: [1-2 points]
   - Model Answer: [brief example]
   - Suggestions: [actionable advice]
   - Overall Score: [1-10]
   - Difficulty Level: [easy/medium/hard/expert]

2. **Next Question:**
   - **HEADER**: Start this section with "### ❓ NEXT QUESTION (${currentRound.toUpperCase()} ROUND)" to make it visible.
   - **STRICT ROUND FOCUS**: You are currently in the **${currentRound.toUpperCase()}** round. Your question MUST be a ${currentRound} question.
     - Focus: ${roundFocus[currentRound]}
   - **DIFFICULTY**: Ask a TRICKY, challenging question. Avoid generic definitions. Ask for specific scenarios, debugging, or edge cases.
   - Apply one of the advanced testing modes
   - Match the brain mode focus (${config.brainMode})
   - Rotate to next personality if appropriate
   - ${config.enableHints && averageScore < 6 ? 'Provide subtle hints if candidate is struggling' : ''}

Provide your comprehensive feedback and next advanced question now. Ensure the Next Question is distinct and challenging.`;
};

export const generateFinalEvaluationPrompt = (config: InterviewConfig): string => {
  return `Based on the entire interview conversation, provide an ULTRA-COMPREHENSIVE final evaluation with advanced psychometric and cognitive analysis.

${config.enablePsychometricAnalysis ? `
🧠 PSYCHOMETRIC ANALYSIS REQUIRED:
Analyze the candidate's responses to determine:
1. **Big Five (OCEAN) Personality Traits** (score each 0-10):
   - Openness: curiosity, creativity, openness to new experiences
   - Conscientiousness: organization, dependability, self-discipline
   - Extraversion: sociability, assertiveness, energy level
   - Agreeableness: compassion, cooperation, trust
   - Neuroticism: emotional stability, anxiety, stress response (lower is better)

2. **MBTI Type**: Determine the 4-letter type (e.g., INTJ, ENFP, ISTJ)

3. **IQ-Style Logical Assessment**: Estimate cognitive ability score (80-140 range)

4. **Motivation & Reliability Scores** (0-10 each)

5. **Leadership Style**: Describe their leadership approach (e.g., "Collaborative Facilitator", "Decisive Commander", "Servant Leader")

6. **Communication Style**: Describe their communication approach (e.g., "Direct and Concise", "Detailed and Thorough", "Diplomatic and Empathetic")

🎭 BEHAVIORAL ANALYSIS REQUIRED:
Score each dimension 0-10:
- Empathy: ability to understand others' perspectives
- Leadership Potential: capacity to guide and inspire
- Decision Making Speed: ability to make timely decisions
- Communication Effectiveness: clarity and impact of communication
- Motivation Signals: list 3-5 detected motivation drivers (e.g., "Achievement-oriented", "Team-focused", "Innovation-driven")
- Pressure Handling: resilience under stress
- Teamwork Orientation: collaboration and cooperation
- Conflict Resolution: ability to handle disagreements

🧠 COGNITIVE INTELLIGENCE ANALYSIS:
Score each 0-10:
- Thinking Speed: how quickly they process information
- Logical Structure: organization and coherence of reasoning
- Depth of Reasoning: ability to think deeply and critically
- Emotional Tone: classify as "positive", "neutral", "stressed", or "confident"
- Stress Level: 0-10 (based on response patterns)
- Typing Patterns:
  * Average Speed: estimate characters per minute
  * Pause Frequency: estimate number of significant pauses
  * Correction Rate: estimate percentage of corrections made

🎯 JOB-FIT PREDICTION:
- Overall Fit Score: 0-100%
- Industry Alignment: 0-100%
- Role Alignment: 0-100%
- Culture Alignment: 0-100%
- Success Likelihood: 0-100% (probability of clearing real interviews)
- Comparison with Successful Candidates: detailed comparison text
- Recommendations: list 3-5 specific recommendations

🔍 KNOWLEDGE GAPS DETECTION:
Identify 2-4 knowledge gaps with:
- Topic: specific area of weakness
- Severity: "minor", "moderate", or "critical"
- Suggested Resources: 2-3 learning resources per gap
` : ''}

📊 PROVIDE COMPLETE JSON RESPONSE:

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
          "priority": "high",
          "estimatedTime": "2 hours"
        }
      ],
      "milestones": ["milestone 1", "milestone 2"]
    },
    {
      "week": 2,
      "focus": "Focus area for week 2",
      "activities": ["activity 1", "activity 2"],
      "resources": [{"title": "...", "type": "book", "description": "...", "priority": "medium"}],
      "milestones": ["milestone 1"]
    },
    {
      "week": 3,
      "focus": "Focus area for week 3",
      "activities": ["activity 1", "activity 2"],
      "resources": [{"title": "...", "type": "video", "description": "...", "priority": "high"}],
      "milestones": ["milestone 1"]
    },
    {
      "week": 4,
      "focus": "Focus area for week 4",
      "activities": ["activity 1", "activity 2"],
      "resources": [{"title": "...", "type": "practice-platform", "description": "...", "priority": "high"}],
      "milestones": ["milestone 1"]
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "type": "book",
      "description": "Resource description",
      "priority": "high"
    }
  ],
  "advice": "Detailed advice for real interviews",
  "performanceTrend": "improving",
  "readinessLevel": "needs-practice",
  ${config.enablePsychometricAnalysis ? `
  "psychometricProfile": {
    "bigFive": {
      "openness": <0-10>,
      "conscientiousness": <0-10>,
      "extraversion": <0-10>,
      "agreeableness": <0-10>,
      "neuroticism": <0-10>
    },
    "mbtiType": "XXXX",
    "iqScore": <80-140>,
    "motivationScore": <0-10>,
    "reliabilityScore": <0-10>,
    "leadershipStyle": "description",
    "communicationStyle": "description"
  },
  "behavioralAnalysis": {
    "empathy": <0-10>,
    "leadershipPotential": <0-10>,
    "decisionMakingSpeed": <0-10>,
    "communicationEffectiveness": <0-10>,
    "motivationSignals": ["signal1", "signal2", "signal3"],
    "pressureHandling": <0-10>,
    "teamworkOrientation": <0-10>,
    "conflictResolution": <0-10>
  },
  "cognitiveProfile": {
    "thinkingSpeed": <0-10>,
    "logicalStructure": <0-10>,
    "depthOfReasoning": <0-10>,
    "emotionalTone": "positive|neutral|stressed|confident",
    "stressLevel": <0-10>,
    "typingPatterns": {
      "averageSpeed": <number>,
      "pauseFrequency": <number>,
      "correctionRate": <number>
    }
  },
  "jobFitPrediction": {
    "overallFitScore": <0-100>,
    "industryAlignment": <0-100>,
    "roleAlignment": <0-100>,
    "cultureAlignment": <0-100>,
    "successLikelihood": <0-100>,
    "comparisonWithSuccessfulCandidates": "detailed comparison text",
    "recommendations": ["rec1", "rec2", "rec3"]
  },
  "knowledgeGaps": [
    {
      "topic": "topic name",
      "severity": "minor|moderate|critical",
      "detectedAt": <question number>,
      "suggestedResources": [
        {"title": "...", "type": "course", "description": "...", "priority": "high"}
      ]
    }
  ],
  ` : ''}
  "detailedScorecard": [
    {
      "category": "Technical Knowledge",
      "score": <0-10>,
      "feedback": "detailed feedback"
    },
    {
      "category": "Problem Solving",
      "score": <0-10>,
      "feedback": "detailed feedback"
    },
    {
      "category": "Communication",
      "score": <0-10>,
      "feedback": "detailed feedback"
    },
    {
      "category": "Behavioral Skills",
      "score": <0-10>,
      "feedback": "detailed feedback"
    },
    {
      "category": "Cultural Fit",
      "score": <0-10>,
      "feedback": "detailed feedback"
    }
  ]
}

CRITICAL REQUIREMENTS:
- Provide a complete 4-week improvement plan with weekly milestones
- Include diverse learning resources with priority levels and estimated time
- Analyze performance trend based on score progression throughout interview
- Assess readiness level honestly
- ${config.enablePsychometricAnalysis ? 'Include FULL psychometric, behavioral, cognitive, and job-fit analysis' : ''}
- Detect knowledge gaps with severity levels and targeted resources
- Provide detailed scorecard with category-specific feedback
- Give specific, actionable advice for real interviews
- Be encouraging but honest in the assessment

Provide ONLY the JSON object, no additional text before or after.`;
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

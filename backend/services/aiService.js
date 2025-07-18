const axios = require('axios');

class AIService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async generateContent(prompt, context = {}) {
    try {
      if (!this.geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }

      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const content = response.data.candidates[0].content;
        return content.parts[0].text;
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI content');
    }
  }

  async simplifyText(text, studentClass = 10, subject = 'General') {
    const prompt = `
You are an AI tutor for Class ${studentClass} students. Simplify the following text for easy understanding:

Text: "${text}"
Subject: ${subject}

Please provide:
1. A simplified explanation in simple language
2. A real-life example if applicable
3. Key bullet points (3-5 points)
4. Important definitions in simple terms

Format your response as JSON with these keys: simplified, example, keyPoints, definitions
`;

    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      // Fallback response if AI fails
      return {
        simplified: text,
        example: "Example not available",
        keyPoints: ["Key concepts from the text"],
        definitions: {}
      };
    }
  }

  async solveDoubt(doubt, studentClass, subject) {
    const prompt = `
You are an expert tutor for Class ${studentClass} ${subject}. A student has asked:

Question: "${doubt.title}"
Description: "${doubt.description}"
Chapter: "${doubt.chapter}"
Difficulty: "${doubt.difficulty}"

Please provide a comprehensive answer with:
1. Clear step-by-step explanation
2. Formula or concept involved (if applicable)
3. Similar practice questions (2-3)
4. Tips to remember this concept
5. Real-world applications

Be encouraging and use simple language appropriate for Class ${studentClass} students.
`;

    try {
      const response = await this.generateContent(prompt);
      return {
        content: response,
        confidence: 0.85, // Simulated confidence score
        suggestedTopics: this.extractTopics(response),
        requiresHumanReview: false
      };
    } catch (error) {
      throw new Error('Failed to solve doubt using AI');
    }
  }

  async generateTestQuestions(subject, chapter, difficulty = 'Medium', count = 10) {
    const prompt = `
Generate ${count} multiple choice questions for:
Subject: ${subject}
Chapter: ${chapter}
Difficulty: ${difficulty}

For each question, provide:
1. Question text
2. 4 options (A, B, C, D)
3. Correct answer
4. Explanation

Format as JSON array with objects containing: question, options, correctAnswer, explanation
`;

    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      throw new Error('Failed to generate test questions');
    }
  }

  async analyzePYQ(pdfText, subject, studentClass) {
    const prompt = `
Analyze the following Previous Year Questions (PYQ) text and provide:

PYQ Text: "${pdfText}"
Subject: ${subject}
Class: ${studentClass}

Please analyze and provide:
1. Topic-wise frequency analysis
2. Difficulty distribution
3. Marks distribution
4. Repeated questions or patterns
5. Important topics to focus on

Format as JSON with keys: topicFrequency, difficultyAnalysis, marksDistribution, repeatedPatterns, focusAreas
`;

    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      throw new Error('Failed to analyze PYQ');
    }
  }

  async generateStudyPlan(user, subject, timeFrame = '1 month') {
    const prompt = `
Create a personalized study plan for:
Student Class: ${user.class}
Subject: ${subject}
Time Frame: ${timeFrame}
Current Level: ${user.progress.currentLevel}
Board: ${user.board}

Consider:
- Student's current progress
- Upcoming exams
- Weak areas that need focus
- Time available for study

Provide a structured study plan with:
1. Weekly breakdown
2. Daily time allocation
3. Topic priorities
4. Practice schedule
5. Revision strategy

Format as JSON with keys: weeklyPlan, dailySchedule, priorities, practiceSchedule, revisionStrategy
`;

    try {
      const response = await this.generateContent(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      throw new Error('Failed to generate study plan');
    }
  }

  async explainConcept(concept, studentClass, subject) {
    const prompt = `
Explain the concept "${concept}" for Class ${studentClass} ${subject} student:

Provide:
1. Simple definition
2. Step-by-step explanation
3. Real-world example
4. Common mistakes to avoid
5. Memory tricks or mnemonics
6. Practice questions

Use age-appropriate language and engaging examples.
`;

    try {
      const response = await this.generateContent(prompt);
      return response;
    } catch (error) {
      throw new Error('Failed to explain concept');
    }
  }

  async generateSummary(content, studentClass) {
    const prompt = `
Create a concise summary of the following content for Class ${studentClass} student:

Content: "${content}"

Provide:
1. Main points in bullet format
2. Key formulas or concepts
3. Important definitions
4. Quick revision notes

Keep it concise and exam-focused.
`;

    try {
      const response = await this.generateContent(prompt);
      return response;
    } catch (error) {
      throw new Error('Failed to generate summary');
    }
  }

  // Helper methods
  parseJSONResponse(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // If no JSON block, try to parse the entire response
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return { error: 'Failed to parse AI response' };
    }
  }

  extractTopics(text) {
    // Simple topic extraction - in production, use more sophisticated NLP
    const topics = [];
    const commonTopics = [
      'algebra', 'geometry', 'calculus', 'physics', 'chemistry', 'biology',
      'mechanics', 'thermodynamics', 'optics', 'electricity', 'magnetism',
      'organic chemistry', 'inorganic chemistry', 'cell biology', 'genetics'
    ];

    commonTopics.forEach(topic => {
      if (text.toLowerCase().includes(topic)) {
        topics.push(topic);
      }
    });

    return topics.slice(0, 5); // Return top 5 topics
  }

  // Fallback method for when AI service is unavailable
  getFallbackResponse(type, context = {}) {
    const fallbacks = {
      doubt: "I'm currently unable to process your doubt. Please try again later or contact a human tutor.",
      simplify: "Text simplification is temporarily unavailable. Please refer to your textbook for clearer explanations.",
      test: "Question generation is temporarily unavailable. Please use practice questions from your textbook.",
      summary: "Summary generation is temporarily unavailable. Please create notes manually from your study material."
    };

    return fallbacks[type] || "AI service is temporarily unavailable. Please try again later.";
  }
}

module.exports = new AIService();

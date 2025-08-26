import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  let answers;
  try {
    answers = await request.json();
    
    // Debug: Log the received data
    console.log('Received answers:', answers);
    
    // Validate required fields
    const requiredFields = ['subject', 'grade', 'duration', 'objective', 'assessment'];
    for (const field of requiredFields) {
      if (!answers[field]) {
        console.log(`Missing field: ${field}, value:`, answers[field]);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Build the prompt for Claude
    const prompt = buildLessonPlanPrompt(answers);
    
    // Generate content using Claude
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    
    const text = message.content[0].text;
    
    // Parse the response into structured data
    const lessonPlan = parseLessonPlan(text, answers);
    
    return NextResponse.json({ 
      success: true, 
      lessonPlan,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating lesson plan:', error);
    
    // Return a fallback lesson plan structure
    const fallbackPlan = createFallbackLessonPlan(answers || {});
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate lesson plan with AI. Providing template instead.',
      lessonPlan: fallbackPlan,
      generatedAt: new Date().toISOString()
    });
  }
}

function buildLessonPlanPrompt(answers) {
  const {
    subject,
    grade,
    duration,
    objective,
    assessment,
    students = 'not specified',
    prior_knowledge = 'mixed levels',
    learning_styles = 'mixed',
    materials = 'standard classroom materials',
    accommodations = 'none specified'
  } = answers;

  return `You are an expert education consultant and lesson plan creator with 20+ years of experience in curriculum design and classroom instruction. Create a comprehensive, engaging lesson plan with the following specifications:

LESSON DETAILS:
- Subject: ${subject}
- Grade Level: Grade ${grade}
- Duration: ${duration} minutes
- Class Size: ${students} students
- Learning Objective: ${objective}
- Assessment Method: ${assessment}
- Prior Knowledge Level: ${prior_knowledge}
- Learning Styles: ${learning_styles}
- Available Materials: ${materials}
- Special Accommodations: ${accommodations}

Please create a detailed lesson plan that includes:

1. LESSON OVERVIEW
   - Clear title and brief description
   - Learning objectives (3-5 specific, measurable outcomes)
   - Success criteria for students

2. MATERIALS NEEDED
   - Complete list of required materials and resources
   - Technology requirements (if any)
   - Handouts or worksheets needed

3. LESSON STRUCTURE (with specific timing)
   - Opening/Hook (5-10 minutes): Engaging starter activity
   - Main Activities (majority of time): Step-by-step instructional activities
   - Closing/Assessment (5-10 minutes): Summary and evaluation

4. DETAILED ACTIVITIES
   - Clear instructions for each activity
   - Teacher actions and student expectations
   - Transition strategies between activities

5. ASSESSMENT TOOLS
   - Specific assessment methods aligned with chosen type: ${assessment}
   - Rubric or scoring criteria
   - Questions for checking understanding

6. DIFFERENTIATION STRATEGIES
   - Support for struggling learners
   - Extensions for advanced students
   - Accommodations for different learning styles

7. HOMEWORK/EXTENSION
   - Optional take-home activities
   - Real-world connections
   - Preparation for next lesson

Format the response in clear sections with headers. Make it practical, engaging, and age-appropriate for Grade ${grade} students. Ensure all activities fit within the ${duration}-minute timeframe.`;
}

function parseLessonPlan(generatedText, answers) {
  // Basic parsing - in a real implementation, you might want more sophisticated parsing
  return {
    title: `${answers.subject} Lesson - Grade ${answers.grade}`,
    subject: answers.subject,
    grade: answers.grade,
    duration: answers.duration,
    objective: answers.objective,
    assessment: answers.assessment,
    content: generatedText,
    metadata: {
      createdAt: new Date().toISOString(),
      inputs: answers
    }
  };
}

function createFallbackLessonPlan(answers) {
  const { subject, grade, duration, objective, assessment } = answers;
  
  return {
    title: `${subject} Lesson - Grade ${grade}`,
    subject,
    grade,
    duration,
    objective,
    assessment,
    content: `# ${subject} Lesson Plan - Grade ${grade}

## Lesson Overview
**Duration:** ${duration} minutes  
**Objective:** ${objective}  
**Assessment:** ${assessment}

## Materials Needed
- Whiteboard/markers
- Student notebooks
- Handouts (to be prepared)
- Basic classroom supplies

## Lesson Structure

### Opening (10 minutes)
- Welcome and review previous lesson
- Introduce today's objective
- Engage students with a question or activity

### Main Activity (${duration - 20} minutes)
- Direct instruction on ${objective}
- Guided practice with examples
- Student work time
- Check for understanding

### Closing (10 minutes)
- Review key concepts
- ${assessment} assessment
- Preview next lesson

## Assessment
Students will be evaluated using ${assessment} to measure understanding of ${objective}.

## Differentiation
- Provide additional support for struggling learners
- Offer extension activities for advanced students
- Use multiple modalities to accommodate different learning styles

*Note: This is a template lesson plan. For a more detailed, AI-generated plan, please ensure your Claude API is properly configured.*`,
    metadata: {
      createdAt: new Date().toISOString(),
      inputs: answers,
      fallback: true
    }
  };
}

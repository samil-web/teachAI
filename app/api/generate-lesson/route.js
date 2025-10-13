import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { 
  classifySubject, 
  getTechnicalInteractives, 
  getHumanitarianNarratives,
  getSubjectSpecificAssessments,
  SUBJECT_TYPES 
} from '@/utils/subject-classifier';

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

  // Classify subject type and get appropriate learning strategies
  const subjectType = classifySubject(subject);
  const isTechnical = subjectType === SUBJECT_TYPES.TECHNICAL;
  
  // Get subject-specific content
  const interactives = isTechnical ? getTechnicalInteractives(subject, objective) : [];
  const narratives = !isTechnical ? getHumanitarianNarratives(subject, objective) : {};
  const assessmentMethods = getSubjectSpecificAssessments(subjectType);

  return `You are an expert education consultant and lesson plan creator with 20+ years of experience in curriculum design and classroom instruction. Create a comprehensive, detailed lesson plan that provides practical guidance for teachers.

IMPORTANT: This is a ${subjectType.toUpperCase()} subject, so use the appropriate pedagogical approach:

${isTechnical ? `
**TECHNICAL SUBJECT APPROACH:**
- Focus on VISUAL and INTERACTIVE learning
- Provide hands-on manipulatives and simulations
- Include specific interactive components for student exploration
- Emphasize discovery through experimentation
- Use graphs, diagrams, and visual representations
- Create "playground" environments for students to observe and experiment

**Available Interactive Components:**
${interactives.map(comp => `- ${comp.title}: ${comp.description}`).join('\n')}
` : `
**HUMANITARIAN SUBJECT APPROACH:**
- Focus on STORY-BASED and NARRATIVE learning
- Create engaging stories and scenarios
- Include role-playing and character development
- Emphasize personal connections and real-world relevance
- Use collaborative storytelling and discussion
- Create immersive experiences that students can relate to

**Narrative Elements to Include:**
${narratives.storyElements?.map(story => `- ${story.title}: ${story.description}`).join('\n') || ''}

**Engagement Strategies:**
${narratives.engagementStrategies?.map(strategy => `- ${strategy.title}: ${strategy.description}`).join('\n') || ''}
`}

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

Create a structured lesson plan with the following sections. For each section, provide detailed, actionable content:

## 1. LESSON OVERVIEW
- Engaging lesson title
- Brief description (2-3 sentences)
- 3-5 specific, measurable learning objectives
- Clear success criteria students can understand

## 2. TEACHER PREPARATION
- Pre-lesson setup checklist
- Materials to prepare in advance
- Room arrangement suggestions
- Technology setup requirements

## 3. LESSON INTRODUCTION (${Math.ceil(duration * 0.15)} minutes)
- Specific opening hook activity
- Exact words/questions teacher can use to engage students
- Connection to prior learning
- Clear objective introduction

${isTechnical ? `
## 4. INTERACTIVE EXPLORATION (${Math.ceil(duration * 0.6)} minutes)
Create hands-on discovery activities with:
- **Visual Manipulatives**: Specific tools students can interact with
- **Interactive Demonstrations**: Step-by-step explorations with adjustable parameters
- **Student Experimentation**: Guided discovery activities where students change variables and observe results
- **Real-time Feedback**: How students see immediate results from their actions
- **Collaborative Investigation**: Pair/group activities for exploring concepts together

For each interactive component, specify:
- What students manipulate (sliders, graphs, objects)
- What they observe changing
- Key discoveries they should make
- Questions to guide their exploration

## 5. GUIDED DISCOVERY (${Math.ceil(duration * 0.15)} minutes)
- **Structured Exploration**: Specific interactive exercises with clear objectives
- **Pattern Recognition**: Help students identify patterns from their explorations
- **Concept Consolidation**: Connect their discoveries to formal concepts
- **Peer Sharing**: Students explain what they discovered to classmates

## 6. INTERACTIVE ASSESSMENT (${Math.ceil(duration * 0.1)} minutes)
- **Hands-on Demonstration**: Students show understanding through manipulation
- **Quick Experiments**: Mini-challenges using the interactive tools
- **Visual Exit Tickets**: Students create/modify graphs, diagrams, or models
- **Prediction Activities**: Students predict outcomes and test their predictions
` : `
## 4. STORY-BASED EXPLORATION (${Math.ceil(duration * 0.6)} minutes)
Create immersive narrative experiences with:
- **Opening Narrative**: Engaging story that introduces the lesson concept
- **Character Development**: Students connect with historical figures, literary characters, or create personas
- **Scenario Building**: Interactive storytelling where students make choices that affect outcomes
- **Role-Playing Activities**: Students embody different perspectives and viewpoints
- **Collaborative Storytelling**: Group activities where students build stories together

For each narrative element, specify:
- The story setup and characters
- Student roles and perspectives
- Key decisions or dilemmas to explore
- How the story connects to learning objectives

## 5. NARRATIVE PRACTICE (${Math.ceil(duration * 0.15)} minutes)
- **Story Continuation**: Students extend or modify the narrative
- **Perspective Switching**: View events from different character viewpoints
- **Creative Expression**: Students create their own stories incorporating lesson concepts
- **Discussion Circles**: Share and discuss different narrative interpretations

## 6. STORY-BASED ASSESSMENT (${Math.ceil(duration * 0.1)} minutes)
- **Narrative Reflection**: Students explain concepts through storytelling
- **Character Analysis**: Assess understanding through character perspectives
- **Creative Presentations**: Students present learning through stories, skits, or role-play
- **Story Connections**: Students connect lesson stories to their own experiences
`}

## 7. DIFFERENTIATION STRATEGIES
For each category, provide 3-4 specific examples:
- **Support for Struggling Learners**: Concrete accommodations
- **Extensions for Advanced Students**: Specific challenge activities
- **Learning Style Adaptations**: Visual, auditory, kinesthetic options

## 8. RESOURCES & MATERIALS
- Complete materials list with quantities
- Recommended websites/apps (provide actual URLs when possible)
- Printable resources needed
- Alternative materials if primary ones unavailable

## 9. TEACHER SCRIPTS & QUESTIONS
Provide exact phrases for:
- Lesson introduction
- Transition between activities
- Checking for understanding (5-7 specific questions)
- Encouraging participation
- Addressing misconceptions

## 10. HOMEWORK & EXTENSIONS
- 2-3 optional homework activities
- Real-world application examples
- Family engagement suggestions
- Preparation for next lesson

Make everything practical and immediately usable. Include specific examples, exact timing, and actionable instructions that a substitute teacher could follow successfully.`;
}

function parseLessonPlan(generatedText, answers) {
  // Parse the generated text into structured sections
  const sections = parseIntoSections(generatedText);
  const subjectType = classifySubject(answers.subject);
  
  return {
    title: `${answers.subject} Lesson - Grade ${answers.grade}`,
    subject: answers.subject,
    subjectType: subjectType,
    grade: answers.grade,
    duration: answers.duration,
    objective: answers.objective,
    assessment: answers.assessment,
    sections: sections,
    rawContent: generatedText,
    interactives: subjectType === SUBJECT_TYPES.TECHNICAL ? getTechnicalInteractives(answers.subject, answers.objective) : [],
    narratives: subjectType === SUBJECT_TYPES.HUMANITARIAN ? getHumanitarianNarratives(answers.subject, answers.objective) : {},
    metadata: {
      createdAt: new Date().toISOString(),
      inputs: answers,
      totalSections: sections.length,
      subjectType: subjectType
    }
  };
}

function parseIntoSections(text) {
  const sections = [];
  const sectionHeaders = [
    'LESSON OVERVIEW',
    'TEACHER PREPARATION', 
    'LESSON INTRODUCTION',
    'INTERACTIVE EXPLORATION',
    'STORY-BASED EXPLORATION',
    'MAIN INSTRUCTION',
    'GUIDED DISCOVERY',
    'GUIDED PRACTICE',
    'NARRATIVE PRACTICE',
    'INTERACTIVE ASSESSMENT',
    'STORY-BASED ASSESSMENT',
    'ASSESSMENT & CLOSURE',
    'DIFFERENTIATION STRATEGIES',
    'RESOURCES & MATERIALS',
    'TEACHER SCRIPTS & QUESTIONS',
    'HOMEWORK & EXTENSIONS'
  ];
  
  // Split text by section headers
  let currentSection = null;
  let currentContent = '';
  
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line is a section header
    const matchedHeader = sectionHeaders.find(header => 
      trimmedLine.includes(header) && (trimmedLine.startsWith('#') || trimmedLine.startsWith('##'))
    );
    
    if (matchedHeader) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          id: currentSection.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          title: currentSection,
          content: currentContent.trim(),
          order: sections.length + 1
        });
      }
      
      // Start new section
      currentSection = matchedHeader;
      currentContent = '';
    } else {
      // Add content to current section
      currentContent += line + '\n';
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push({
      id: currentSection.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      title: currentSection,
      content: currentContent.trim(),
      order: sections.length + 1
    });
  }
  
  // If no sections were found, create a single section with all content
  if (sections.length === 0) {
    sections.push({
      id: 'full_lesson',
      title: 'Complete Lesson Plan',
      content: text,
      order: 1
    });
  }
  
  return sections;
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

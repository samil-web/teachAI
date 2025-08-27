import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    console.log('Received request to generate template lesson');
    let requestData;
    requestData = await request.json();
    const { template, formData } = requestData;
    console.log('Request payload:', { template, formData });
    
    // Debug: Log the received data
    console.log('Received template data:', { templateId: template.id, formData });
    
    // Validate required data
    if (!template || !formData) {
      console.error('Missing template or formData in request');
      return NextResponse.json(
        { error: 'Missing template or form data' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY is not set in environment');
      return NextResponse.json({ error: 'Server configuration error: API key is not set' }, { status: 500 });
    }

    // Build detailed prompt for Claude using the template and form data
    const prompt = buildPrompt(template, formData);
    console.log('Sending request to Claude API');
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
    console.log('Received response from Claude API');
    const generatedContent = message.content[0].text;
    console.log('AI content length:', generatedContent.length);
    
    // Process the template with form data and AI content
    const processedLessonPlan = processTemplate(template, formData, generatedContent);
    console.log(processedLessonPlan);
    return NextResponse.json({ 
      success: true, 
      lessonPlan: processedLessonPlan,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating template lesson plan:', error);
    
    // Return a fallback lesson plan structure
    const fallbackPlan = createTemplateFallback(requestData?.template, requestData?.formData || {});
    console.log('Returning fallback lesson:', fallbackPlan);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate lesson plan with AI. Providing template instead.',
      lessonPlan: fallbackPlan,
      generatedAt: new Date().toISOString()
    });
  }
}

function buildPrompt(template, formData) {
  // Create a description of the template structure and placeholders
  let templateDescription = `The lesson template is titled '${template.name}' in the category '${template.category}'. `;
  templateDescription += `It is designed for grade ${formData.grade} with a duration of ${formData.duration} minutes. `;
  templateDescription += `The template has the following required fields: ${Object.entries(formData).map(([key, value]) => `${key} (${value || 'not provided'})`).join(', ')}. `;
  if (Object.keys(template.optionalFields || {}).length > 0) {
    templateDescription += `The optional fields are: ${Object.entries(template.optionalFields || {}).map(([key, info]) => `${key} (${info.label}: ${formData[key] || 'not provided'})`).join(', ')}. `;
  }
  templateDescription += `The template content structure is as follows:\n${template.template}\n`;

  // Construct detailed instructions for Claude
  const instructions = `You are an expert educational content creator with 20 years of experience in curriculum design. Your task is to create a comprehensive, engaging, and grade-appropriate lesson plan based on the provided template and user inputs. Follow these steps:

  1. **Understand the Template**: Review the template structure, placeholders (e.g., {{variable}}), and AI-generated sections (e.g., [AI_GENERATED_INTRO]). Placeholders should be replaced with relevant content based on user inputs. AI-generated sections should be fully developed with detailed, creative, and pedagogically sound content.
  2. **Incorporate User Inputs**: Seamlessly integrate all provided form data (required and optional fields) into the lesson content to personalize it for the specific class and subject.
  3. **Create Dual Plans**: Generate TWO aligned lesson plans:
     - **Student Plan**: A simplified, engaging guide for students with 3-5 clear, actionable steps per section. Use a friendly, encouraging tone tailored to the grade level. Include interactive elements like discussions, quick challenges, or group tasks with visual cues (e.g., **Discuss**, **Create**). Each step should have a time estimate if relevant.
     - **Teacher Plan**: A detailed roadmap for the teacher with a summary of objectives, materials, and duration at the start. Match steps to the student plan but add facilitation guidance, differentiation tips, classroom management advice, and contingency plans. Ensure step numbers align with the student plan for synchronization.
  4. **Ensure Alignment**: Both plans must correspond by step numbers (e.g., Student Step 1 aligns with Teacher Step 1) to keep the teacher in sync with student activities.
  5. **Maintain Structure**: Follow the template’s structure for headers and sections. Clearly label the two plans as 'Student Plan' and 'Teacher Plan' in the output.
  6. **Grade-Appropriate Content**: Ensure language, complexity, and activities are suitable for grade ${formData.grade}.
  7. **Engagement and Interaction**: Prioritize active learning with specific prompts for student-teacher and peer interaction in both plans, tailored to the audience.

  Output the complete content with both plans fully detailed. Do not leave any placeholder unfilled or section incomplete. Separate the plans with clear headings like '=== Student Plan ===' and '=== Teacher Plan ===' for easy parsing.`;

  const prompt = `${instructions}

Template Details:
${templateDescription}

Now, create the dual lesson plans based on this template and data.`;
  console.log('Generated prompt for Claude:', prompt);
  return prompt;
}

function processTemplate(template, formData, aiContent) {
  // Since Claude is instructed to fill all placeholders and generate complete content,
  // we can use the AI content directly as the lesson plan content.
  // However, we'll split it into student and teacher plans if formatted correctly.
  let studentContent = '';
  let teacherContent = '';

  const studentMarker = '=== Student Plan ===';
  const teacherMarker = '=== Teacher Plan ===';
  const studentIndex = aiContent.indexOf(studentMarker);
  const teacherIndex = aiContent.indexOf(teacherMarker);

  if (studentIndex !== -1 && teacherIndex !== -1) {
    if (studentIndex < teacherIndex) {
      studentContent = aiContent.slice(studentIndex + studentMarker.length, teacherIndex).trim();
      teacherContent = aiContent.slice(teacherIndex + teacherMarker.length).trim();
    } else {
      teacherContent = aiContent.slice(teacherIndex + teacherMarker.length, studentIndex).trim();
      studentContent = aiContent.slice(studentIndex + studentMarker.length).trim();
    }
  } else {
    // Fallback: If markers aren't found, use the entire content as teacher plan and note student plan as placeholder
    teacherContent = aiContent;
    studentContent = '**Student Plan Placeholder**: Due to formatting issues, the student-specific plan could not be extracted. Please refer to the teacher plan for full details or regenerate the lesson.';
  }

  return {
    title: template.title ? `${template.title} - Grade ${formData.grade || 'N/A'}` : `Lesson Plan - Grade ${formData.grade || 'N/A'}`,
    category: template.category || 'Uncategorized',
    grade: formData.grade || 'N/A',
    duration: formData.duration || 'N/A',
    studentContent: studentContent || 'No student content generated.',
    teacherContent: teacherContent || 'No teacher content generated.',
    metadata: {
      createdAt: new Date().toISOString(),
      templateId: template.id || 'unknown',
      formData: formData || {},
      aiGenerated: true
    }
  };
}

function getSubjectSpecificGuidelines(category, fields) {
  switch (category) {
    case 'Science':
      return `- Include hands-on activities and experiments
- Emphasize scientific method and inquiry-based learning
- Include safety considerations and procedures
- Connect to real-world applications
- Encourage hypothesis formation and testing`;
      
    case 'Mathematics':
      return `- Include worked examples and step-by-step solutions
- Provide multiple practice problems at different difficulty levels
- Connect to real-world applications and problem-solving
- Address common misconceptions and errors
- Include visual representations and manipulatives where appropriate`;
      
    case 'English/Language Arts':
      return `- Include discussion questions that promote critical thinking
- Incorporate multiple text analysis strategies
- Encourage student voice and choice in responses
- Connect to students' lives and experiences
- Include vocabulary development activities`;
      
    case 'Cross-Curricular':
      return `- Integrate multiple subject areas naturally
- Include collaborative learning opportunities
- Emphasize project-based and authentic assessment
- Connect to real-world issues and problems
- Encourage creativity and innovation`;
      
    default:
      return `- Create engaging, interactive activities
- Include formative and summative assessments
- Provide differentiation for diverse learners
- Connect to students' prior knowledge and experiences`;
  }
}

function createTemplateFallback(template, formData) {
  if (!template) {
    return {
      title: 'Lesson Plan Template',
      content: 'Error: Template data not available. Please try again.',
      metadata: { fallback: true, error: 'Missing template data' }
    };
  }
  
  const { grade = '8', duration = '45' } = formData;
  
  return {
    title: `${template.name} - Grade ${grade}`,
    template: template.name,
    category: template.category,
    grade,
    duration,
    content: `# ${template.name} - Grade ${grade}

## Lesson Overview
**Duration:** ${duration} minutes
**Template:** ${template.name}
**Category:** ${template.category}

## Template Structure
This lesson follows the ${template.name} template structure. 

${template.template}

*Note: This is a template fallback. For a fully customized lesson plan, please ensure your Claude API is properly configured and try again.*`,
    metadata: {
      createdAt: new Date().toISOString(),
      templateId: template.id,
      formData,
      fallback: true
    }
  };
}

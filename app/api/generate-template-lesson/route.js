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

  // Construct detailed instructions for Claude - Enhanced for English Language Testing with Custom Assessment
  const instructions = `You are an expert English language educator with 20 years of experience in curriculum design and assessment creation. Your task is to create a comprehensive, engaging lesson plan with customized testing components based on the provided template and user inputs.

  **SPECIAL FOCUS FOR ENGLISH LANGUAGE LESSONS:**
  - **Concept Explanations**: Provide clear, concise explanations (1-2 sentences max) for each language concept
  - **Example-Based Learning**: Use concrete examples to illustrate abstract concepts
  - **Customized Test Generation**: Create assessments matching teacher's specific requirements
  - **Progressive Difficulty**: Start with simple examples, build to complex applications

  **ASSESSMENT CUSTOMIZATION REQUIREMENTS:**
  ${formData.question_count ? `- Generate exactly ${formData.question_count} questions` : '- Generate 8-10 questions (default)'}
  ${formData.difficulty_level ? `- Question difficulty: ${formData.difficulty_level}` : '- Use mixed difficulty levels'}
  ${formData.question_types ? `- Question format: ${formData.question_types}` : '- Use mixed question formats'}
  ${formData.example_question ? `- Follow this example style: "${formData.example_question}"` : '- Use standard academic question format'}
  ${formData.question_complexity_notes ? `- Complexity requirements: ${formData.question_complexity_notes}` : '- Standard complexity for grade level'}
  ${formData.custom_question_distribution ? `- Question distribution: ${formData.custom_question_distribution}` : '- Balanced distribution'}

  Follow these steps:

  1. **Understand the Template**: Review the template structure, placeholders (e.g., {{variable}}), and AI-generated sections. Replace placeholders with relevant English language content based on user inputs.

  2. **Create Concept Explanations**: For each language concept, provide:
     - **Short Definition** (1 sentence maximum)
     - **Clear Example** (relevant to student age/interests: ${formData.student_interests || 'general topics'})
     - **Quick Check** (immediate comprehension question)

  3. **Generate Dual Plans with Custom Testing Integration**:
     - **Student Plan**: 
       * Concept explanations in simple language
       * 3-5 examples per concept with increasing difficulty
       * Practice exercises that mirror the custom test questions
       * Self-assessment checkpoints
     - **Teacher Plan**: 
       * Detailed concept background and common misconceptions
       * Example selection rationale and differentiation notes
       * Custom assessment rubrics and detailed answer keys
       * Extension activities for advanced learners

  4. **Custom Test Creation from Examples**: 
     - Generate exactly ${formData.question_count || '8-10'} questions
     - Follow the specified format distribution: ${formData.question_types || 'mixed format'}
     - Match the complexity level: ${formData.difficulty_level || 'grade-appropriate'}
     - Use the provided example question as a style guide: ${formData.example_question ? `"${formData.example_question}"` : 'standard format'}
     - Transform instructional examples into test questions following these specifications
     - Provide detailed answer keys with explanations
     - Include rubric for grading (especially for short answer/essay questions)

  5. **English Language Specifics**:
     - Grammar: Use sentence patterns students recognize
     - Vocabulary: Context clues and word families  
     - Reading: Comprehension strategies with text evidence
     - Writing: Model-practice-apply sequence
     - Speaking/Listening: Interactive dialogue examples

  6. **Assessment Alignment**: Ensure every concept taught has corresponding test questions using the same examples or similar patterns, following the teacher's customization requirements.

  **QUESTION FORMAT GUIDELINES:**
  ${getQuestionFormatGuidelines(formData.question_types, formData.difficulty_level)}

  Output format: Separate with '=== Student Plan ===' and '=== Teacher Plan ===' headings. Include the customized assessment section with exactly ${formData.question_count || '8-10'} questions in the specified format.`;

  const prompt = `${instructions}

Template Details:
${templateDescription}

Now, create the dual lesson plans based on this template and data.`;
  console.log('Generated prompt for Claude:', prompt);
  return prompt;
}

function getQuestionFormatGuidelines(questionTypes, difficultyLevel) {
  let guidelines = '';
  
  switch (questionTypes) {
    case 'multiple_choice_only':
      guidelines = `
- All questions must be multiple choice with 4 options (A, B, C, D)
- Include one clearly correct answer and three plausible distractors
- Avoid "all of the above" or "none of the above" options
- Make distractors based on common student misconceptions`;
      break;
      
    case 'short_answer_only':
      guidelines = `
- All questions require written responses (1-3 sentences)
- Questions should ask for explanations, examples, or analysis
- Provide clear rubric criteria for grading
- Include sample acceptable answers`;
      break;
      
    case 'mixed_balanced':
      guidelines = `
- 50% multiple choice questions (4 options each)
- 50% short answer questions (1-3 sentences)
- Alternate between formats throughout the assessment
- Ensure both formats test the same concepts`;
      break;
      
    case 'mostly_mc':
      guidelines = `
- 70% multiple choice questions (4 options each)
- 30% short answer questions (1-2 sentences)
- Use MC for knowledge/comprehension, SA for analysis/application`;
      break;
      
    case 'mostly_sa':
      guidelines = `
- 70% short answer questions (1-3 sentences)
- 30% multiple choice questions (4 options each)
- Focus SA questions on deeper thinking and explanation`;
      break;
      
    case 'custom':
      guidelines = `
- Follow the custom distribution specified by the teacher
- Maintain quality standards for each question type
- Ensure balanced coverage of the concept`;
      break;
      
    default:
      guidelines = `
- Mix of multiple choice and short answer questions
- Ensure variety in question formats and cognitive levels`;
  }
  
  // Add difficulty-specific guidelines
  switch (difficultyLevel) {
    case 'basic':
      guidelines += `
- Focus on recognition, recall, and simple identification
- Use straightforward language and familiar examples
- Test basic understanding of the concept`;
      break;
      
    case 'intermediate':
      guidelines += `
- Include application and analysis questions
- Require students to explain reasoning or provide examples
- Test understanding and ability to use the concept`;
      break;
      
    case 'advanced':
      guidelines += `
- Focus on synthesis, evaluation, and critical thinking
- Require complex reasoning and connections between ideas
- Test deep understanding and creative application`;
      break;
      
    case 'mixed':
      guidelines += `
- Include questions at all cognitive levels (basic, intermediate, advanced)
- Progress from simple recall to complex application
- Ensure appropriate distribution across difficulty levels`;
      break;
  }
  
  return guidelines;
}

function processTemplate(template, formData, aiContent) {
  // Enhanced processing for English language lessons with embedded assessments
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
    // For English concept lessons, try to extract key sections even without markers
    if (template.id === 'english_concept_test') {
      // Extract concept explanations and test questions
      const conceptMatch = aiContent.match(/### What is.*?\n(.*?)(?=###|##|\n\n)/s);
      const examplesMatch = aiContent.match(/### Key Examples.*?\n(.*?)(?=###|##|\n\n)/s);
      const testMatch = aiContent.match(/### Test Questions.*?\n(.*?)(?=###|##|$)/s);
      
      studentContent = `# ${formData.concept_name || 'English Concept'} - Student Guide

## Concept Definition
${conceptMatch ? conceptMatch[1].trim() : 'Concept explanation not found.'}

## Examples to Study
${examplesMatch ? examplesMatch[1].trim() : 'Examples not found.'}

## Practice Questions
${testMatch ? testMatch[1].trim() : 'Test questions not found.'}`;

      teacherContent = aiContent; // Full content for teacher
    } else {
      // Fallback for other templates
      teacherContent = aiContent;
      studentContent = '**Student Plan**: Please refer to the teacher plan for lesson details.';
    }
  }

  // Extract assessment components for English lessons with custom specifications
  let assessmentData = {};
  if (template.id === 'english_concept_test') {
    const testQuestions = extractTestQuestions(aiContent);
    const conceptExplanation = extractConceptExplanation(aiContent);
    
    assessmentData = {
      conceptExplanation,
      testQuestions,
      hasEmbeddedAssessment: true,
      customSpecifications: {
        questionCount: formData.question_count || '8-10',
        difficultyLevel: formData.difficulty_level || 'mixed',
        questionTypes: formData.question_types || 'mixed_balanced',
        exampleQuestion: formData.example_question || null,
        complexityNotes: formData.question_complexity_notes || null,
        customDistribution: formData.custom_question_distribution || null
      }
    };
  }

  return {
    title: template.name ? `${template.name} - ${formData.concept_name || formData.grammar_concept || 'Lesson'} - Grade ${formData.grade || 'N/A'}` : `Lesson Plan - Grade ${formData.grade || 'N/A'}`,
    category: template.category || 'Uncategorized',
    grade: formData.grade || 'N/A',
    duration: formData.duration || 'N/A',
    studentContent: studentContent || 'No student content generated.',
    teacherContent: teacherContent || 'No teacher content generated.',
    assessment: assessmentData,
    metadata: {
      createdAt: new Date().toISOString(),
      templateId: template.id || 'unknown',
      formData: formData || {},
      aiGenerated: true,
      isEnglishLesson: template.category === 'English/Language Arts'
    }
  };
}

function extractTestQuestions(content) {
  const testMatches = content.match(/(?:Test Questions?|Assessment|Quiz).*?\n(.*?)(?=###|##|Extension|$)/s);
  if (testMatches) {
    return testMatches[1].trim().split('\n').filter(line => line.trim().length > 0);
  }
  return [];
}

function extractConceptExplanation(content) {
  const conceptMatch = content.match(/(?:What is|Definition|Concept).*?\n(.*?)(?=###|##|\n\n)/s);
  return conceptMatch ? conceptMatch[1].trim() : '';
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

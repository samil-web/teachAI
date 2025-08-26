import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  let requestData;
  try {
    requestData = await request.json();
    const { template, formData } = requestData;
    
    // Debug: Log the received data
    console.log('Received template data:', { templateId: template.id, formData });
    
    // Validate required data
    if (!template || !formData) {
      return NextResponse.json(
        { error: 'Missing template or form data' },
        { status: 400 }
      );
    }

    // Build the template-specific prompt
    const prompt = buildTemplatePrompt(template, formData);
    
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
    
    const generatedContent = message.content[0].text;
    
    // Process the template with form data and AI content
    const processedLessonPlan = processTemplate(template, formData, generatedContent);
    
    return NextResponse.json({ 
      success: true, 
      lessonPlan: processedLessonPlan,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating template lesson plan:', error);
    
    // Return a fallback lesson plan structure
    const fallbackPlan = createTemplateFallback(requestData?.template, requestData?.formData || {});
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate lesson plan with AI. Providing template instead.',
      lessonPlan: fallbackPlan,
      generatedAt: new Date().toISOString()
    });
  }
}

function buildTemplatePrompt(template, formData) {
  // Extract form data for easy access
  const fields = { ...formData };
  
  return `You are an expert education consultant creating a lesson plan using the "${template.name}" template. 

TEMPLATE CONTEXT:
- Template Type: ${template.name}
- Category: ${template.category}
- Grade Level: ${fields.grade}
- Duration: ${fields.duration} minutes

FORM DATA PROVIDED:
${Object.entries(fields).map(([key, value]) => `- ${key}: ${value || 'Not provided'}`).join('\n')}

INSTRUCTIONS:
You must provide a COMPLETE lesson plan that fills in ALL placeholders and AI sections. Return the lesson plan in this EXACT format:

1. First, provide the complete lesson plan with all {{placeholders}} replaced and all [AI_GENERATED_...] sections filled with detailed content
2. Make sure EVERY placeholder gets actual content - no empty {{}} should remain
3. Replace ALL [AI_GENERATED_...] sections with specific, detailed content
4. Ensure all content is age-appropriate for Grade ${fields.grade}
5. Make activities fit within the ${fields.duration}-minute timeframe

TEMPLATE TO FILL:
${template.template}

SPECIFIC REQUIREMENTS FOR ${template.category.toUpperCase()}:
${getSubjectSpecificGuidelines(template.category, fields)}

Return the complete, filled lesson plan with NO placeholders or [AI_GENERATED_...] sections remaining. Every section should have actual, usable content.`;
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

function processTemplate(template, formData, aiContent) {
  // Since we're asking Claude to return a complete lesson plan with all placeholders filled,
  // we can use the AI content directly as it should already be processed
  return {
    title: `${formData.experiment_title || formData.math_topic || formData.literary_work || formData.project_title || template.name} - Grade ${formData.grade}`,
    template: template.name,
    category: template.category,
    grade: formData.grade,
    duration: formData.duration,
    content: aiContent, // Use AI content directly since it should be complete
    metadata: {
      createdAt: new Date().toISOString(),
      templateId: template.id,
      formData: formData,
      aiGenerated: true
    }
  };
}

function extractAISections(aiContent) {
  // Parse AI-generated content to extract different sections
  // This is a simplified version - you might want more sophisticated parsing
  const sections = {};
  
  // Split content by common section headers and map to template placeholders
  const lines = aiContent.split('\n');
  let currentSection = 'GENERAL';
  let currentContent = [];
  
  lines.forEach(line => {
    if (line.startsWith('##') || line.startsWith('#')) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      
      // Start new section
      const header = line.replace(/^#+\s*/, '').toLowerCase();
      if (header.includes('objective')) currentSection = 'OBJECTIVES';
      else if (header.includes('hook') || header.includes('opening')) currentSection = 'HOOK';
      else if (header.includes('procedure') || header.includes('activity')) currentSection = 'STEP_BY_STEP_PROCEDURE';
      else if (header.includes('assessment') || header.includes('rubric')) currentSection = 'ASSESSMENT_RUBRIC';
      else if (header.includes('differentiation')) currentSection = 'DIFFERENTIATION_STRATEGIES';
      else if (header.includes('homework') || header.includes('extension')) currentSection = 'HOMEWORK_SUGGESTIONS';
      else currentSection = 'GENERAL';
      
      currentContent = [];
    } else if (line.trim()) {
      currentContent.push(line);
    }
  });
  
  // Save final section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  // Ensure we have content for common sections
  if (!sections.OBJECTIVES) sections.OBJECTIVES = 'Students will demonstrate understanding of the lesson content through active participation and assessment.';
  if (!sections.HOOK) sections.HOOK = 'Begin with an engaging question or activity to capture student interest.';
  if (!sections.ASSESSMENT_RUBRIC) sections.ASSESSMENT_RUBRIC = 'Assess student understanding through observation, questioning, and completion of activities.';
  
  return sections;
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

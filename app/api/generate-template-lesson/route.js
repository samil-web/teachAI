import { NextResponse } from 'next/server';
import { buildPrompt, processTemplate, generateWithClaude, createTemplateFallback } from '../../../utils/lesson-utils';

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
    
    const generatedContent = await generateWithClaude(prompt);
    console.log('Received response from Claude API');
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


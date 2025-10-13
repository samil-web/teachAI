import { NextResponse } from 'next/server';
import { generateWithClaude, getQuestionFormatGuidelines } from '../../../utils/lesson-utils.js';

export async function POST(request) {
  try {
    console.log('Received request to generate test');
    const { lessonContent, testSpecifications } = await request.json();
    console.log('Request payload:', { lessonContent: lessonContent?.substring(0, 100) + '...', testSpecifications });
    
    // Validate required data
    if (!lessonContent || !testSpecifications) {
      console.error('Missing lesson content or test specifications');
      return NextResponse.json(
        { error: 'Missing lesson content or test specifications' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY is not set in environment');
      return NextResponse.json({ error: 'Server configuration error: API key is not set' }, { status: 500 });
    }

    // Build test generation prompt
    const prompt = buildTestPrompt(lessonContent, testSpecifications);
    console.log('Sending test generation request to Claude API');
    
    const generatedTest = await generateWithClaude(prompt);
    console.log('Received test from Claude API');
    
    // Process the generated test
    const processedTest = processGeneratedTest(generatedTest, testSpecifications);
    console.log('Processed test data:', processedTest);
    
    return NextResponse.json({ 
      success: true, 
      test: processedTest,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating test:', error);
    
    // Return a fallback test structure
    const fallbackTest = createTestFallback(testSpecifications);
    console.log('Returning fallback test:', fallbackTest);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate test with AI. Providing template instead.',
      test: fallbackTest,
      generatedAt: new Date().toISOString()
    });
  }
}

function buildTestPrompt(lessonContent, specs) {
  const instructions = `You are an expert assessment creator specializing in English language education. Your task is to create a customized test based on the provided lesson content and teacher specifications.

**FOCUS: TEST GENERATION ONLY**
- Create comprehensive assessments based on lesson content
- Generate questions that directly test the concepts from the lesson
- Provide detailed answer keys and grading rubrics
- Follow the teacher's specific customization requirements

**TEST SPECIFICATIONS:**
- Number of Questions: ${specs.questionCount || '10'}
- Question Format: ${specs.questionTypes || 'mixed_balanced'}
- Difficulty Level: ${specs.difficultyLevel || 'intermediate'}
- Custom Distribution: ${specs.customDistribution || 'N/A'}

**EXAMPLE QUESTION STYLE:**
${specs.exampleQuestion ? `Follow this style: "${specs.exampleQuestion}"` : 'Use standard academic format'}

**COMPLEXITY REQUIREMENTS:**
${specs.complexityNotes || 'Grade-appropriate complexity'}

**INSTRUCTIONS:**
1. **Analyze Lesson Content**: Carefully review the lesson content to identify key concepts, examples, and learning objectives
2. **Extract Testable Elements**: Identify the main concepts, vocabulary, examples, and skills taught in the lesson
3. **Create Targeted Questions**: Generate exactly ${specs.questionCount || '10'} questions that directly test the lesson content
4. **Follow Format Guidelines**: ${getQuestionFormatGuidelines(specs.questionTypes, specs.difficultyLevel)}
5. **Align with Lesson Examples**: Use similar examples and patterns from the lesson content in your questions
6. **Provide Comprehensive Answer Key**: Include detailed answers with explanations referencing the lesson content
7. **Create Detailed Rubric**: Provide specific grading criteria, especially for subjective questions

**LESSON CONTENT TO BASE TEST ON:**
${lessonContent}

**OUTPUT FORMAT:**
Structure your response as:
=== TEST QUESTIONS ===
[Numbered questions here - must directly relate to lesson content]

=== ANSWER KEY ===
[Detailed answers with explanations referencing lesson examples]

=== GRADING RUBRIC ===
[Specific scoring criteria for each question type with point values]`;

  return instructions;
}

function processGeneratedTest(testContent, specs) {
  // Extract different sections from the generated test
  const questionsMatch = testContent.match(/=== TEST QUESTIONS ===(.*?)(?:=== ANSWER KEY ===|$)/s);
  const answerKeyMatch = testContent.match(/=== ANSWER KEY ===(.*?)(?:=== GRADING RUBRIC ===|$)/s);
  const rubricMatch = testContent.match(/=== GRADING RUBRIC ===(.*?)$/s);

  const questions = questionsMatch ? questionsMatch[1].trim() : testContent;
  const answerKey = answerKeyMatch ? answerKeyMatch[1].trim() : 'Answer key not found';
  const rubric = rubricMatch ? rubricMatch[1].trim() : 'Rubric not found';

  // Parse individual questions
  const questionList = parseQuestions(questions);

  return {
    title: `Custom Assessment - ${specs.conceptName || 'English Concept'}`,
    specifications: specs,
    questions: questionList,
    rawQuestions: questions,
    answerKey: answerKey,
    rubric: rubric,
    metadata: {
      createdAt: new Date().toISOString(),
      questionCount: questionList.length,
      aiGenerated: true
    }
  };
}

function parseQuestions(questionsText) {
  // Split questions by numbers (1., 2., etc.)
  const questionPattern = /(\d+\.\s*.*?)(?=\d+\.\s*|$)/gs;
  const matches = questionsText.match(questionPattern) || [];
  
  return matches.map((question, index) => ({
    id: index + 1,
    text: question.trim(),
    type: detectQuestionType(question)
  }));
}

function detectQuestionType(questionText) {
  if (questionText.includes('A)') || questionText.includes('a)')) {
    return 'multiple_choice';
  } else if (questionText.includes('Explain') || questionText.includes('Describe') || questionText.includes('Why')) {
    return 'short_answer';
  } else {
    return 'open_ended';
  }
}

function createTestFallback(specs) {
  return {
    title: `Fallback Test - ${specs.conceptName || 'English Concept'}`,
    specifications: specs,
    questions: [
      {
        id: 1,
        text: `1. Define ${specs.conceptName || 'the concept'} in your own words.`,
        type: 'short_answer'
      },
      {
        id: 2,
        text: `2. Provide an example of ${specs.conceptName || 'the concept'} from the lesson.`,
        type: 'short_answer'
      }
    ],
    rawQuestions: `1. Define ${specs.conceptName || 'the concept'} in your own words.\n\n2. Provide an example of ${specs.conceptName || 'the concept'} from the lesson.`,
    answerKey: 'Answers will vary based on lesson content.',
    rubric: 'Grade based on accuracy and completeness of responses.',
    metadata: {
      createdAt: new Date().toISOString(),
      questionCount: 2,
      fallback: true
    }
  };
}

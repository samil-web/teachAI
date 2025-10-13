"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const REQUIRED_QUESTIONS = [
  {
    id: "subject",
    title: "What subject will you be teaching?",
    type: "text",
    placeholder: "e.g., Mathematics, Science, History, English",
    required: true,
    defaultValue: "Mathematics"
  },
  {
    id: "grade",
    title: "What grade level are you teaching?",
    type: "select",
    options: [
      { value: "1", label: "Grade 1" },
      { value: "2", label: "Grade 2" },
      { value: "3", label: "Grade 3" },
      { value: "4", label: "Grade 4" },
      { value: "5", label: "Grade 5" },
      { value: "6", label: "Grade 6" },
      { value: "7", label: "Grade 7" },
      { value: "8", label: "Grade 8" },
      { value: "9", label: "Grade 9" },
      { value: "10", label: "Grade 10" },
      { value: "11", label: "Grade 11" }
    ],
    required: true,
    defaultValue: "5"
  },
  {
    id: "duration",
    title: "How long is your lesson?",
    type: "select",
    options: [
      { value: "30", label: "30 minutes" },
      { value: "45", label: "45 minutes" },
      { value: "60", label: "1 hour" },
      { value: "90", label: "1.5 hours" },
      { value: "120", label: "2 hours" }
    ],
    required: true,
    defaultValue: "45"
  },
  {
    id: "objective",
    title: "What should students learn by the end of this lesson?",
    type: "textarea",
    placeholder: "Describe the main learning objective or goal...",
    required: true,
    defaultValue: "Students will understand and apply basic mathematical concepts through interactive problem-solving activities."
  },
  {
    id: "assessment",
    title: "How would you like to assess student learning?",
    type: "select",
    options: [
      { value: "quiz", label: "Quiz or Test" },
      { value: "discussion", label: "Class Discussion" },
      { value: "project", label: "Project or Assignment" },
      { value: "presentation", label: "Student Presentation" },
      { value: "worksheet", label: "Worksheet or Handout" },
      { value: "observation", label: "Teacher Observation" }
    ],
    required: true,
    defaultValue: "discussion"
  }
];

const OPTIONAL_QUESTIONS = [
  {
    id: "students",
    title: "How many students are in your class?",
    type: "number",
    placeholder: "e.g., 25",
    required: false
  },
  {
    id: "prior_knowledge",
    title: "What's your students' prior knowledge level?",
    type: "select",
    options: [
      { value: "beginner", label: "Beginner (no prior knowledge)" },
      { value: "intermediate", label: "Intermediate (some background)" },
      { value: "advanced", label: "Advanced (strong foundation)" }
    ],
    required: false
  },
  {
    id: "learning_styles",
    title: "What learning preferences should we consider?",
    type: "select",
    options: [
      { value: "mixed", label: "Mixed (Visual, Auditory, Kinesthetic)" },
      { value: "visual", label: "Primarily Visual" },
      { value: "auditory", label: "Primarily Auditory" },
      { value: "kinesthetic", label: "Primarily Hands-on/Kinesthetic" }
    ],
    required: false
  },
  {
    id: "materials",
    title: "What materials and technology do you have available?",
    type: "textarea",
    placeholder: "e.g., textbooks, computers, lab equipment, art supplies...",
    required: false
  },
  {
    id: "accommodations",
    title: "Any special accommodations needed?",
    type: "textarea",
    placeholder: "Describe any students with special needs or learning differences...",
    required: false
  }
];

export default function QuestionWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(() => {
    // Initialize with default values for required questions
    const defaultAnswers = {};
    REQUIRED_QUESTIONS.forEach(question => {
      if (question.defaultValue) {
        defaultAnswers[question.id] = question.defaultValue;
      }
    });
    return defaultAnswers;
  });
  const [showOptional, setShowOptional] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const allQuestions = showOptional ? [...REQUIRED_QUESTIONS, ...OPTIONAL_QUESTIONS] : REQUIRED_QUESTIONS;
  const currentQuestion = allQuestions[currentStep];
  const isLastStep = currentStep === allQuestions.length - 1;
  const isLastRequired = currentStep === REQUIRED_QUESTIONS.length;

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      handleGenerate();
    } else if (isLastRequired && !showOptional) {
      // Show option to continue with optional questions or generate
      return;
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkipOptional = () => {
    handleGenerate();
  };

  const handleContinueOptional = () => {
    setShowOptional(true);
    setCurrentStep(REQUIRED_QUESTIONS.length);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Debug: Log what we're sending
      console.log('Sending answers:', answers);
      
      // Call the API to generate lesson plan
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }

      const lessonPlan = await response.json();
      onComplete(lessonPlan);
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      // Handle error - show error message to user
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const isCurrentAnswerValid = () => {
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.required) return true;
    return answer && answer.toString().trim().length > 0;
  };

  const progress = ((currentStep + 1) / allQuestions.length) * 100;

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Creating Your Lesson Plan</h2>
          <p className="text-gray-600">Our AI is crafting a personalized lesson plan based on your inputs...</p>
        </div>
      </div>
    );
  }

  // Show completion options after required questions
  if (isLastRequired && !showOptional) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Generate Your Lesson Plan!</h2>
          <p className="text-gray-600 mb-8">
            You've provided all the essential information. You can generate your lesson plan now, 
            or answer a few optional questions for more customization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleSkipOptional}
              className="btn btn-primary btn-lg px-8"
            >
              Generate Lesson Plan
            </button>
            <button 
              onClick={handleContinueOptional}
              className="btn btn-outline btn-lg px-8"
            >
              Answer Optional Questions
            </button>
          </div>
          
          <button 
            onClick={handleBack}
            className="btn btn-ghost mt-4"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentStep + 1} of {allQuestions.length}
          </span>
          <span className="text-sm text-gray-500">
            {showOptional && currentStep >= REQUIRED_QUESTIONS.length ? 'Optional' : 'Required'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {currentQuestion.title}
        </h2>

        {currentQuestion.type === 'text' && (
          <input
            type="text"
            className="input input-bordered w-full input-lg"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        )}

        {currentQuestion.type === 'number' && (
          <input
            type="number"
            className="input input-bordered w-full input-lg"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        )}

        {currentQuestion.type === 'textarea' && (
          <textarea
            className="textarea textarea-bordered w-full h-32 text-lg"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        )}

        {currentQuestion.type === 'select' && (
          <select
            className="select select-bordered w-full select-lg"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            <option value="">Choose an option...</option>
            {currentQuestion.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="btn btn-outline"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="flex gap-2">
          {!currentQuestion.required && (
            <button
              onClick={handleNext}
              className="btn btn-ghost"
            >
              Skip
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentQuestion.required && !isCurrentAnswerValid()}
            className="btn btn-primary"
          >
            {isLastStep ? 'Generate Lesson Plan' : 'Next'}
            {!isLastStep && <ChevronRightIcon className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}

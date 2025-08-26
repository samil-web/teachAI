"use client";

import { useState } from "react";
import TemplateSelector from "../../components/TemplateSelector";
import TemplateForm from "../../components/TemplateForm";
import LessonDisplay from "../../components/LessonDisplay";

export default function TemplatesPage() {
  const [currentStep, setCurrentStep] = useState('select'); // 'select', 'form', 'result'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedLesson, setGeneratedLesson] = useState(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCurrentStep('form');
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setCurrentStep('select');
  };

  const handleLessonGenerate = async (templateData) => {
    try {
      const response = await fetch('/api/generate-template-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate lesson plan');
      }

      const result = await response.json();
      setGeneratedLesson(result.lessonPlan);
      setCurrentStep('result');
    } catch (error) {
      console.error('Error generating lesson:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleStartOver = () => {
    setSelectedTemplate(null);
    setGeneratedLesson(null);
    setCurrentStep('select');
  };

  const handleEditTemplate = () => {
    setCurrentStep('form');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button 
              onClick={handleStartOver}
              className={`hover:text-gray-700 ${currentStep === 'select' ? 'text-primary font-medium' : ''}`}
            >
              Templates
            </button>
            {currentStep !== 'select' && (
              <>
                <span>›</span>
                <button 
                  onClick={() => setCurrentStep('form')}
                  className={`hover:text-gray-700 ${currentStep === 'form' ? 'text-primary font-medium' : ''}`}
                >
                  {selectedTemplate?.name}
                </button>
              </>
            )}
            {currentStep === 'result' && (
              <>
                <span>›</span>
                <span className="text-primary font-medium">Generated Lesson</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {currentStep === 'select' && (
          <TemplateSelector onTemplateSelect={handleTemplateSelect} />
        )}

        {currentStep === 'form' && selectedTemplate && (
          <TemplateForm 
            template={selectedTemplate}
            onGenerate={handleLessonGenerate}
            onBack={handleBackToTemplates}
          />
        )}

        {currentStep === 'result' && generatedLesson && (
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {generatedLesson.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {generatedLesson.template}
                  </span>
                  <span>Grade {generatedLesson.grade}</span>
                  <span>{generatedLesson.duration} minutes</span>
                  <span>{generatedLesson.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditTemplate}
                  className="btn btn-outline"
                >
                  Edit Template
                </button>
                <button
                  onClick={handleStartOver}
                  className="btn btn-primary"
                >
                  New Template
                </button>
              </div>
            </div>

            <LessonDisplay lessonPlan={generatedLesson} />
          </div>
        )}
      </div>
    </div>
  );
}

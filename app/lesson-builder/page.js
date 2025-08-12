"use client";

import { useState } from "react";
import QuestionWizard from "@/components/QuestionWizard";
import LessonPlanDisplay from "@/components/LessonPlanDisplay";

export default function LessonBuilderPage() {
  const [currentStep, setCurrentStep] = useState('wizard'); // 'wizard', 'display'
  const [lessonPlan, setLessonPlan] = useState(null);

  const handleWizardComplete = (generatedLessonPlan) => {
    setLessonPlan(generatedLessonPlan.lessonPlan);
    setCurrentStep('display');
  };

  const handleBackToWizard = () => {
    setCurrentStep('wizard');
    setLessonPlan(null);
  };

  const handleEditLesson = (plan) => {
    // For now, just go back to wizard
    // In the future, this could open an edit mode
    handleBackToWizard();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl">TeachAI</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Lesson Builder</span>
            </div>
            
            <a href="/" className="btn btn-ghost">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {currentStep === 'wizard' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your Lesson Plan
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Answer a few questions and let AI create a personalized lesson plan for your class.
              </p>
            </div>
            
            <QuestionWizard onComplete={handleWizardComplete} />
          </div>
        )}

        {currentStep === 'display' && lessonPlan && (
          <LessonPlanDisplay 
            lessonPlan={lessonPlan}
            onBack={handleBackToWizard}
            onEdit={handleEditLesson}
          />
        )}
      </main>
    </div>
  );
}

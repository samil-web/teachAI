"use client";

import { useState } from "react";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  DocumentArrowDownIcon, 
  PencilIcon, 
  ShareIcon,
  PrinterIcon,
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  BeakerIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";
import { InteractiveComponent } from './InteractiveElements';
import { StoryComponent } from './StoryElements';
import { SUBJECT_TYPES } from '@/utils/subject-classifier';

export default function PaginatedLessonDisplay({ lessonPlan, onBack, onEdit }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const sections = lessonPlan.sections || [];
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;

  const handleNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleSectionJump = (index) => {
    setCurrentSectionIndex(index);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      // For now, just copy to clipboard as fallback
      const fullContent = sections.map(section => 
        `## ${section.title}\n\n${section.content}\n\n`
      ).join('');
      
      navigator.clipboard.writeText(fullContent);
      alert('Lesson plan copied to clipboard!');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lessonPlan.title,
          text: `Check out this lesson plan: ${lessonPlan.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!sections.length) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <p className="text-gray-600">No lesson plan sections available.</p>
          <button onClick={onBack} className="btn btn-primary mt-4">
            Create New Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <button
            onClick={onBack}
            className="btn btn-ghost btn-sm mb-2"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Create Another Lesson
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lessonPlan.title}
          </h1>
          
          {/* Quick info cards */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              <AcademicCapIcon className="w-4 h-4 mr-1" />
              Grade {lessonPlan.grade}
            </div>
            <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
              <ClockIcon className="w-4 h-4 mr-1" />
              {lessonPlan.duration} minutes
            </div>
            <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              {lessonPlan.subject}
            </div>
          </div>

          {/* Learning Objective */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Learning Objective</h3>
            <p className="text-blue-800 text-sm leading-relaxed">{lessonPlan.objective}</p>
          </div>

          {/* Subject-Specific Interactive Elements */}
          {lessonPlan.subjectType === SUBJECT_TYPES.TECHNICAL && lessonPlan.interactives?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BeakerIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">Interactive Learning Tools</h3>
              </div>
              <div className="space-y-4">
                {lessonPlan.interactives.map((interactive, index) => (
                  <InteractiveComponent 
                    key={index} 
                    interactive={interactive}
                    onInteraction={(data) => console.log('Interactive data:', data)}
                  />
                ))}
              </div>
            </div>
          )}

          {lessonPlan.subjectType === SUBJECT_TYPES.HUMANITARIAN && lessonPlan.narratives?.storyElements?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpenIcon className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">Story-Based Learning</h3>
              </div>
              <div className="space-y-4">
                {lessonPlan.narratives.storyElements.map((narrative, index) => (
                  <StoryComponent 
                    key={index} 
                    narrative={narrative}
                    onInteraction={(data) => console.log('Story interaction:', data)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit && onEdit(lessonPlan)}
            className="btn btn-outline btn-sm"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-sm">
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button onClick={() => handleExport('pdf')} disabled={isExporting}>
                  Export as PDF
                </button>
              </li>
              <li>
                <button onClick={() => handleExport('txt')} disabled={isExporting}>
                  Copy to Clipboard
                </button>
              </li>
            </ul>
          </div>

          <button onClick={handlePrint} className="btn btn-outline btn-sm">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </button>

          <button onClick={handleShare} className="btn btn-outline btn-sm">
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">Lesson Sections</h3>
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionJump(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    index === currentSectionIndex
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </div>
                </button>
              ))}
            </nav>

            {/* Progress indicator */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span>{currentSectionIndex + 1} of {totalSections}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Section Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentSection.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Section {currentSectionIndex + 1} of {totalSections}
                  </p>
                </div>
                
                {/* Section navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSection}
                    disabled={currentSectionIndex === 0}
                    className="btn btn-ghost btn-sm"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSection}
                    disabled={currentSectionIndex === totalSections - 1}
                    className="btn btn-ghost btn-sm"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <SectionContent content={currentSection.content} />
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevSection}
                  disabled={currentSectionIndex === 0}
                  className="btn btn-outline"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <span className="text-sm text-gray-500">
                  {currentSectionIndex + 1} / {totalSections}
                </span>

                <button
                  onClick={handleNextSection}
                  disabled={currentSectionIndex === totalSections - 1}
                  className="btn btn-primary"
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Final action buttons (show on last section) */}
          {currentSectionIndex === totalSections - 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={onBack}
                className="btn btn-outline btn-lg px-8"
              >
                Create Another Lesson
              </button>
              <button
                onClick={() => onEdit && onEdit(lessonPlan)}
                className="btn btn-primary btn-lg px-8"
              >
                Customize This Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      {lessonPlan.metadata && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 text-center">
          <p>Generated on {new Date(lessonPlan.metadata.createdAt).toLocaleDateString()}</p>
          {lessonPlan.metadata.fallback && (
            <p className="text-amber-600 mt-1">
              ⚠️ This is a template lesson plan. For AI-generated content, please configure your Claude API key.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Component to render individual section content with proper formatting
function SectionContent({ content }) {
  const formatContent = (text) => {
    return text
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();
        
        // Skip empty lines
        if (!trimmedLine) {
          return <div key={index} className="h-3"></div>;
        }

        // Headers
        if (trimmedLine.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-gray-800 border-b border-gray-200 pb-2">
              {trimmedLine.substring(4)}
            </h3>
          );
        }
        if (trimmedLine.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-semibold mt-6 mb-4 text-gray-900">
              {trimmedLine.substring(3)}
            </h2>
          );
        }
        
        // Bold text (for emphasis)
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          return (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3 my-3 rounded-r-lg">
              <p className="font-semibold text-blue-900">{trimmedLine.slice(2, -2)}</p>
            </div>
          );
        }
        
        // Lists with better styling
        if (trimmedLine.startsWith('- ')) {
          return (
            <li key={index} className="ml-6 mb-2 text-gray-700 leading-relaxed list-disc">
              {trimmedLine.substring(2)}
            </li>
          );
        }
        
        // Numbered lists
        if (/^\d+\.\s/.test(trimmedLine)) {
          return (
            <li key={index} className="ml-6 mb-2 text-gray-700 leading-relaxed list-decimal">
              {trimmedLine.replace(/^\d+\.\s/, '')}
            </li>
          );
        }

        // Teacher scripts or quotes (lines starting with quotes)
        if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
          return (
            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4 my-3">
              <p className="text-green-800 italic">{trimmedLine}</p>
              <span className="text-xs text-green-600 font-medium">Teacher Script</span>
            </div>
          );
        }

        // Time indicators (e.g., "(5 minutes)")
        if (/^\(\d+\s*minutes?\)/.test(trimmedLine)) {
          return (
            <div key={index} className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium my-2">
              <ClockIcon className="w-3 h-3 mr-1" />
              {trimmedLine}
            </div>
          );
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {trimmedLine}
          </p>
        );
      });
  };

  return (
    <div className="section-content">
      {formatContent(content)}
    </div>
  );
}

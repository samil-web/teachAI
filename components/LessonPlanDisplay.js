"use client";

import { useState } from "react";
import { 
  DocumentArrowDownIcon, 
  PencilIcon, 
  ShareIcon,
  PrinterIcon,
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";

export default function LessonPlanDisplay({ lessonPlan, onBack, onEdit }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      // In a real implementation, you'd call an API to generate the export
      const response = await fetch('/api/export-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonPlan, format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lessonPlan.title}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // For now, just copy to clipboard as fallback
      navigator.clipboard.writeText(lessonPlan.content);
      alert('Lesson plan copied to clipboard!');
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
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <button
            onClick={onBack}
            className="btn btn-ghost btn-sm mb-2"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Create Another Lesson
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {lessonPlan.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
            <span className="badge badge-outline">Grade {lessonPlan.grade}</span>
            <span className="badge badge-outline">{lessonPlan.duration} minutes</span>
            <span className="badge badge-outline">{lessonPlan.subject}</span>
          </div>
        </div>

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
                <button onClick={() => handleExport('docx')} disabled={isExporting}>
                  Export as Word
                </button>
              </li>
              <li>
                <button onClick={() => handleExport('txt')} disabled={isExporting}>
                  Export as Text
                </button>
              </li>
            </ul>
          </div>

          <button
            onClick={handlePrint}
            className="btn btn-outline btn-sm"
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </button>

          <button
            onClick={handleShare}
            className="btn btn-outline btn-sm"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Lesson plan content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-8 print:p-4">
          {/* Quick info bar */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 print:bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-blue-800">Subject:</span>
                <span className="ml-2 text-blue-700">{lessonPlan.subject}</span>
              </div>
              <div>
                <span className="font-semibold text-blue-800">Duration:</span>
                <span className="ml-2 text-blue-700">{lessonPlan.duration} minutes</span>
              </div>
              <div>
                <span className="font-semibold text-blue-800">Assessment:</span>
                <span className="ml-2 text-blue-700">{lessonPlan.assessment}</span>
              </div>
            </div>
          </div>

          {/* Main objective */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Learning Objective</h2>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              {lessonPlan.objective}
            </p>
          </div>

          {/* Generated content */}
          <div className="prose prose-lg max-w-none">
            <LessonContent content={lessonPlan.content} />
          </div>

          {/* Metadata */}
          {lessonPlan.metadata && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Generated on {new Date(lessonPlan.metadata.createdAt).toLocaleDateString()}</p>
              {lessonPlan.metadata.fallback && (
                <p className="text-amber-600 mt-1">
                  ⚠️ This is a template lesson plan. For AI-generated content, please configure your Gemini API key.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons at bottom */}
      <div className="flex justify-center gap-4 mt-8 print:hidden">
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
    </div>
  );
}

// Component to render the lesson plan content with proper formatting
function LessonContent({ content }) {
  // Convert markdown-like content to HTML
  const formatContent = (text) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-gray-800">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-700">{line.substring(4)}</h3>;
        }
        
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mt-2 mb-1 text-gray-800">{line.slice(2, -2)}</p>;
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1 text-gray-700">{line.substring(2)}</li>;
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>;
        }
        
        // Regular paragraphs
        return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="lesson-content">
      {formatContent(content)}
    </div>
  );
}

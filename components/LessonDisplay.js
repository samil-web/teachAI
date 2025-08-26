"use client";

import { useState } from "react";
import { DocumentDuplicateIcon, PrinterIcon, ShareIcon } from "@heroicons/react/24/outline";

export default function LessonDisplay({ lessonPlan }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lessonPlan.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatContent = (content) => {
    // Convert markdown-style content to HTML-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Handle headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-8">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-3 mt-6">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium text-gray-700 mb-2 mt-4">{line.substring(4)}</h3>;
        }
        
        // Handle bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="mb-2">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Handle bullet points
        if (line.startsWith('- ')) {
          return <li key={index} className="mb-1 ml-4">{line.substring(2)}</li>;
        }
        
        // Handle empty lines
        if (line.trim() === '') {
          return <div key={index} className="mb-2"></div>;
        }
        
        // Regular paragraphs
        return <p key={index} className="mb-2 leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Action Bar */}
      <div className="border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              {lessonPlan.metadata?.aiGenerated ? 'AI Generated' : 'Template'}
            </span>
            <span>Created {new Date(lessonPlan.metadata?.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="btn btn-sm btn-outline"
              title="Copy to clipboard"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={handlePrint}
              className="btn btn-sm btn-outline"
              title="Print lesson plan"
            >
              <PrinterIcon className="w-4 h-4 mr-1" />
              Print
            </button>
            
            <button
              onClick={handleShare}
              className="btn btn-sm btn-outline"
              title="Share lesson plan"
            >
              <ShareIcon className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="px-6 py-8">
        <div className="prose prose-lg max-w-none">
          {formatContent(lessonPlan.content)}
        </div>
      </div>

      {/* Metadata Footer */}
      {lessonPlan.metadata && (
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {lessonPlan.metadata.templateId && (
              <div>
                <span className="font-medium text-gray-700">Template:</span>
                <span className="ml-2 text-gray-600">{lessonPlan.metadata.templateId}</span>
              </div>
            )}
            
            <div>
              <span className="font-medium text-gray-700">Duration:</span>
              <span className="ml-2 text-gray-600">{lessonPlan.duration} minutes</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Grade Level:</span>
              <span className="ml-2 text-gray-600">Grade {lessonPlan.grade}</span>
            </div>
          </div>
          
          {lessonPlan.metadata.fallback && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                ⚠️ This is a fallback template. For AI-generated content, ensure your API is properly configured.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

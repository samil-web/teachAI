"use client";

import { useState } from "react";
import { DocumentDuplicateIcon, PrinterIcon, ShareIcon } from "@heroicons/react/24/outline";

export default function LessonDisplay({ lesson }) {
  const [activeTab, setActiveTab] = useState('teacher');

  // Function to format markdown-like content to HTML
  const formatContent = (content) => {
    if (!content) return <p>No content available.</p>;

    // Split content into lines
    const lines = content.split('\n');
    const elements = [];
    let currentList = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        // Empty line, close any open list
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<br key={`br-${i}`} />);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<h1 key={`h1-${i}`} className="text-2xl font-bold mb-2">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<h2 key={`h2-${i}`} className="text-xl font-semibold mb-2">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<h3 key={`h3-${i}`} className="text-lg font-medium mb-2">{line.slice(4)}</h3>);
      }
      // Bold and italic
      else if (line.startsWith('**') && line.endsWith('**')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<p key={`p-${i}`}><strong>{line.slice(2, -2)}</strong></p>);
      } else if (line.startsWith('*') && line.endsWith('*')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<p key={`p-${i}`}><em>{line.slice(1, -1)}</em></p>);
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!currentList || currentList.type !== 'ul') {
          if (currentList) elements.push(currentList);
          currentList = { type: 'ul', key: `ul-${i}`, items: [] };
        }
        currentList.items.push(<li key={`li-${i}`} className="ml-4">{line.slice(2)}</li>);
      } else if (line.match(/^\d+\. /)) {
        if (!currentList || currentList.type !== 'ol') {
          if (currentList) elements.push(currentList);
          currentList = { type: 'ol', key: `ol-${i}`, items: [] };
        }
        currentList.items.push(<li key={`li-${i}`} className="ml-4">{line.replace(/^\d+\. /, '')}</li>);
      }
      // Paragraphs
      else {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
        }
        elements.push(<p key={`p-${i}`}>{line}</p>);
      }
    }
    if (currentList) elements.push(currentList);

    // Render lists properly
    return elements.map(el => {
      if (el && el.type === 'ul') return <ul key={el.key} className="mb-2">{el.items}</ul>;
      if (el && el.type === 'ol') return <ol key={el.key} className="mb-2">{el.items}</ol>;
      return el;
    });
  };

  // Function to copy content to clipboard
  const copyToClipboard = () => {
    const content = activeTab === 'teacher' ? lesson.teacherContent || '' : lesson.studentContent || '';
    navigator.clipboard.writeText(content);
    alert('Lesson content copied to clipboard!');
  };

  // Function to print content
  const printContent = () => {
    const content = activeTab === 'teacher' ? lesson.teacherContent || '' : lesson.studentContent || '';
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Lesson Plan</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
            h3 { font-size: 16px; }
            p { margin: 8px 0; }
            ul, ol { margin-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${lesson.title || 'Lesson Plan'} - ${activeTab === 'teacher' ? 'Teacher Plan' : 'Student Plan'}</h1>
          ${content.split('\n').map(line => {
            if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
            if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
            if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
            if (line.startsWith('- ') || line.startsWith('* ')) return `<li>${line.slice(2)}</li>`;
            if (line.match(/^\d+\. /)) return `<li>${line.replace(/^\d+\. /, '')}</li>`;
            return `<p>${line}</p>`;
          }).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{lesson.title || 'Untitled Lesson'}</h1>
      <div className="mb-4 text-gray-600">
        <p><strong>Category:</strong> {lesson.category || 'N/A'}</p>
        <p><strong>Grade:</strong> {lesson.grade || 'N/A'}</p>
        <p><strong>Duration:</strong> {lesson.duration || 'N/A'} minutes</p>
        <p><strong>Created:</strong> {lesson.metadata?.createdAt ? new Date(lesson.metadata.createdAt).toLocaleString() : 'N/A'}</p>
      </div>

      {/* Tab Navigation for Teacher and Student Views */}
      <div className="flex mb-4 border-b-2">
        <button
          onClick={() => setActiveTab('teacher')}
          className={`px-4 py-2 rounded-t-md focus:outline-none ${activeTab === 'teacher' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Teacher Plan
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`px-4 py-2 rounded-t-md focus:outline-none ${activeTab === 'student' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Student Plan
        </button>
      </div>

      {/* Content Display based on Active Tab */}
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[60vh] overflow-y-auto">
        {activeTab === 'teacher' ? (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Teacher Plan</h2>
            {formatContent(lesson.teacherContent || 'No teacher plan content available.')}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Student Plan</h2>
            {formatContent(lesson.studentContent || 'No student plan content available.')}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
          <DocumentDuplicateIcon className="h-5 w-5" />
          Copy
        </button>
        <button onClick={printContent} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
          <PrinterIcon className="h-5 w-5" />
          Print
        </button>
        {/* Placeholder for Share functionality */}
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors opacity-50" disabled>
          <ShareIcon className="h-5 w-5" />
          Share
        </button>
      </div>
    </div>
  );
}

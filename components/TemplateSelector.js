"use client";

import { useState } from "react";
import { LESSON_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory } from "../data/lesson-templates";

export default function TemplateSelector({ onTemplateSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = getTemplatesByCategory(selectedCategory);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose a Lesson Template
        </h1>
        <p className="text-gray-600 text-lg">
          Select a pre-designed template to create structured, professional lesson plans
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Available Templates</h2>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {template.category}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Grades {template.grades[0]}-{template.grades[template.grades.length - 1]}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {template.duration[0]}-{template.duration[template.duration.length - 1]} min
                    </span>
                  </div>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="ml-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Template Preview */}
        <div className="lg:sticky lg:top-8">
          {selectedTemplate ? (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {selectedTemplate.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedTemplate.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <p className="text-gray-900">
                      {selectedTemplate.duration.join(', ')} minutes
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Grades:</span>
                    <p className="text-gray-900">
                      {selectedTemplate.grades.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Required Fields ({selectedTemplate.requiredFields.length})
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedTemplate.requiredFields.map((field) => (
                    <li key={field.id} className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      {field.label}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedTemplate.optionalFields.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Optional Fields ({selectedTemplate.optionalFields.length})
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedTemplate.optionalFields.map((field) => (
                      <li key={field.id} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        {field.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Template Structure</h4>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-600 max-h-40 overflow-y-auto">
                  {selectedTemplate.template.split('\n').slice(0, 15).join('\n')}
                  {selectedTemplate.template.split('\n').length > 15 && '\n...'}
                </div>
              </div>

              <button
                onClick={handleUseTemplate}
                className="w-full btn btn-primary btn-lg"
              >
                Use This Template
              </button>
            </div>
          ) : (
            <div className="border rounded-lg p-6 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Select a template to see preview and details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

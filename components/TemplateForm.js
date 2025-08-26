"use client";

import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function TemplateForm({ template, onGenerate, onBack }) {
  const [formData, setFormData] = useState({});
  const [currentSection, setCurrentSection] = useState('required');
  const [isGenerating, setIsGenerating] = useState(false);

  const allFields = [...template.requiredFields, ...template.optionalFields];

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const validateRequiredFields = () => {
    return template.requiredFields.every(field => {
      const value = formData[field.id];
      return value && value.toString().trim().length > 0;
    });
  };

  const handleSubmit = async () => {
    if (!validateRequiredFields()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate({
        template,
        formData: {
          ...formData,
          // Add common fields that all templates need
          grade: formData.grade || '8',
          duration: formData.duration || template.duration[0].toString()
        }
      });
    } catch (error) {
      console.error('Error generating lesson:', error);
      alert('Error generating lesson plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';
    const isRequired = template.requiredFields.some(f => f.id === field.id);

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="textarea textarea-bordered w-full h-24"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
          />
        );

      case 'select':
        return (
          <select
            className="select select-bordered w-full"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
          >
            <option value="">Choose an option...</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={isRequired}
          />
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Creating Your Lesson Plan</h2>
          <p className="text-gray-600">
            Generating a customized lesson plan using the {template.name} template...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm mr-4"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Back to Templates
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {template.name}
          </h1>
          <p className="text-gray-600">{template.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Section Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setCurrentSection('required')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                currentSection === 'required'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Required Fields ({template.requiredFields.length})
            </button>
            {template.optionalFields.length > 0 && (
              <button
                onClick={() => setCurrentSection('optional')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  currentSection === 'optional'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Optional Fields ({template.optionalFields.length})
              </button>
            )}
          </div>

          {/* Common Fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level <span className="text-red-500">*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.grade || ''}
                  onChange={(e) => handleFieldChange('grade', e.target.value)}
                  required
                >
                  <option value="">Select grade...</option>
                  {template.grades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.duration || ''}
                  onChange={(e) => handleFieldChange('duration', e.target.value)}
                  required
                >
                  <option value="">Select duration...</option>
                  {template.duration.map((duration) => (
                    <option key={duration} value={duration.toString()}>
                      {duration} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="space-y-6">
            {currentSection === 'required' && (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Required Information
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    All fields are required
                  </span>
                </h3>
                {template.requiredFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </>
            )}

            {currentSection === 'optional' && template.optionalFields.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Optional Information
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    Fill these for more customized results
                  </span>
                </h3>
                {template.optionalFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div className="flex gap-2">
              {template.optionalFields.length > 0 && (
                <>
                  {currentSection === 'optional' && (
                    <button
                      onClick={() => setCurrentSection('required')}
                      className="btn btn-outline"
                    >
                      Previous: Required Fields
                    </button>
                  )}
                  {currentSection === 'required' && (
                    <button
                      onClick={() => setCurrentSection('optional')}
                      className="btn btn-outline"
                    >
                      Next: Optional Fields
                    </button>
                  )}
                </>
              )}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!validateRequiredFields()}
              className="btn btn-primary btn-lg"
            >
              Generate Lesson Plan
            </button>
          </div>
        </div>

        {/* Template Preview */}
        <div className="lg:sticky lg:top-8">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Template Structure</h3>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-600 max-h-96 overflow-y-auto">
              {template.template}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
            <p className="text-sm text-blue-800">
              Fill in the form fields, and AI will replace the placeholders (like {`{{experiment_title}}`}) 
              and generate content for sections marked with [AI_GENERATED_...].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

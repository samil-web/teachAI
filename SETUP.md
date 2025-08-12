# TeachAI Setup Instructions

## Environment Configuration

To use the AI-powered lesson plan generation, you need to set up your Gemini API key:

1. **Get a Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Test the Setup**:
   - Start the development server: `npm run dev`
   - Go to `http://localhost:3000`
   - Click "Start Creating Lesson Plans"
   - Complete the question wizard
   - Verify that lesson plans are generated successfully

## Features Implemented

### ✅ Core Framework
- **Landing Page**: Simple TeachAI introduction
- **Question Wizard**: Step-by-step teacher input collection
- **Lesson Plan Generation**: AI-powered content creation
- **Results Display**: Professional lesson plan presentation

### ✅ Question Categories
**Required Questions (Must Answer):**
1. Subject/Topic
2. Grade Level (1-11 dropdown)
3. Lesson Duration
4. Learning Objective
5. Assessment Method

**Optional Questions (Can Skip):**
6. Number of Students
7. Prior Knowledge Level
8. Learning Preferences
9. Available Materials
10. Special Accommodations

### ✅ User Experience
- **Progressive Flow**: One question per screen
- **Progress Tracking**: Visual completion indicator
- **Skip Options**: Optional questions can be skipped
- **Validation**: Required fields enforced
- **Loading States**: Feedback during generation

### ✅ AI Integration
- **Gemini API**: Google's generative AI for lesson plans
- **Prompt Engineering**: Structured prompts for quality output
- **Fallback System**: Template plans if API fails
- **Error Handling**: Graceful failure recovery

### ✅ Export & Sharing
- **Multiple Formats**: PDF, Word, Text export options
- **Print Support**: Print-optimized layout
- **Share Functionality**: Native sharing or clipboard fallback

## File Structure

```
app/
├── page.js                     # Landing page
├── lesson-builder/
│   └── page.js                 # Main lesson builder interface
└── api/
    └── generate-lesson/
        └── route.js            # Gemini API integration

components/
├── QuestionWizard.js           # Step-by-step question flow
└── LessonPlanDisplay.js        # Generated lesson plan display

plan.md                         # Comprehensive development plan
SETUP.md                        # This setup guide
```

## Usage Flow

1. **Start**: User clicks "Start Creating Lesson Plans" on homepage
2. **Questions**: Complete 5 required questions, optionally answer 5 more
3. **Review**: Option to generate immediately or answer optional questions
4. **Generate**: AI creates personalized lesson plan using Gemini
5. **Display**: Professional lesson plan with export/share options
6. **Actions**: Print, export, edit, or create another lesson

## Next Steps for Enhancement

- [ ] User authentication and saved lesson plans
- [ ] Lesson plan editing and customization
- [ ] Template library and reusable components
- [ ] Integration with Google Classroom/Canvas
- [ ] Advanced differentiation options
- [ ] Curriculum standards alignment
- [ ] Collaborative features for teaching teams

## Troubleshooting

**API Key Issues:**
- Ensure `.env.local` file is in the root directory
- Verify the API key is correct and has proper permissions
- Check that the key is not exposed in client-side code

**Generation Failures:**
- The system provides fallback template lesson plans
- Check browser console for detailed error messages
- Verify network connectivity and API quotas

**UI Issues:**
- Ensure all dependencies are installed: `npm install`
- Clear browser cache and restart development server
- Check for console errors in browser developer tools

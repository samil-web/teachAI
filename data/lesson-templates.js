export const LESSON_TEMPLATES = {
  // Science Lab Template
  science_lab: {
    id: 'science_lab',
    name: 'Science Lab Experiment',
    description: 'Structured template for hands-on science experiments',
    category: 'Science',
    duration: [45, 60, 90],
    grades: ['6', '7', '8', '9', '10', '11'],
    requiredFields: [
      {
        id: 'experiment_title',
        label: 'Experiment Title',
        type: 'text',
        placeholder: 'e.g., Chemical Reactions with Acids and Bases'
      },
      {
        id: 'scientific_concept',
        label: 'Main Scientific Concept',
        type: 'text',
        placeholder: 'e.g., pH levels, chemical reactions'
      },
      {
        id: 'hypothesis',
        label: 'Expected Hypothesis',
        type: 'textarea',
        placeholder: 'What should students predict?'
      },
      {
        id: 'materials_list',
        label: 'Required Materials',
        type: 'textarea',
        placeholder: 'List all materials needed for the experiment'
      }
    ],
    optionalFields: [
      {
        id: 'safety_concerns',
        label: 'Safety Considerations',
        type: 'textarea',
        placeholder: 'Any safety precautions to highlight'
      },
      {
        id: 'extension_activities',
        label: 'Extension Activities',
        type: 'textarea',
        placeholder: 'Additional activities for advanced students'
      }
    ],
    template: `# {{experiment_title}} - Grade {{grade}}

## Lesson Overview
**Duration:** {{duration}} minutes
**Scientific Concept:** {{scientific_concept}}
**Grade Level:** {{grade}}

## Learning Objectives
Students will be able to:
- [AI_GENERATED_OBJECTIVES]

## Materials Needed
{{materials_list}}

## Safety Considerations
{{safety_concerns}}

## Lesson Structure

### Opening (10 minutes)
- [AI_GENERATED_HOOK]
- Review safety procedures
- Introduce the scientific concept: {{scientific_concept}}

### Hypothesis Formation (10 minutes)
- Guide students to form hypothesis: {{hypothesis}}
- [AI_GENERATED_HYPOTHESIS_ACTIVITY]

### Experiment Procedure ({{main_activity_time}} minutes)
[AI_GENERATED_STEP_BY_STEP_PROCEDURE]

### Data Collection & Analysis (15 minutes)
[AI_GENERATED_DATA_COLLECTION_METHODS]

### Conclusion & Discussion (10 minutes)
[AI_GENERATED_CONCLUSION_QUESTIONS]

## Assessment
[AI_GENERATED_ASSESSMENT_RUBRIC]

## Extension Activities
{{extension_activities}}

## Homework/Follow-up
[AI_GENERATED_HOMEWORK_SUGGESTIONS]`
  },

  // Math Problem Solving Template
  math_problem_solving: {
    id: 'math_problem_solving',
    name: 'Math Problem Solving',
    description: 'Structured approach to teaching mathematical concepts through problem solving',
    category: 'Mathematics',
    duration: [45, 60],
    grades: ['3', '4', '5', '6', '7', '8', '9', '10', '11'],
    requiredFields: [
      {
        id: 'math_topic',
        label: 'Mathematical Topic',
        type: 'text',
        placeholder: 'e.g., Quadratic Equations, Fractions, Geometry'
      },
      {
        id: 'key_concept',
        label: 'Key Mathematical Concept',
        type: 'text',
        placeholder: 'e.g., Solving for x, Finding area, Factoring'
      },
      {
        id: 'real_world_context',
        label: 'Real-World Application',
        type: 'textarea',
        placeholder: 'How is this math used in real life?'
      }
    ],
    optionalFields: [
      {
        id: 'prerequisite_skills',
        label: 'Prerequisite Skills',
        type: 'textarea',
        placeholder: 'What should students already know?'
      },
      {
        id: 'common_mistakes',
        label: 'Common Student Mistakes',
        type: 'textarea',
        placeholder: 'What errors do students typically make?'
      }
    ],
    template: `# {{math_topic}} Problem Solving - Grade {{grade}}

## Lesson Overview
**Duration:** {{duration}} minutes
**Topic:** {{math_topic}}
**Key Concept:** {{key_concept}}

## Learning Objectives
Students will be able to:
- [AI_GENERATED_MATH_OBJECTIVES]

## Prerequisites
{{prerequisite_skills}}

## Lesson Structure

### Warm-Up (10 minutes)
[AI_GENERATED_REVIEW_PROBLEMS]

### Concept Introduction (15 minutes)
- Introduce {{key_concept}}
- Real-world connection: {{real_world_context}}
- [AI_GENERATED_CONCEPT_EXPLANATION]

### Guided Practice (15 minutes)
[AI_GENERATED_WORKED_EXAMPLES]

### Independent Practice ({{independent_time}} minutes)
[AI_GENERATED_PRACTICE_PROBLEMS]

### Wrap-Up & Assessment (5 minutes)
[AI_GENERATED_EXIT_TICKET]

## Common Mistakes to Address
{{common_mistakes}}

## Differentiation
[AI_GENERATED_DIFFERENTIATION_STRATEGIES]

## Assessment Rubric
[AI_GENERATED_MATH_RUBRIC]`
  },

  // Literature Discussion Template
  literature_discussion: {
    id: 'literature_discussion',
    name: 'Literature Discussion',
    description: 'Engaging template for analyzing literature and fostering discussion',
    category: 'English/Language Arts',
    duration: [45, 60],
    grades: ['6', '7', '8', '9', '10', '11'],
    requiredFields: [
      {
        id: 'literary_work',
        label: 'Literary Work',
        type: 'text',
        placeholder: 'e.g., To Kill a Mockingbird, Romeo and Juliet'
      },
      {
        id: 'focus_theme',
        label: 'Focus Theme/Element',
        type: 'text',
        placeholder: 'e.g., Character development, Symbolism, Historical context'
      },
      {
        id: 'discussion_questions',
        label: 'Key Discussion Questions',
        type: 'textarea',
        placeholder: 'List 3-5 thought-provoking questions'
      }
    ],
    optionalFields: [
      {
        id: 'background_context',
        label: 'Historical/Cultural Context',
        type: 'textarea',
        placeholder: 'Important background information'
      },
      {
        id: 'vocabulary_words',
        label: 'Key Vocabulary',
        type: 'textarea',
        placeholder: 'Important terms to pre-teach'
      }
    ],
    template: `# {{literary_work}} Discussion - Grade {{grade}}

## Lesson Overview
**Duration:** {{duration}} minutes
**Literary Work:** {{literary_work}}
**Focus:** {{focus_theme}}

## Learning Objectives
Students will be able to:
- [AI_GENERATED_LITERATURE_OBJECTIVES]

## Background Context
{{background_context}}

## Key Vocabulary
{{vocabulary_words}}

## Lesson Structure

### Opening (10 minutes)
[AI_GENERATED_ENGAGEMENT_ACTIVITY]

### Text Review (10 minutes)
[AI_GENERATED_SUMMARY_ACTIVITY]

### Focused Discussion (20 minutes)
Discussion Questions:
{{discussion_questions}}

[AI_GENERATED_DISCUSSION_FACILITATION_GUIDE]

### Analysis Activity ({{analysis_time}} minutes)
[AI_GENERATED_ANALYSIS_TASK]

### Closing Reflection (5 minutes)
[AI_GENERATED_REFLECTION_PROMPT]

## Assessment
[AI_GENERATED_DISCUSSION_RUBRIC]

## Extension Activities
[AI_GENERATED_CREATIVE_EXTENSIONS]`
  },

  // Project-Based Learning Template
  project_based: {
    id: 'project_based',
    name: 'Project-Based Learning',
    description: 'Multi-day project template with milestones and assessments',
    category: 'Cross-Curricular',
    duration: [60, 90, 120],
    grades: ['4', '5', '6', '7', '8', '9', '10', '11'],
    requiredFields: [
      {
        id: 'project_title',
        label: 'Project Title',
        type: 'text',
        placeholder: 'e.g., Design a Sustainable City, Create a Historical Museum'
      },
      {
        id: 'driving_question',
        label: 'Driving Question',
        type: 'textarea',
        placeholder: 'The essential question that guides the entire project'
      },
      {
        id: 'final_product',
        label: 'Final Product/Deliverable',
        type: 'text',
        placeholder: 'e.g., Presentation, Model, Website, Report'
      },
      {
        id: 'project_duration',
        label: 'Project Duration',
        type: 'select',
        options: [
          { value: '1_week', label: '1 Week' },
          { value: '2_weeks', label: '2 Weeks' },
          { value: '3_weeks', label: '3 Weeks' },
          { value: '1_month', label: '1 Month' }
        ]
      }
    ],
    optionalFields: [
      {
        id: 'collaboration_structure',
        label: 'Group Structure',
        type: 'select',
        options: [
          { value: 'individual', label: 'Individual Work' },
          { value: 'pairs', label: 'Pairs' },
          { value: 'small_groups', label: 'Small Groups (3-4)' },
          { value: 'large_groups', label: 'Large Groups (5-6)' }
        ]
      },
      {
        id: 'technology_tools',
        label: 'Technology Tools',
        type: 'textarea',
        placeholder: 'What technology will students use?'
      }
    ],
    template: `# {{project_title}} - Grade {{grade}}

## Project Overview
**Duration:** {{project_duration}}
**Final Product:** {{final_product}}
**Collaboration:** {{collaboration_structure}}

## Driving Question
{{driving_question}}

## Learning Objectives
Students will be able to:
- [AI_GENERATED_PROJECT_OBJECTIVES]

## Project Phases

### Phase 1: Research & Planning (Days 1-3)
[AI_GENERATED_RESEARCH_ACTIVITIES]

### Phase 2: Development & Creation (Days 4-7)
[AI_GENERATED_CREATION_ACTIVITIES]

### Phase 3: Refinement & Preparation (Days 8-9)
[AI_GENERATED_REFINEMENT_ACTIVITIES]

### Phase 4: Presentation & Reflection (Day 10)
[AI_GENERATED_PRESENTATION_FORMAT]

## Technology Integration
{{technology_tools}}

## Assessment Rubric
[AI_GENERATED_PROJECT_RUBRIC]

## Milestone Checkpoints
[AI_GENERATED_CHECKPOINT_SCHEDULE]

## Resources & Materials
[AI_GENERATED_RESOURCE_LIST]`
  }
};

export const TEMPLATE_CATEGORIES = [
  'All Templates',
  'Science',
  'Mathematics', 
  'English/Language Arts',
  'Social Studies',
  'Cross-Curricular'
];

export function getTemplatesByCategory(category) {
  if (category === 'All Templates') {
    return Object.values(LESSON_TEMPLATES);
  }
  return Object.values(LESSON_TEMPLATES).filter(template => 
    template.category === category
  );
}

export function getTemplateById(id) {
  return LESSON_TEMPLATES[id];
}

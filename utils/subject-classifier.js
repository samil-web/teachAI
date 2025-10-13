// Subject classification and learning approach utilities

export const SUBJECT_TYPES = {
  TECHNICAL: 'technical',
  HUMANITARIAN: 'humanitarian'
};

export const TECHNICAL_SUBJECTS = [
  'mathematics', 'math', 'algebra', 'geometry', 'calculus', 'statistics',
  'physics', 'chemistry', 'biology', 'science',
  'computer science', 'programming', 'coding', 'engineering',
  'economics', 'finance', 'accounting'
];

export const HUMANITARIAN_SUBJECTS = [
  'history', 'literature', 'english', 'language arts', 'reading',
  'social studies', 'geography', 'civics', 'government',
  'philosophy', 'psychology', 'sociology', 'anthropology',
  'art', 'music', 'drama', 'theater', 'creative writing',
  'foreign language', 'spanish', 'french', 'german', 'chinese'
];

/**
 * Classifies a subject as technical or humanitarian
 * @param {string} subject - The subject name
 * @returns {string} - 'technical' or 'humanitarian'
 */
export function classifySubject(subject) {
  const normalizedSubject = subject.toLowerCase().trim();
  
  // Check for exact matches first
  if (TECHNICAL_SUBJECTS.includes(normalizedSubject)) {
    return SUBJECT_TYPES.TECHNICAL;
  }
  
  if (HUMANITARIAN_SUBJECTS.includes(normalizedSubject)) {
    return SUBJECT_TYPES.HUMANITARIAN;
  }
  
  // Check for partial matches
  const isTechnical = TECHNICAL_SUBJECTS.some(tech => 
    normalizedSubject.includes(tech) || tech.includes(normalizedSubject)
  );
  
  if (isTechnical) {
    return SUBJECT_TYPES.TECHNICAL;
  }
  
  const isHumanitarian = HUMANITARIAN_SUBJECTS.some(human => 
    normalizedSubject.includes(human) || human.includes(normalizedSubject)
  );
  
  if (isHumanitarian) {
    return SUBJECT_TYPES.HUMANITARIAN;
  }
  
  // Default to humanitarian for unknown subjects
  return SUBJECT_TYPES.HUMANITARIAN;
}

/**
 * Gets interactive components for technical subjects
 * @param {string} subject - The subject name
 * @param {string} topic - The specific topic being taught
 * @returns {Array} - Array of interactive component suggestions
 */
export function getTechnicalInteractives(subject, topic) {
  const normalizedSubject = subject.toLowerCase();
  const normalizedTopic = topic.toLowerCase();
  
  const interactives = [];
  
  // Math-specific interactives
  if (normalizedSubject.includes('math') || normalizedSubject.includes('algebra') || normalizedSubject.includes('calculus')) {
    if (normalizedTopic.includes('derivative') || normalizedTopic.includes('slope')) {
      interactives.push({
        type: 'graph_manipulator',
        title: 'Interactive Derivative Explorer',
        description: 'Drag points on a function to see how derivatives change in real-time',
        tools: ['function_grapher', 'slope_calculator', 'tangent_line_drawer']
      });
    }
    
    if (normalizedTopic.includes('fraction') || normalizedTopic.includes('ratio')) {
      interactives.push({
        type: 'fraction_bars',
        title: 'Visual Fraction Manipulator',
        description: 'Interactive fraction bars to visualize addition, subtraction, and equivalence',
        tools: ['fraction_builder', 'equivalent_finder', 'operation_visualizer']
      });
    }
    
    if (normalizedTopic.includes('geometry') || normalizedTopic.includes('shape')) {
      interactives.push({
        type: 'geometry_builder',
        title: 'Dynamic Geometry Playground',
        description: 'Build and manipulate geometric shapes to explore properties',
        tools: ['shape_builder', 'angle_measurer', 'area_calculator']
      });
    }
  }
  
  // Physics-specific interactives
  if (normalizedSubject.includes('physics')) {
    if (normalizedTopic.includes('motion') || normalizedTopic.includes('velocity')) {
      interactives.push({
        type: 'motion_simulator',
        title: 'Physics Motion Lab',
        description: 'Adjust velocity and acceleration to see motion graphs update in real-time',
        tools: ['velocity_adjuster', 'acceleration_slider', 'position_tracker']
      });
    }
    
    if (normalizedTopic.includes('wave') || normalizedTopic.includes('frequency')) {
      interactives.push({
        type: 'wave_generator',
        title: 'Wave Properties Explorer',
        description: 'Modify frequency and amplitude to observe wave behavior',
        tools: ['frequency_slider', 'amplitude_control', 'wave_visualizer']
      });
    }
  }
  
  // Chemistry-specific interactives
  if (normalizedSubject.includes('chemistry')) {
    if (normalizedTopic.includes('molecule') || normalizedTopic.includes('bond')) {
      interactives.push({
        type: 'molecule_builder',
        title: '3D Molecular Constructor',
        description: 'Build molecules and observe how bond angles affect properties',
        tools: ['atom_selector', 'bond_creator', 'property_analyzer']
      });
    }
    
    if (normalizedTopic.includes('reaction') || normalizedTopic.includes('equation')) {
      interactives.push({
        type: 'reaction_simulator',
        title: 'Chemical Reaction Balancer',
        description: 'Balance equations and see particle interactions in real-time',
        tools: ['equation_balancer', 'particle_animator', 'energy_tracker']
      });
    }
  }
  
  // Default technical interactives
  if (interactives.length === 0) {
    interactives.push({
      type: 'data_explorer',
      title: 'Interactive Data Playground',
      description: 'Manipulate variables and observe how outputs change',
      tools: ['variable_sliders', 'graph_updater', 'pattern_finder']
    });
  }
  
  return interactives;
}

/**
 * Gets story-based learning elements for humanitarian subjects
 * @param {string} subject - The subject name
 * @param {string} topic - The specific topic being taught
 * @returns {Object} - Story-based learning suggestions
 */
export function getHumanitarianNarratives(subject, topic) {
  const normalizedSubject = subject.toLowerCase();
  const normalizedTopic = topic.toLowerCase();
  
  const narratives = {
    storyElements: [],
    engagementStrategies: [],
    rolePlayScenarios: []
  };
  
  // History-specific narratives
  if (normalizedSubject.includes('history')) {
    narratives.storyElements.push({
      type: 'historical_narrative',
      title: 'Time Travel Adventure',
      description: 'Students become time travelers witnessing historical events firsthand'
    });
    
    narratives.rolePlayScenarios.push({
      type: 'historical_figures',
      title: 'Historical Character Debates',
      description: 'Students embody historical figures and debate from their perspectives'
    });
  }
  
  // Literature-specific narratives
  if (normalizedSubject.includes('literature') || normalizedSubject.includes('english')) {
    narratives.storyElements.push({
      type: 'character_journey',
      title: 'Character Development Detective',
      description: 'Students track character growth through interactive story mapping'
    });
    
    narratives.engagementStrategies.push({
      type: 'creative_adaptation',
      title: 'Modern Story Retelling',
      description: 'Adapt classic stories to modern settings and social media formats'
    });
  }
  
  // Social Studies narratives
  if (normalizedSubject.includes('social') || normalizedSubject.includes('civics')) {
    narratives.storyElements.push({
      type: 'community_stories',
      title: 'Local Community Chronicles',
      description: 'Explore how historical events affected their own community'
    });
    
    narratives.rolePlayScenarios.push({
      type: 'government_simulation',
      title: 'Student Government Simulation',
      description: 'Create and run their own classroom government system'
    });
  }
  
  // Default humanitarian strategies
  if (narratives.storyElements.length === 0) {
    narratives.storyElements.push({
      type: 'personal_connection',
      title: 'Personal Story Connections',
      description: 'Connect lesson content to students\' own experiences and stories'
    });
    
    narratives.engagementStrategies.push({
      type: 'collaborative_storytelling',
      title: 'Group Story Building',
      description: 'Students collaboratively build stories that incorporate lesson concepts'
    });
  }
  
  return narratives;
}

/**
 * Gets assessment strategies based on subject type
 * @param {string} subjectType - 'technical' or 'humanitarian'
 * @returns {Array} - Array of appropriate assessment methods
 */
export function getSubjectSpecificAssessments(subjectType) {
  if (subjectType === SUBJECT_TYPES.TECHNICAL) {
    return [
      'Interactive Problem Solving',
      'Hands-on Experimentation',
      'Visual Demonstration',
      'Peer Teaching with Manipulatives',
      'Real-time Data Analysis',
      'Simulation-based Testing'
    ];
  } else {
    return [
      'Storytelling Assessment',
      'Role-play Evaluation',
      'Creative Project Presentation',
      'Collaborative Discussion',
      'Narrative Writing',
      'Peer Interview and Reflection'
    ];
  }
}

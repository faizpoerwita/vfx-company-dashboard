export const ROLES = {
  THREE_D_ARTIST: '3D Artist',
  ANIMATOR: 'Animator',
  COMPOSITOR: 'Compositor',
  VFX_SUPERVISOR: 'VFX Supervisor',
  PRODUCER: 'Producer',
} as const;

export const roleDescriptions = {
  [ROLES.THREE_D_ARTIST]: 'Modeling, texturing, dan lighting',
  [ROLES.ANIMATOR]: 'Character dan environment animation',
  [ROLES.COMPOSITOR]: 'Visual effects dan compositing',
  [ROLES.VFX_SUPERVISOR]: 'Creative direction dan supervision',
  [ROLES.PRODUCER]: 'Project management dan client relations',
} as const;

export const skillCategories = {
  [ROLES.PRODUCER]: [
    'Project Management',
    'Client Communication',
    'Resource Planning',
    'Budget Management',
    'Team Leadership',
    'Risk Management',
    'Quality Control',
    'Pipeline Management'
  ],
  [ROLES.THREE_D_ARTIST]: [
    'Modeling',
    'Texturing',
    'Lighting',
    'Rigging',
    'UV Mapping',
    'Shading',
    'Rendering',
    'Sculpting'
  ],
  [ROLES.ANIMATOR]: [
    'Character Animation',
    'Motion Capture',
    'Facial Animation',
    'Creature Animation',
    'Physics Simulation',
    'Timing and Spacing',
    'Action Sequences',
    'Body Mechanics'
  ],
  [ROLES.COMPOSITOR]: [
    'Compositing',
    'Rotoscoping',
    'Color Grading',
    'Keying',
    'Tracking',
    'Paint and Cleanup',
    'Integration',
    'Lighting Effects'
  ],
  [ROLES.VFX_SUPERVISOR]: [
    'Technical Direction',
    'Shot Design',
    'Team Management',
    'Client Relations',
    'Creative Direction',
    'Quality Assurance',
    'Pipeline Oversight',
    'Problem Solving'
  ]
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

// For use in forms and dropdowns
export const roles = Object.entries(ROLES).map(([key, value]) => ({
  id: value,
  label: value,
  description: roleDescriptions[value as RoleType],
  skills: skillCategories[value as RoleType]
}));

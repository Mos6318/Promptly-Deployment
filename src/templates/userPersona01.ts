import type { Template } from './types';

export const userPersona01: Template = {
    id: 'user-persona-01',
    name: 'User Persona 01: Research Findings',
    technique: 'TACO',
    description: 'Analyze anonymized user interview notes to identify patterns and synthesize them into key themes for a user persona.',
    sections: {
        'task': 'Analyze the following anonymized user interview notes to identify patterns and synthesize them into key themes for a user persona.',
        'actor': 'Act as a qualitative research analyst.',
        'context': `Product: 'SproutingBean', a mobile app for amateur gardeners.
Research Goal: To understand the challenges and motivations of novice gardeners.

Attached Data:
- User 1 (P1) said: "I forget when I last watered my plants. I wish I had a simple log."
- User 2 (P2) mentioned: "I bought a plant from a store but have no idea how much sun it needs. I'm scared I'll kill it."
- P1 also said: "I don't have a lot of space, so I need to know which plants will be happy on my windowsill."
- User 3 (P3) stated: "It feels like a real achievement when a new leaf grows."
- P2 is worried about "what soil to use" and "how to know if it's healthy."`,
        'output': `The output is for a UX design team that needs to understand the core attributes of a primary user segment. Based ONLY on the data provided, generate a bulleted list summarizing the following:
- Primary Goals: What are these users trying to achieve?
- Key Pain Points/Frustrations: What obstacles are they facing?
- Core Motivations: What is the emotional or practical driver behind their behavior?
- Observed Behaviors: What are they currently doing?`
    }
};

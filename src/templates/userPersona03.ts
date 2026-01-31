import type { Template } from './types';

export const userPersona03: Template = {
    id: 'user-persona-03',
    name: 'User Persona 03: Quality Check',
    technique: 'Custom',
    description: 'Validate the persona against research data, audit for bias, and generate empathy scenarios.',
    sections: {
        'grounding': 'Ensure it\'s not a work of fiction: For the persona you just created, map each goal, frustration, and motivation back to the specific user quotes or behaviors from the initial data I provided.',
        'biasAudit': 'Run a bias/stereotype audit: Review the persona of \'Alex the Anxious Gardener\'. Does any part of it rely on common demographic or social stereotypes? If so, identify the problematic text and suggest an alternative that is more focused on behaviors and motivations revealed in my research data.',
        'scenarios': 'Generate scenarios for empathy: Write a brief \'day in the life\' scenario for Alex, focusing on a moment when they struggle with their gardening hobby and wish for a solution.'
    }
};

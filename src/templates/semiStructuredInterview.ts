import type { Template } from './types';

export const semiStructuredInterview: Template = {
    id: 'semi-structured-interview',
    name: 'Semi-structured Interview',
    technique: 'TACO',
    description: 'Create a semi-structured interview guide for a 45-minute user interview session with timings and probing questions.',
    sections: {
        'task': 'Create a semi-structured interview guide for a 45-minute user interview session.',
        'actor': 'Act as a senior UX researcher. This guide will be used to moderate an interview. It should include timings, introductory remarks, and probing questions.',
        'context': `Product: 'FitTrack', a new mobile app designed to help users create and stick to custom workout plans.

Research Goals:
1. Understand user’s current fitness habits and routines.
2. Identify the biggest challenges he faces when trying to stay consistent with exercise.
3. Uncover his/her process for finding and planning workouts.`,
        'output': `A structured interview guide in markdown.
- Introduction (rapport-building, instructions, consent).
- Section 1: Warm-up & Current Habits (5-10 mins).
- Section 2: Deep Dive on Planning & Motivation (15-20 mins).
- Section 3: Exploring Solutions & Tools (10-15 mins).
- Conclusion (wrap-up, thank you, next steps).
For each section, provide 4-5 open-ended primary questions and suggest 2-3 potential follow-up questions for each.`
    }
};

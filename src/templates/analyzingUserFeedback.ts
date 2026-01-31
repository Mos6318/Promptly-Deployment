import type { Template } from './types';

export const analyzingUserFeedback: Template = {
    id: 'analyzing-user-feedback',
    name: 'Analyzing User Feedback',
    technique: 'Chain of Thought',
    description: 'Prioritize new updates by categorizing user feedback, assessing severity, and determining impact on user experience.',
    sections: {
        'actor': 'You are a product manager analyzing user feedback to prioritize a new update.',
        'instruction': `Let's think step by step.

1. First, categorize each piece of feedback as a bug, a feature request, or a design issue.
2. Second, assess the severity of each item (e.g., Critical, High, Low).
3. Third, based on the severity, determine which issue has the highest impact on the user experience.

Finally, recommend which item to prioritize.`,
        'data': `• User A: "The app crashes every time I try to save an image."
• User B: "I wish I could share my photos to Instagram directly."
• User C: "The app's design is a bit dated."`
    }
};

import type { Template } from './types';

export const workshopInsights: Template = {
    id: 'workshop-insights',
    name: 'Workshop Insights Summary',
    technique: 'TACO',
    description: 'Condense brainstorming sticky notes and clustered ideas into a clear summary capturing themes, insights, and next steps.',
    sections: {
        'task': 'Condense brainstorming sticky notes and clustered ideas from a UX workshop into a clear summary document capturing main themes, key insights, and next steps.',
        'actor': 'You are a UX workshop facilitator and storyteller. Your role is to synthesize the attached ideation outputs into a structured summary that can be shared with stakeholders.',
        'context': `[Input raw brainstorming ideas (sticky notes) and/or clustered themes].
- Workshop participants: [insert participants information, e.g., students, staff, mixed roles]
- Purpose: Capture outcomes, insights, and action steps so the session results are useful beyond the wall of post-its.`,
        'output': `Produce a structured workshop summary with the following sections:

1. Workshop Overview
[Date, participants, design challenge, goals,…]

2. Process Recap
[Brief description of activities (e.g., brainstorming, clustering)].

3. Key Themes & Insights
List each cluster/theme with:
- Theme title
- A short summary sentence (what we learned / why it matters)
- A few representative sticky-note ideas (keep original wording).

4. Emerging Opportunities
Highlight 3–5 opportunity areas or design directions.

5. Next Steps
Concrete follow-up actions (e.g., for prototyping, user testing, further research).`
    }
};

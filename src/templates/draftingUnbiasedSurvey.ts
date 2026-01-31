import type { Template } from './types';

export const draftingUnbiasedSurvey: Template = {
    id: 'drafting-unbiased-survey',
    name: 'Drafting Unbiased Survey Items',
    technique: 'TACO',
    description: 'Draft unbiased survey items measuring task success, perceived effort, trust, and error recovery for a mobile banking login flow.',
    sections: {
        'task': 'Draft 12 survey questions that measure (a) task success, (b) perceived effort, (c) trust, (d) error recovery for a new mobile banking login flow. Use item-specific wording (no agree/disagree).',
        'audience': 'General adult users, varied digital literacy, mobile-first.',
        'context': 'Keep language CEFR B1; avoid leading/loaded words; one construct per item; include 3 behavioral questions and 3 open-ends; total length ≤7 minutes.',
        'output': 'Return a markdown table with columns [Goal | Question | Response Type | Scale/Options | Notes], using 5-point labeled scales where applicable with balanced endpoints.'
    }
};

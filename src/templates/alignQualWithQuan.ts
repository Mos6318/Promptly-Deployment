import type { Template } from './types';

export const alignQualWithQuan: Template = {
    id: 'align-qual-with-quan',
    name: 'Align Qual with Quan Indicators',
    technique: 'TACO',
    description: 'Create a joint display aligning qualitative themes with quantitative indicators for a cross-functional readout.',
    sections: {
        'task': 'Create a joint display aligning qualitative themes with quantitative indicators.',
        'actor': 'You are an expert UX researcher experienced in mixed methods (qualitative and quantitative data analysis). You are preparing for a cross-functional readout.',
        'context': 'For each theme, map the best available metric, show directionality, and note gaps.',
        'output': `Table [Theme | Key Quote IDs | Related Metric(s) | Signal (↑/↓/no change) | Interpretation | Gaps/Next Data].

Inputs:
[PASTE THEMES + AVAILABLE METRICS]`
    }
};

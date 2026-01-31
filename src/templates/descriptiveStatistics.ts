import type { Template } from './types';

export const descriptiveStatistics: Template = {
    id: 'descriptive-statistics',
    name: 'Descriptive Statistics',
    technique: 'TACO',
    description: 'Perform an exploratory data analysis on a CSV file to understand key takeaways, including descriptive statistics and visualizations.',
    sections: {
        'task': 'I have uploaded a CSV file named \'survey_results.csv\'. Perform an exploratory data analysis to help me understand the key takeaways.',
        'actor': 'Act as a data analyst supporting a UX researcher looking for initial findings to guide a deeper investigation.',
        'context': `The file 'survey_results.csv' contains results from a recent user satisfaction survey.

Key columns include:
- \`nps_score\`: A score from 0-10.
- \`ease_of_use\`: A 5-point Likert scale (1=Very Difficult, 5=Very Easy).
- \`primary_device\`: A categorical variable (e.g., 'iOS', 'Android', 'Web').`,
        'output': `Provide key descriptive statistics for the numerical columns (mean, median, standard deviation for \`nps_score\` and \`ease_of_use\`).
- Create and display a histogram showing the distribution of the \`nps_score\`.
- Create and display a bar chart showing the breakdown of users by \`primary_device\`.
- Identify any interesting patterns or correlations you find in the data.`
    }
};

// Prompt Engineering Techniques Definitions

export interface PromptSection {
    key: string;
    label: string;
    description: string;
    required: boolean;
    placeholder?: string;
}

export interface PromptTechnique {
    id: string;
    name: string;
    description: string;
    recommendation: string;
    sections: PromptSection[];
}

export const PROMPT_TECHNIQUES: Record<string, PromptTechnique> = {
    taco: {
        id: 'taco',
        name: 'TACO',
        description: 'Task, Actor, Context, Output - Best for clear, structured tasks',
        recommendation: 'Great for straightforward tasks with clear inputs and outputs',
        sections: [
            {
                key: 'task',
                label: 'Task',
                description: 'What needs to be accomplished',
                required: true,
                placeholder: 'Describe the main task...'
            },
            {
                key: 'actor',
                label: 'Actor',
                description: 'Who or what is performing the task',
                required: false,
                placeholder: 'You are a...'
            },
            {
                key: 'context',
                label: 'Context',
                description: 'Background information and constraints',
                required: false,
                placeholder: 'Additional context...'
            },
            {
                key: 'output',
                label: 'Output',
                description: 'Expected format and structure of the result',
                required: true,
                placeholder: 'The output should be...'
            }
        ]
    },

    risen: {
        id: 'risen',
        name: 'RISEN',
        description: 'Role, Instructions, Steps, End goal, Narrowing - Best for complex workflows',
        recommendation: 'Ideal for multi-step processes requiring detailed guidance',
        sections: [
            {
                key: 'role',
                label: 'Role',
                description: 'Identity and perspective to adopt',
                required: true,
                placeholder: 'You are a...'
            },
            {
                key: 'instructions',
                label: 'Instructions',
                description: 'What to do',
                required: true,
                placeholder: 'Your task is to...'
            },
            {
                key: 'steps',
                label: 'Steps',
                description: 'How to accomplish the task',
                required: true,
                placeholder: 'First... Second... Third...'
            },
            {
                key: 'endGoal',
                label: 'End Goal',
                description: 'Success criteria and desired outcome',
                required: true,
                placeholder: 'The final result should...'
            },
            {
                key: 'narrowing',
                label: 'Narrowing',
                description: 'Constraints, focus areas, and boundaries',
                required: false,
                placeholder: 'Focus specifically on...'
            }
        ]
    },

    chainOfThought: {
        id: 'chainOfThought',
        name: 'Chain of Thought',
        description: 'Systematic step-by-step reasoning - Best for analytical tasks',
        recommendation: 'Perfect for tasks requiring logical reasoning and decision-making',
        sections: [
            {
                key: 'task',
                label: 'Task',
                description: 'The main objective',
                required: true,
                placeholder: 'You are analyzing...'
            },
            {
                key: 'steps',
                label: 'Reasoning Steps',
                description: 'The step-by-step thought process',
                required: true,
                placeholder: 'First... Second... Third... Finally...'
            },
            {
                key: 'triggerPhrase',
                label: 'Trigger Phrase',
                description: 'Phrase to activate systematic thinking',
                required: false,
                placeholder: "Let's think step by step"
            },
            {
                key: 'examples',
                label: 'Examples',
                description: 'Sample inputs to demonstrate the process',
                required: false,
                placeholder: 'Example inputs...'
            }
        ]
    },

    multipleOutputs: {
        id: 'multipleOutputs',
        name: 'Multiple Outputs & Self-Consistency',
        description: 'Generate multiple variations and select the best',
        recommendation: 'Useful when you want diverse perspectives or options',
        sections: [
            {
                key: 'task',
                label: 'Task',
                description: 'What to generate',
                required: true,
                placeholder: 'Generate...'
            },
            {
                key: 'numberOfOutputs',
                label: 'Number of Outputs',
                description: 'How many variations to create',
                required: true,
                placeholder: '3'
            },
            {
                key: 'selectionCriteria',
                label: 'Selection Criteria',
                description: 'How to evaluate and choose the best option',
                required: false,
                placeholder: 'Select based on...'
            }
        ]
    },

    treeOfThought: {
        id: 'treeOfThought',
        name: 'Tree of Thought',
        description: 'Explore multiple reasoning paths systematically',
        recommendation: 'Best for complex problems with multiple solution approaches',
        sections: [
            {
                key: 'task',
                label: 'Task',
                description: 'The problem to solve',
                required: true,
                placeholder: 'Solve...'
            },
            {
                key: 'explorationPaths',
                label: 'Exploration Paths',
                description: 'Different approaches to consider',
                required: true,
                placeholder: 'Path 1:... Path 2:... Path 3:...'
            },
            {
                key: 'evaluation',
                label: 'Evaluation',
                description: 'How to assess each path',
                required: true,
                placeholder: 'Evaluate each path based on...'
            }
        ]
    },

    systemPrompting: {
        id: 'systemPrompting',
        name: 'System Prompting',
        description: 'Define system-level behavior and constraints',
        recommendation: 'Great for setting consistent AI behavior across interactions',
        sections: [
            {
                key: 'systemRole',
                label: 'System Role',
                description: 'Overall behavior and personality',
                required: true,
                placeholder: 'You are an AI assistant that...'
            },
            {
                key: 'userInstructions',
                label: 'User Instructions',
                description: 'Specific task for the user',
                required: true,
                placeholder: 'Help the user with...'
            },
            {
                key: 'constraints',
                label: 'Constraints',
                description: 'Rules and limitations',
                required: false,
                placeholder: 'Always... Never...'
            }
        ]
    },

    custom: {
        id: 'custom',
        name: 'Custom Prompt',
        description: 'Build your own structure',
        recommendation: 'For unique use cases that don\'t fit standard techniques',
        sections: [
            {
                key: 'freeform',
                label: 'Prompt Content',
                description: 'Your custom prompt structure',
                required: true,
                placeholder: 'Write your prompt...'
            }
        ]
    }
};

export function getTechniqueById(id: string): PromptTechnique | undefined {
    return PROMPT_TECHNIQUES[id];
}

export function getAllTechniques(): PromptTechnique[] {
    return Object.values(PROMPT_TECHNIQUES);
}

export function inferTechniqueFromSections(sections: Record<string, string>, currentTechniqueId: string | null = null): string {
    let techniqueId = currentTechniqueId;
    const allTechniques = getAllTechniques();
    const currentKeys = Object.keys(sections);

    // If no technique ID is provided, try to find the best match
    if (!techniqueId) {
        let bestMatch = null;
        let maxMatchCount = 0;

        for (const tech of allTechniques) {
            if (tech.id === 'custom') continue;

            const techKeys = tech.sections.map(s => s.key);
            const matchCount = currentKeys.filter(k => techKeys.includes(k)).length;

            // require at least 2 matches to be confident, or 1 if it's the only one
            if (matchCount > maxMatchCount && matchCount >= 1) {
                maxMatchCount = matchCount;
                bestMatch = tech.id;
            }
        }

        if (bestMatch) {
            techniqueId = bestMatch;
        } else if (currentKeys.length > 0) {
            techniqueId = 'custom';
        }
    }

    if (!techniqueId) return '';

    // Determine standard name vs "Custom [Name]"
    const techniqueDef = getTechniqueById(techniqueId);
    if (techniqueDef) {
        if (techniqueId === 'custom') return 'Custom Prompt';

        const standardKeys = techniqueDef.sections.map(s => s.key);
        const isCustom = currentKeys.some(key => !standardKeys.includes(key));

        if (isCustom && !techniqueDef.name.startsWith('Custom')) {
            return `Custom ${techniqueDef.name}`;
        }
        return techniqueDef.name;
    }

    // Fallback if ID exists but no definition found (rare)
    return techniqueId;
}

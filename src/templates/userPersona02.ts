import type { Template } from './types';

export const userPersona02: Template = {
    id: 'user-persona-02',
    name: 'User Persona 02: Persona Profile Draft',
    technique: 'TACO',
    description: 'Create a user persona profile based on key themes, ensuring credibility and empathy without inventing unsupported details.',
    sections: {
        'task': 'Create a user persona profile based on the key themes provided below. The persona should be a believable and empathetic representation of the user data. Do not invent details or characteristics that cannot be directly inferred from the provided themes.',
        'actor': 'Act as a UX researcher designing a persona that will be used by our product, design, and engineering teams to guide feature development for the \'SproutingBean\' app.',
        'context': `Key Themes [from previous synthesis]:

Goals:
- Keep their plants alive
- Feel a sense of accomplishment
- Make their living space greener

Pain Points:
- Forgetting care routines (watering)
- Lack of knowledge about specific plant needs (sun, soil)
- Fear of failure/killing plants

Motivations:
- Nurturing something and seeing it grow
- The aesthetic appeal of plants

Behaviors:
- Buys plants impulsively
- Uses Google to search for plant care tips
- Feels overwhelmed by conflicting information`,
        'output': `Create a one-page persona profile in markdown with the following sections:
- Name & Photo: (e.g., "Alex the Anxious Gardener". Suggest a realistic photo: "A person in their late 20s looking thoughtfully at a small potted plant on their apartment balcony.")
- Quote: A short, impactful quote that summarizes their main frustration (e.g., "I just want to keep it alive, but I don't know where to start.")
- Bio: A brief 3-4 sentence narrative describing their situation, based ONLY on the context.
- Goals: (3-4 bullet points)
- Frustrations: (3-4 bullet points)
- Motivations: (2-3 bullet points)`
    }
};

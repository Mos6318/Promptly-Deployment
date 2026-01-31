import type { Template } from './types';

export const rolePlayInterview: Template = {
    id: 'role-play-interview',
    name: 'Role-play Interview',
    technique: 'TACO',
    description: 'Simulate a user interview where the AI acts as a specific persona to practice interview moderation skills.',
    sections: {
        'task': 'Let\'s role-play a user interview. You will act as the user persona, and I will act as the UX researcher. I will start the conversation. Wait for my questions and respond as the persona would. Do not break character unless I say "PAUSE SIMULATION."',
        'audience': 'You are playing a character for me to practice my interview moderation skills.',
        'context': `Your Persona: [Substitute with your Persona You are "Busy Professional Ben." You are 35, work as a marketing manager, and are generally skeptical of fitness apps because you've tried many and they haven't worked for you. You are feeling a bit tired and aren't overly enthusiastic. You want to be healthier but feel frustrated by your lack of time. You often get interrupted by work notifications on your phone. ]`,
        'output': 'Start the simulation by responding with: "Okay, I\'m ready. Let\'s begin." Then, wait for my first question and answer in character.'
    }
};

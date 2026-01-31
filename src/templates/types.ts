export interface Template {
    id: string;
    name: string;
    technique: string;
    description: string;
    sections: Record<string, string>;
}

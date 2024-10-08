
export interface Question {
    question: string;
    options: Option[];
    correct_answer: string;
}


export interface Option {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
}
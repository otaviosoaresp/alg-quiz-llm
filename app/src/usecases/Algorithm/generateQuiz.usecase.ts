import { httpClient } from "@/config/api";
import { Question } from "@/types/question";


export const generateQuizUseCase = async (algorithmId: number): Promise<{ questions: Question[] }> => {
    try {
        return await httpClient.get(`/algorithms/${algorithmId}/generate-quiz`);
    } catch (error) {
        console.error('Error generating quiz:', error);
        throw error;
    }
};
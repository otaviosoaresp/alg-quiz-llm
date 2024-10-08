import { httpClient } from "@/config/api";
import { Question } from "@/types/question";


export const generateQuizUseCase = async (algorithmId: number): Promise<Question[]> => {
    return await httpClient.get<Question[]>(`/algorithms/${algorithmId}/generate-quiz`);
}   
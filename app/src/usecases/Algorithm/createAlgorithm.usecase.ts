import { httpClient } from "@/config/api";
import { Algorithm } from "@/types/algorithm";
import { CreateAlgorithmInput } from '@/hooks/useAlgorithm';

export const createAlgorithmUseCase = async (newAlgorithm: CreateAlgorithmInput): Promise<Algorithm> => {
    try {
        const response = await httpClient.post<Algorithm>('/algorithms', newAlgorithm);
        return response;
    } catch (error) {
        console.error('Error creating algorithm:', error);
        throw error;
    }
};
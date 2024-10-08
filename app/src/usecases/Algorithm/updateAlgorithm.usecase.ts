import { httpClient } from "@/config/api";
import { Algorithm } from "@/types/algorithm";


export const updateAlgorithmUseCase = async (id: number, algorithm: Algorithm): Promise<Algorithm> => {
  try {
    return await httpClient.put<Algorithm>(`/algorithms/${id}`, algorithm);
  } catch (error) {
    console.error('Error updating algorithm:', error);
    throw error;
  }
};
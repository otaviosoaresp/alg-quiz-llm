import { httpClient } from "@/config/api";
import { Algorithm } from "@/types/algorithm";


export const fetchAlgorithmByIdUseCase = async (id: number): Promise<Algorithm> => {
  try {
    return await httpClient.get<Algorithm>(`/algorithms/${id}`);
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    throw error;
  }
};
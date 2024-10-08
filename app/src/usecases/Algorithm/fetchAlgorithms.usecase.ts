import { httpClient } from "@/config/api";


export const fetchAlgorithmsUseCase = async (): Promise<Algorithm[]> => {
  try {
    return await httpClient.get<Algorithm[]>('/algorithms');
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    throw error;
  }
};
import { httpClient } from "@/config/api";


export const deleteAlgorithmUseCase = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(`/algorithms/${id}`);
  } catch (error) {
    console.error('Error deleting algorithm:', error);
    throw error;
  }
    };
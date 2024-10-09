import { httpClient } from "@/config/api";
import { Algorithm } from "@/types/algorithm";

export const createAlgorithmUseCase = async (algorithm: Algorithm): Promise<Algorithm> => {
    return await httpClient.post<Algorithm>('/algorithms', algorithm);
}
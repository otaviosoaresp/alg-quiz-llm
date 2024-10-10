import { useState, useEffect } from 'react';
import { Algorithm } from '@/types/algorithm';
import { Tag } from '@/types/tag';
import { fetchAlgorithmByIdUseCase } from '@/usecases/Algorithm/fetchAlgorithmsById.usecase';
import { updateAlgorithmUseCase } from '@/usecases/Algorithm/updateAlgorithm.usecase';
import { createAlgorithmUseCase } from '@/usecases/Algorithm/createAlgorithm.usecase';

export type CreateAlgorithmInput = Pick<Algorithm, 'name' | 'description' | 'solution_code' | 'tags'>;

export const useAlgorithm = (id?: string) => {
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlgorithm = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const algorithmData = await fetchAlgorithmByIdUseCase(parseInt(id, 10));
        setAlgorithm(algorithmData);
        setError(null);
      } catch (err) {
        setError('Failed to load algorithm. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlgorithm();
  }, [id]);

  const updateAlgorithm = async (updatedAlgorithm: Algorithm) => {
    try {
      await updateAlgorithmUseCase(updatedAlgorithm.id, updatedAlgorithm);
      setAlgorithm(updatedAlgorithm);
    } catch (err) {
      setError('Failed to update algorithm. Please try again.');
    }
  };

  const createAlgorithm = async (newAlgorithm: CreateAlgorithmInput) => {
    try {
      const createdAlgorithm = await createAlgorithmUseCase(newAlgorithm);
      setAlgorithm(createdAlgorithm);
      return createdAlgorithm;
    } catch (err) {
      setError('Failed to create algorithm. Please try again.');
      return null;
    }
  };

  return { algorithm, setAlgorithm, isLoading, error, updateAlgorithm, createAlgorithm };
};
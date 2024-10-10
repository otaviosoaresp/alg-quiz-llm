import { useState, useEffect } from 'react';
import { Tag } from '@/types/tag';
import { fetchTagsUseCase } from '@/usecases/Tags/fetchTags.usecase';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);
        const fetchedTags = await fetchTagsUseCase();
        setTags(fetchedTags);
        setError(null);
      } catch (err) {
        setError('Failed to load tags. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  return { tags, isLoading, error };
};
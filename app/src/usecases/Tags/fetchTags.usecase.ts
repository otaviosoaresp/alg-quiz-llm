import { httpClient } from '@/config/api';
import { Tag } from '@/types/tag';

export const fetchTagsUseCase = async (): Promise<Tag[]> => {
  try {
    const response = await httpClient.get<Tag[]>('/tags');
    if (Array.isArray(response)) {
      return response.map(tag => ({ id: tag.id || null, name: tag.name }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

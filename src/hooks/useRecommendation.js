import { useMemo } from 'react';
import { getRecommendation } from '../services/recommendationEngine.js';

export function useRecommendation(moodId, skipIds = []) {
  return useMemo(() => getRecommendation({ moodId, skipIds }), [moodId, skipIds]);
}

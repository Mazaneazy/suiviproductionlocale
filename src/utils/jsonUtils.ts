
import { Json } from '@/integrations/supabase/types';

/**
 * Safely converts a Json value to an array that can be iterated
 * @param value Any Json value that needs to be made iterable
 * @returns An array that can be safely iterated
 */
export function makeJsonIterable<T = any>(value: Json): T[] {
  if (value === null) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'object') return Object.values(value as object) as T[];
  if (typeof value === 'string') return [value] as unknown as T[];
  return [value] as unknown as T[]; // For number, boolean, etc.
}

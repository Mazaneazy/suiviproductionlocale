
import { Json } from '@/integrations/supabase/types';

/**
 * Safely converts a Json value to an array that can be iterated
 * @param value Any Json value that needs to be made iterable
 * @returns An array that can be safely iterated
 */
export function makeJsonIterable(value: Json): any[] {
  if (value === null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.values(value as object);
  if (typeof value === 'string') return [value];
  return [value]; // For number, boolean, etc.
}

/**
 * Safely accesses a property from a Json object
 * @param obj Json object
 * @param key Property key
 * @returns The property value or undefined if not found
 */
export function getJsonProperty(obj: Json, key: string): Json | undefined {
  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
    return (obj as Record<string, Json>)[key];
  }
  return undefined;
}

import { useState, useCallback } from 'react';
import { z } from 'zod';
import { NotesFrais, NoteFraisType, ParametresAnalyse } from '@/types';
import { Json } from '@/integrations/supabase/types';

// This function directly replaces the iteration over Json values with our safe version
// Fix for line 157
function safelyProcessJsonValues(value: Json) {
  return makeJsonIterable(value);
}

// Create a utility function right in this file
function makeJsonIterable<T = any>(value: Json): T[] {
  if (value === null) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'object') return Object.values(value as object) as T[];
  if (typeof value === 'string') return [value] as unknown as T[];
  return [value] as unknown as T[]; // For number, boolean, etc.
}

// Define your schemas and validation logic here
const notesFraisSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, 'La date est requise'),
  type: z.enum([NoteFraisType.DEPLACEMENT, NoteFraisType.HEBERGEMENT, NoteFraisType.RESTAURATION, NoteFraisType.FOURNITURE, NoteFraisType.AUTRE]),
  description: z.string().min(1, 'La description est requise'),
  montant: z.number().min(0.01, 'Le montant doit être supérieur à zéro'),
  tva: z.number().optional(),
  total: z.number().optional(),
  missionId: z.string().optional(),
  userId: z.string().optional(),
  entrepriseId: z.string().optional(),
  statut: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
  files: z.any().optional(),
  parametresAnalyses: z.array(z.string()).optional(),
  mission: z.any().optional(),
  user: z.any().optional(),
  entreprise: z.any().optional(),
});

type NotesFraisValues = z.infer<typeof notesFraisSchema>;

interface UseNotesFraisFormStateProps {
  initialValues?: NotesFraisValues;
  onSubmit: (values: NotesFraisValues) => void;
}

const useNotesFraisFormState = ({ initialValues, onSubmit }: UseNotesFraisFormStateProps) => {
  const [values, setValues] = useState<NotesFraisValues>({
    date: initialValues?.date || '',
    type: initialValues?.type || NoteFraisType.DEPLACEMENT,
    description: initialValues?.description || '',
    montant: initialValues?.montant || 0,
    tva: initialValues?.tva || 0,
    total: initialValues?.total || 0,
    missionId: initialValues?.missionId || '',
    userId: initialValues?.userId || '',
    entrepriseId: initialValues?.entrepriseId || '',
    statut: initialValues?.statut || '',
    createdAt: initialValues?.createdAt || '',
    updatedAt: initialValues?.updatedAt || '',
    deletedAt: initialValues?.deletedAt || '',
    files: initialValues?.files || [],
    parametresAnalyses: initialValues?.parametresAnalyses || [],
    mission: initialValues?.mission || {},
    user: initialValues?.user || {},
    entreprise: initialValues?.entreprise || {},
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      notesFraisSchema.parse(values);
      onSubmit(values);
    } catch (error) {
      console.error('Validation error:', error);
    }
  }, [onSubmit, values]);

  const setFieldValue = (name: string, value: any) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleParametresAnalysesChange = (selected: string[]) => {
    setFieldValue('parametresAnalyses', selected);
  };

  return {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleParametresAnalysesChange,
  };
};

export default useNotesFraisFormState;

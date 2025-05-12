
import { useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import { NoteFrais } from '@/types';
import { Json } from '@/integrations/supabase/types';

// This function directly replaces the iteration over Json values with our safe version
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

// Define enum locally since it's not exported from types
export enum NoteFraisType {
  DEPLACEMENT = 'deplacement',
  HEBERGEMENT = 'hebergement',
  RESTAURATION = 'restauration',
  FOURNITURE = 'fourniture',
  AUTRE = 'autre'
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

// Create an adapter hook that bridges the useNotesFraisFormState with the API expected by NotesFraisForm
export const useNotesFraisFormState = (dossier: any, onNoteFraisCreated: () => void) => {
  const [values, setValues] = useState<NotesFraisValues>({
    date: new Date().toISOString().split('T')[0],
    type: NoteFraisType.DEPLACEMENT,
    description: '',
    montant: 0,
    tva: 0,
    total: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newNoteFrais, setNewNoteFrais] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    montant: 0,
  });
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fraisGestion, setFraisGestion] = useState(50000);
  const [fraisInspection, setFraisInspection] = useState(75000);
  const [fraisSurveillance, setFraisSurveillance] = useState(40000);
  const [selectedParametres, setSelectedParametres] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPrix, setTotalPrix] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'description') {
      setDescription(value);
    }
    setNewNoteFrais({
      ...newNoteFrais,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implementation for file handling
  };

  const handleReset = () => {
    setValues({
      date: new Date().toISOString().split('T')[0],
      type: NoteFraisType.DEPLACEMENT,
      description: '',
      montant: 0,
      tva: 0,
      total: 0,
    });
    setDescription('');
    setSelectedParametres([]);
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      notesFraisSchema.parse(values);
      // Here you'd normally call onSubmit, but we're adapting the interface
      onNoteFraisCreated();
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onNoteFraisCreated]);

  const setFieldValue = (name: string, value: any) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const toggleParametre = (parametre: string) => {
    if (selectedParametres.includes(parametre)) {
      setSelectedParametres(selectedParametres.filter(p => p !== parametre));
    } else {
      setSelectedParametres([...selectedParametres, parametre]);
    }
  };

  const handleParametresAnalysesChange = (selected: string[]) => {
    setFieldValue('parametresAnalyses', selected);
    setSelectedParametres(selected);
  };

  return {
    // Original interface
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleParametresAnalysesChange,
    // Additional properties needed by NotesFraisForm
    newNoteFrais,
    setNewNoteFrais,
    total,
    handleInputChange,
    handleFileChange,
    handleReset,
    selectedParametres,
    fraisGestion,
    fraisInspection,
    fraisSurveillance,
    totalPrix,
    description,
    setDescription,
    isSubmitting,
    setFraisGestion,
    setFraisInspection,
    setFraisSurveillance,
    fileInputRef,
    toggleParametre,
    setSelectedParametres
  };
};

// Keep the default export for backward compatibility
export default useNotesFraisFormState;

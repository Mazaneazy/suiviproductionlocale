
import React from 'react';
import { User, Award } from 'lucide-react';

export const ROLES_COMITE = [
  { value: 'chef', label: 'Chef du comité', icon: <Award className="h-4 w-4" /> },
  { value: 'inspecteur', label: 'Inspecteur', icon: <User className="h-4 w-4" /> },
  { value: 'analyste', label: 'Analyste', icon: <User className="h-4 w-4" /> },
  { value: 'expert', label: 'Expert technique', icon: <User className="h-4 w-4" /> },
];

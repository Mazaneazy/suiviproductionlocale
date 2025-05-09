
import { Notification } from '../../types';
import { generateId } from './utils';

// Générer des notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: generateId(),
    message: 'Nouveau dossier en attente de validation.',
    date: new Date().toISOString(),
    lue: false,
    type: 'info',
  },
  {
    id: generateId(),
    message: 'Votre note de frais a été approuvée.',
    date: new Date().toISOString(),
    lue: false,
    type: 'info',
  },
  {
    id: generateId(),
    message: 'La date d\'expiration de votre certificat approche.',
    date: new Date().toISOString(),
    lue: false,
    type: 'warning',
  },
];

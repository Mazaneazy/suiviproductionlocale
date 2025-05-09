
// Main entry point for mock data - exports all mock data from individual files
export { MOCK_DOSSIERS } from './mockDossiers';
export { MOCK_NOTES_FRAIS } from './mockNotesFrais';
export { MOCK_INSPECTIONS } from './mockInspections';
export { MOCK_CERTIFICATS } from './mockCertificats';
export { MOCK_NOTIFICATIONS } from './mockNotifications';
export { MOCK_DOCUMENTS } from './mockDocuments';

// Export constants for direct use
export { PRODUITS_CAMEROUNAIS, OPERATEURS_CAMEROUNAIS, NOMS_CAMEROUNAIS } from './mockConstants';

// Export utility functions for data generation
export { generateRandomStatus, generateRandomDate, generateRandomDelay, generateRandomHistory } from './mockUtils';


import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const LoginInfoTab = () => {
  return (
    <>
      <Alert className="bg-blue-50 mb-4">
        <InfoIcon className="h-4 w-4 text-blue-700" aria-hidden="true" />
        <AlertTitle className="text-blue-700">Information</AlertTitle>
        <AlertDescription className="text-blue-600">
          Cette application est une démonstration du système de gestion des certifications ANOR.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4 text-sm">
        <p className="mb-2">
          Ce système permet la gestion des dossiers de certification, des inspections, des notes de frais et la génération des certificats de conformité.
        </p>
        
        <div>
          <h3 className="font-medium text-gray-800 mb-1">Fonctionnalités principales:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestion des dossiers de demande</li>
            <li>Planification et suivi des inspections</li>
            <li>Gestion des notes de frais</li>
            <li>Génération des certificats</li>
            <li>Statistiques et tableaux de bord</li>
          </ul>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
          <h3 className="font-medium text-amber-800 mb-1">Comptes d'accès:</h3>
          <p className="text-amber-700 mb-2">
            Vous pouvez vous connecter avec les comptes listés dans l'onglet "Connexion".
          </p>
          <ul className="list-disc pl-5 space-y-1 text-amber-700">
            <li><strong>Admin:</strong> admin@anor.cm / password</li>
            <li><strong>Directeur:</strong> directeur@anor.cm / password</li>
            <li><strong>Inspecteur:</strong> inspecteur@anor.cm / password</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default LoginInfoTab;

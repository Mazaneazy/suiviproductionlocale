
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dossier, DocumentDossier } from '@/types';
import DocumentsList from './document-validation/DocumentsList';
import CommentSection from './document-validation/CommentSection';
import ValidationActions from './document-validation/ValidationActions';
import ParametresEvaluationForm from './ParametresEvaluationForm';

interface DossierDetailPanelProps {
  dossier: Dossier;
  documents: DocumentDossier[];
  onValidationComplete: () => void;
}

// Liste des paramètres d'évaluation disponibles
const PARAMETRES_EVALUATION = [
  'Conformité aux normes camerounaises',
  'Qualité des matières premières',
  'Processus de production',
  'Emballage et étiquetage',
  'Conditions de stockage',
  'Traçabilité',
  'Analyse microbiologique',
  'Analyse physico-chimique',
  'Contrôle organoleptique',
  'Résistance mécanique',
  'Conformité dimensionnelle'
];

const DossierDetailPanel: React.FC<DossierDetailPanelProps> = ({ 
  dossier,
  documents,
  onValidationComplete
}) => {
  const { updateDocument, updateDossier } = useData();
  const [commentaire, setCommentaire] = useState('');
  const [showParametres, setShowParametres] = useState(false);
  const [parametresSelected, setParametresSelected] = useState<string[]>(dossier.parametresEvaluation || []);
  
  // État pour suivre les validations de documents
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, string>>({});
  
  // Fonction pour valider ou rejeter un document
  const handleDocumentValidation = (docId: string, status: 'valide' | 'rejete') => {
    updateDocument(docId, { 
      status, 
      commentaire: status === 'rejete' ? commentaire : undefined 
    });
    
    setDocumentStatuses({
      ...documentStatuses,
      [docId]: status
    });
  };
  
  // Vérifier si tous les documents sont validés
  const allDocumentsProcessed = () => {
    const requiredDocTypes = ['registre_commerce', 'carte_contribuable', 'processus_production', 'liste_personnel', 'plan_localisation'];
    
    const processedDocs = documents.filter(doc => 
      doc.status === 'valide' || documentStatuses[doc.id] === 'valide'
    );
    
    const hasAllRequired = requiredDocTypes.every(type => 
      processedDocs.some(doc => doc.type === type)
    );
    
    return hasAllRequired;
  };
  
  // Marquer le dossier comme complet
  const handleMarkComplet = () => {
    if (parametresSelected.length === 0) {
      return;
    }
    
    updateDossier(dossier.id, {
      status: 'complet',
      parametresEvaluation: parametresSelected,
      commentaires: commentaire || undefined
    });
    
    onValidationComplete();
  };
  
  // Marquer le dossier comme à corriger
  const handleMarkRejected = () => {
    updateDossier(dossier.id, {
      status: 'a_corriger',
      commentaires: commentaire || 'Veuillez corriger les documents rejetés.'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{dossier.operateurNom}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Promoteur</p>
            <p>{dossier.promoteurNom}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p>{dossier.telephone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Type de produit</p>
            <p>{dossier.typeProduit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date transmission</p>
            <p>{new Date(dossier.dateTransmission).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      
      <DocumentsList 
        documents={documents}
        onValidate={handleDocumentValidation}
        documentStatuses={documentStatuses}
      />
      
      <CommentSection
        commentaire={commentaire}
        setCommentaire={setCommentaire}
      />
      
      {allDocumentsProcessed() && !showParametres && (
        <div className="flex justify-center">
          <button 
            className="bg-certif-green hover:bg-certif-green/90 text-white px-4 py-2 rounded"
            onClick={() => setShowParametres(true)}
          >
            Sélectionner paramètres d'évaluation
          </button>
        </div>
      )}
      
      {showParametres && (
        <ParametresEvaluationForm
          parametresOptions={PARAMETRES_EVALUATION}
          selectedParametres={parametresSelected}
          onChange={setParametresSelected}
        />
      )}
      
      <ValidationActions
        onMarkComplet={handleMarkComplet}
        onMarkRejected={handleMarkRejected}
        disableComplete={!allDocumentsProcessed() || parametresSelected.length === 0}
        disableReject={!commentaire}
      />
    </div>
  );
};

export default DossierDetailPanel;


import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dossier, DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, AlertCircle, FileText, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  
  // Formater le type de document pour l'affichage
  const formatDocumentType = (type: string) => {
    switch (type) {
      case 'registre_commerce':
        return 'Registre de Commerce';
      case 'carte_contribuable':
        return 'Carte de Contribuable (NIU)';
      case 'processus_production':
        return 'Schéma du processus de production';
      case 'certificats_conformite':
        return 'Certificats de Conformité';
      case 'liste_personnel':
        return 'Liste du personnel';
      case 'plan_localisation':
        return 'Plan de localisation';
      case 'pdf':
        return 'Document PDF';
      default:
        return type;
    }
  };
  
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
  
  // View PDF document
  const viewDocument = (url: string, name: string) => {
    window.open(url, `_blank_${name}`);
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
      
      <div>
        <h3 className="text-lg font-medium mb-3">Documents du dossier</h3>
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    {doc.type === 'pdf' ? (
                      <File size={16} className="mr-2 text-red-500" />
                    ) : (
                      <FileText size={16} className="mr-2" />
                    )}
                    {doc.type === 'pdf' ? doc.nom : formatDocumentType(doc.type)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">
                    {doc.type === 'pdf' 
                      ? `Téléversé le ${new Date(doc.dateUpload).toLocaleDateString()}` 
                      : doc.nom}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center gap-2">
                    {doc.status === 'valide' || documentStatuses[doc.id] === 'valide' ? (
                      <Badge className="bg-green-500">Validé</Badge>
                    ) : doc.status === 'rejete' || documentStatuses[doc.id] === 'rejete' ? (
                      <Badge className="bg-red-500">Rejeté</Badge>
                    ) : (
                      <Badge>En attente</Badge>
                    )}
                    {doc.type === 'pdf' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewDocument(doc.url, doc.nom)}
                        className="text-certif-blue hover:text-certif-blue/80"
                      >
                        Visualiser
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => handleDocumentValidation(doc.id, 'valide')}
                      disabled={doc.status === 'valide' || documentStatuses[doc.id] === 'valide'}
                    >
                      <Check size={16} className="mr-1" /> Valider
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleDocumentValidation(doc.id, 'rejete')}
                      disabled={doc.status === 'rejete' || documentStatuses[doc.id] === 'rejete'}
                    >
                      <X size={16} className="mr-1" /> Rejeter
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun document disponible</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Commentaires</h3>
        <Textarea
          placeholder="Ajouter des commentaires sur le dossier"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={3}
        />
      </div>
      
      {allDocumentsProcessed() && !showParametres && (
        <div className="flex justify-center">
          <Button 
            className="bg-certif-green hover:bg-certif-green/90"
            onClick={() => setShowParametres(true)}
          >
            Sélectionner paramètres d'évaluation
          </Button>
        </div>
      )}
      
      {showParametres && (
        <ParametresEvaluationForm
          parametresOptions={PARAMETRES_EVALUATION}
          selectedParametres={parametresSelected}
          onChange={setParametresSelected}
        />
      )}
      
      <div className="flex justify-end gap-3">
        <Button 
          variant="destructive" 
          onClick={handleMarkRejected}
          disabled={!commentaire}
        >
          <AlertCircle size={16} className="mr-2" /> 
          Marquer "À corriger"
        </Button>
        <Button 
          className="bg-certif-blue hover:bg-certif-blue/90"
          onClick={handleMarkComplet}
          disabled={!allDocumentsProcessed() || parametresSelected.length === 0}
        >
          <Check size={16} className="mr-2" /> 
          Valider et continuer
        </Button>
      </div>
    </div>
  );
};

export default DossierDetailPanel;

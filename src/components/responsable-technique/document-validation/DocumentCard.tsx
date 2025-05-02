
import React from 'react';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, FileText, File } from 'lucide-react';

interface DocumentCardProps {
  doc: DocumentDossier;
  onValidate: (docId: string, status: 'valide' | 'rejete') => void;
  documentStatuses: Record<string, string>;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc, onValidate, documentStatuses }) => {
  // Format document type for display
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

  // View PDF document function
  const viewDocument = (url: string, name: string) => {
    window.open(url, `_blank_${name}`);
  };

  return (
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
            onClick={() => onValidate(doc.id, 'valide')}
            disabled={doc.status === 'valide' || documentStatuses[doc.id] === 'valide'}
          >
            <Check size={16} className="mr-1" /> Valider
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => onValidate(doc.id, 'rejete')}
            disabled={doc.status === 'rejete' || documentStatuses[doc.id] === 'rejete'}
          >
            <X size={16} className="mr-1" /> Rejeter
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;

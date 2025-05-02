
import React from 'react';
import { useData } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, Clock, User, FileCheck, FilePdf } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface DossierDetailsDialogProps {
  dossierId: string;
}

const DossierDetailsDialog: React.FC<DossierDetailsDialogProps> = ({ dossierId }) => {
  const { 
    getDossierById, 
    getDocumentsByDossierId, 
    getInspectionsByDossierId,
    getCertificatByDossierId
  } = useData();

  const dossier = getDossierById(dossierId);
  const documents = getDocumentsByDossierId(dossierId);
  const inspections = getInspectionsByDossierId(dossierId);
  const certificat = getCertificatByDossierId(dossierId);

  if (!dossier) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet': return 'bg-green-500 text-white';
      case 'en_attente': return 'bg-yellow-500 text-white';
      case 'rejete': return 'bg-red-500 text-white';
      case 'en_cours': return 'bg-blue-500 text-white';
      case 'certifie': return 'bg-green-700 text-white';
      case 'a_corriger': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'complet': return 'Complet';
      case 'en_attente': return 'En attente';
      case 'rejete': return 'Rejeté';
      case 'en_cours': return 'En cours';
      case 'certifie': return 'Certifié';
      case 'a_corriger': return 'À corriger';
      default: return status;
    }
  };

  // Format document type name for better display
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
      default:
        return type;
    }
  };

  // Helper function to view a PDF document
  const viewDocument = (url: string, name: string) => {
    window.open(url, `_blank_${name}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Détails</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Détails du dossier: {dossier.operateurNom}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <User className="mr-2 text-gray-400" size={16} />
            <span className="font-medium mr-1">Promoteur:</span> {dossier.promoteurNom}
          </div>
          <div className="flex items-center">
            <FileText className="mr-2 text-gray-400" size={16} />
            <span className="font-medium mr-1">Produit:</span> {dossier.typeProduit}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-400" size={16} />
            <span className="font-medium mr-1">Date transmission:</span> {new Date(dossier.dateTransmission).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 text-gray-400" size={16} />
            <span className="font-medium mr-1">Date butoir:</span> {new Date(dossier.dateButoir).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Badge className={getStatusColor(dossier.status)}>
              {formatStatus(dossier.status)}
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="historique">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="documents">Pièces jointes</TabsTrigger>
            <TabsTrigger value="elements">Éléments du dossier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="historique" className="h-[400px]">
            <ScrollArea className="h-full pr-4">
              {dossier.historique && dossier.historique.length > 0 ? (
                <div className="space-y-4">
                  {dossier.historique.map((event) => (
                    <div key={event.id} className="p-3 border rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{event.action}</span>
                        <span className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Responsable: {event.responsable}</span>
                      </div>
                      {event.commentaire && (
                        <div className="text-sm mt-2 bg-gray-50 p-2 rounded">
                          {event.commentaire}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  Aucun événement dans l'historique
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="documents" className="h-[400px]">
            <ScrollArea className="h-full pr-4">
              {documents && documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        {doc.type === 'pdf' ? (
                          <FilePdf className="mr-3 text-red-500" size={20} />
                        ) : (
                          <FileText className="mr-3 text-certif-blue" size={20} />
                        )}
                        <div>
                          <div className="font-medium">
                            {doc.type !== 'pdf' ? formatDocumentType(doc.type) : doc.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            Téléversé le {new Date(doc.dateUpload).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewDocument(doc.url, doc.nom)}
                      >
                        {doc.type === 'pdf' ? 'Visualiser' : 'Télécharger'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  Aucune pièce jointe disponible
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="elements" className="h-[400px]">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Informations générales</h3>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm text-gray-500">Opérateur</div>
                      <div>{dossier.operateurNom}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Téléphone</div>
                      <div>{dossier.telephone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Promoteur</div>
                      <div>{dossier.promoteurNom}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Type de produit</div>
                      <div>{dossier.typeProduit}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Paramètres d'évaluation</h3>
                  <Separator className="mb-3" />
                  {dossier.parametresEvaluation && dossier.parametresEvaluation.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {dossier.parametresEvaluation.map((param, index) => (
                        <li key={index}>{param}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">Aucun paramètre d'évaluation défini</div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Inspections</h3>
                  <Separator className="mb-3" />
                  {inspections && inspections.length > 0 ? (
                    <div className="space-y-3">
                      {inspections.map((inspection) => (
                        <div key={inspection.id} className="border p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Inspection du {new Date(inspection.dateInspection).toLocaleDateString()}</span>
                            <Badge className={inspection.resultat === 'conforme' ? 'bg-green-500' : inspection.resultat === 'non_conforme' ? 'bg-red-500' : 'bg-yellow-500'}>
                              {inspection.resultat === 'conforme' ? 'Conforme' : inspection.resultat === 'non_conforme' ? 'Non conforme' : 'En attente'}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <div>Lieu: {inspection.lieu}</div>
                            <div>Inspecteurs: {inspection.inspecteurs.join(', ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">Aucune inspection réalisée</div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Résultat d'évaluation</h3>
                  <Separator className="mb-3" />
                  {certificat ? (
                    <div className="border p-3 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Certificat #{certificat.numero}</span>
                        <Badge className={certificat.status === 'actif' ? 'bg-green-500' : 'bg-red-500'}>
                          {certificat.status === 'actif' ? 'Actif' : certificat.status === 'suspendu' ? 'Suspendu' : certificat.status === 'expire' ? 'Expiré' : 'Retiré'}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <div>Date de délivrance: {new Date(certificat.dateDelivrance).toLocaleDateString()}</div>
                        <div>Date d'expiration: {new Date(certificat.dateExpiration).toLocaleDateString()}</div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <FileCheck className="mr-2" size={16} />
                        Télécharger le certificat
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-500">Aucun certificat émis</div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DossierDetailsDialog;

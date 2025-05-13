
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { useData } from '../../contexts/DataContext';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { FileCheck, Folder, FileText, CalendarIcon, User, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InspectionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionId: string;
}

const InspectionDetails: React.FC<InspectionDetailsProps> = ({
  isOpen,
  onClose,
  inspectionId,
}) => {
  const { inspections, dossiers, getDocumentsByDossierId } = useData();
  
  const inspection = inspections.find(i => i.id === inspectionId);
  const dossier = inspection ? dossiers.find(d => d.id === inspection.dossierId || d.id === inspection.dossier_id) : null;
  const documents = dossier ? getDocumentsByDossierId(dossier.id) : [];
  
  if (!inspection || !dossier) {
    return null;
  }

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'bg-green-500 text-white';
      case 'non_conforme':
        return 'bg-red-500 text-white';
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Fonction pour formater le statut
  const formatStatus = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'Conforme';
      case 'non_conforme':
        return 'Non conforme';
      case 'en_attente':
        return 'En attente';
      case 'complet':
        return 'Complet';
      case 'en_cours':
        return 'En cours';
      case 'certifie':
        return 'Certifié';
      case 'rejete':
        return 'Rejeté';
      case 'a_corriger':
        return 'À corriger';
      default:
        return status;
    }
  };

  // Fonction pour obtenir la couleur du badge de document
  const getDocumentStatusColor = (status?: string) => {
    switch (status) {
      case 'valide':
        return 'bg-green-500 text-white';
      case 'rejete':
        return 'bg-red-500 text-white';
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'registre_commerce':
        return 'Registre du commerce';
      case 'carte_contribuable':
        return 'Carte de contribuable';
      case 'processus_production':
        return 'Processus de production';
      case 'certificats_conformite':
        return 'Certificats antérieurs';
      case 'liste_personnel':
        return 'Liste du personnel';
      case 'plan_localisation':
        return 'Plan de localisation';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-certif-blue">
            Détails de l'inspection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations sur l'inspection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date d'inspection</h3>
                <div className="flex items-center mt-1">
                  <CalendarIcon size={16} className="mr-2 text-gray-400" />
                  <p>{new Date(inspection.dateInspection || inspection.date_inspection).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <div className="mt-1">
                  <Badge className={getStatusColor(inspection.resultat)}>
                    {formatStatus(inspection.resultat)}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
                <div className="flex items-center mt-1">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <p>{inspection.lieu || "Non spécifié"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Inspecteurs</h3>
                <div className="flex items-center mt-1">
                  <User size={16} className="mr-2 text-gray-400" />
                  <p>{(inspection.inspecteurs && inspection.inspecteurs.length > 0) ? inspection.inspecteurs.join(', ') : "Non assigné"}</p>
                </div>
              </div>
            </div>

            {inspection.recommandations && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Recommandations</h3>
                <p className="mt-1 text-sm bg-white p-2 rounded border">{inspection.recommandations}</p>
              </div>
            )}

            {inspection.actionsCorrectives && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">Actions correctives</h3>
                <p className="mt-1 text-sm bg-white p-2 rounded border">{inspection.actionsCorrectives}</p>
              </div>
            )}
          </div>

          {/* Informations sur le dossier */}
          <div>
            <h3 className="font-medium text-lg flex items-center mb-3">
              <Folder className="mr-2" size={18} />
              Dossier associé
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Opérateur</h4>
                  <p className="mt-1 font-medium">{dossier.operateurNom}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Produit</h4>
                  <p className="mt-1">{dossier.typeProduit}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Statut du dossier</h4>
                  <Badge className={getStatusColor(dossier.status)} variant="outline">
                    {formatStatus(dossier.status)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date de transmission</h4>
                  <p className="mt-1">{new Date(dossier.dateTransmission).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date butoir</h4>
                  <p className="mt-1">{new Date(dossier.dateButoir).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(dossier.dateButoir), { addSuffix: true, locale: fr })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Responsable</h4>
                  <p className="mt-1">{dossier.responsable}</p>
                </div>
              </div>

              {dossier.commentaires && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Commentaires</h4>
                  <p className="mt-1 text-sm bg-white p-2 rounded border">{dossier.commentaires}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents associés */}
          <div>
            <h3 className="font-medium text-lg flex items-center mb-3">
              <FileText className="mr-2" size={18} />
              Documents associés
            </h3>

            {documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date d'upload</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell>{getDocumentTypeLabel(doc.type)}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileCheck size={16} className="mr-2 text-gray-500" />
                          {doc.nom}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(doc.dateUpload).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getDocumentStatusColor(doc.status)}>
                          {doc.status ? formatStatus(doc.status) : 'Non vérifié'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Aucun document associé à ce dossier.
              </p>
            )}
          </div>

          {/* Historique */}
          {dossier.historique && dossier.historique.length > 0 && (
            <div>
              <h3 className="font-medium text-lg flex items-center mb-3">
                <CalendarIcon className="mr-2" size={18} />
                Historique du dossier
              </h3>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Commentaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dossier.historique.map(event => (
                      <TableRow key={event.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{event.action}</TableCell>
                        <TableCell>{event.responsable}</TableCell>
                        <TableCell>{event.commentaire || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDetails;

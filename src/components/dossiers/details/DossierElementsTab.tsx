
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dossier } from '@/types';
import { FileCheck } from 'lucide-react';

interface DossierElementsTabProps {
  dossier: Dossier;
  inspections: any[];
  certificat: any;
}

const DossierElementsTab: React.FC<DossierElementsTabProps> = ({ 
  dossier, 
  inspections, 
  certificat 
}) => {
  return (
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
  );
};

export default DossierElementsTab;

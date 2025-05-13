
import React from 'react';
import { CalendarClock, FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RapportInspectionForm from '../rapports/RapportInspectionForm';
import { Dossier, Inspection, RapportInspection } from '@/types';
import { useNavigate } from 'react-router-dom';

interface InspectionsTabProps {
  dossier: Dossier | null;
  inspections: Inspection[];
  selectedInspection: Inspection | null;
  setSelectedInspection: (inspection: Inspection | null) => void;
  onSubmitRapport: (rapport: RapportInspection) => void;
}

const InspectionsTab: React.FC<InspectionsTabProps> = ({
  dossier,
  inspections,
  selectedInspection,
  setSelectedInspection,
  onSubmitRapport,
}) => {
  const navigate = useNavigate();

  if (!dossier) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-0 flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-certif-blue" />
          Gestion des inspections
        </h2>
        <Button 
          onClick={() => navigate(`/inspections/programmer/${dossier.id}`)}
          className="bg-certif-blue hover:bg-certif-blue/90"
        >
          <CalendarClock className="h-4 w-4 mr-2" />
          Programmer une inspection
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {inspections.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inspections programmées</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {inspections.map((inspection) => (
                <Card key={inspection.id} className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Inspection {new Date(inspection.dateInspection || inspection.date_inspection).toLocaleDateString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Lieu:</span> {inspection.lieu || "Non spécifié"}</p>
                      <p><span className="font-medium">Inspecteurs:</span> {(inspection.inspecteurs && inspection.inspecteurs.length) ? inspection.inspecteurs.join(', ') : "Non assigné"}</p>
                      <p><span className="font-medium">Statut:</span> {
                        inspection.resultat === 'conforme' ? 'Conforme' :
                        inspection.resultat === 'non_conforme' ? 'Non conforme' : 'En attente'
                      }</p>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedInspection(inspection)}
                      >
                        <FileUp className="h-4 w-4 mr-2" />
                        Rédiger rapport
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CalendarClock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>Aucune inspection programmée pour ce dossier</p>
            <p className="text-sm mt-2">Cliquez sur "Programmer une inspection" pour commencer</p>
          </div>
        )}
      </div>
      
      {selectedInspection && dossier && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Rapport d'inspection</h3>
          <RapportInspectionForm 
            dossier={dossier}
            inspection={selectedInspection}
            onSubmit={onSubmitRapport}
          />
        </div>
      )}
    </div>
  );
};

export default InspectionsTab;

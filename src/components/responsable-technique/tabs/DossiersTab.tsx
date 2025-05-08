
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import DossiersTechTable from '../DossiersTechTable';
import DossierDetailPanel from '../DossierDetailPanel';
import { Dossier, DocumentDossier } from '@/types';

interface DossiersTabProps {
  dossiers: Dossier[];
  selectedDossierId: string | null;
  onSelectDossier: (id: string) => void;
  selectedDossier: Dossier | null;
  documents: DocumentDossier[];
  onValidationComplete: () => void;
}

const DossiersTab: React.FC<DossiersTabProps> = ({
  dossiers,
  selectedDossierId,
  onSelectDossier,
  selectedDossier,
  documents,
  onValidationComplete,
}) => {
  const { toast } = useToast();
  
  const filteredDossiers = dossiers.filter(
    dossier => dossier.status === 'complet' || dossier.status === 'en_attente'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5 p-4 border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Dossiers en attente</h2>
          <DossiersTechTable 
            dossiers={filteredDossiers} 
            onSelectDossier={onSelectDossier}
            selectedDossierId={selectedDossierId}
          />
        </div>
        
        <div className="md:col-span-7 p-4">
          {selectedDossier ? (
            <DossierDetailPanel 
              dossier={selectedDossier} 
              documents={documents}
              onValidationComplete={() => {
                toast({
                  title: "Validation complétée",
                  description: "Le dossier a été validé et marqué comme complet.",
                });
                onValidationComplete();
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Veuillez sélectionner un dossier pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DossiersTab;

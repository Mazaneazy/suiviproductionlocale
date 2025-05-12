
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dossier } from '@/types';

interface TabsNavigationProps {
  activeTab: string;
  selectedDossier: Dossier | null;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, selectedDossier }) => {
  return (
    <TabsList className="mb-6">
      <TabsTrigger value="dossiers">Dossiers à traiter</TabsTrigger>
      <TabsTrigger value="comite" disabled={!selectedDossier}>Pilote technique</TabsTrigger>
      <TabsTrigger value="checklist" disabled={!selectedDossier}>Checklist d'inspection</TabsTrigger>
      <TabsTrigger value="frais" disabled={!selectedDossier}>Validation des frais</TabsTrigger>
      <TabsTrigger value="inspections" disabled={!selectedDossier}>Inspections</TabsTrigger>
      <TabsTrigger value="rapports">Rapports</TabsTrigger>
      <TabsTrigger value="avis" disabled={!selectedDossier}>Avis de décision</TabsTrigger>
      <TabsTrigger value="notesfrais" disabled={!selectedDossier}>Note de frais</TabsTrigger>
    </TabsList>
  );
};

export default TabsNavigation;

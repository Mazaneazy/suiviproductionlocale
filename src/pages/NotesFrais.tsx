
import React from 'react';
import Layout from '../components/Layout';
import { useNotesFraisManagement } from '../hooks/notes-frais';
import NotesFraisHeader from '../components/notes-frais/NotesFraisHeader';
import NotesFraisFilters from '../components/notes-frais/NotesFraisFilters';
import NotesFraisTable from '../components/notes-frais/NotesFraisTable';
import NotesFraisFormDialog from '../components/notes-frais/NotesFraisFormDialog';
import NotesFraisDetailsDialog from '../components/notes-frais/NotesFraisDetailsDialog';
import { Dialog } from '@/components/ui/dialog';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { downloadPDF, generateNoteFraisPDF } from '@/services/pdfService';

const NotesFrais = () => {
  const { getDossierById } = useData();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    setDialogOpen,
    detailDialogOpen,
    setDetailDialogOpen,
    selectedNote,
    newNoteFrais,
    filteredNotesFrais,
    dossiers,
    fileInputRef,
    handleInputChange,
    handleFileChange,
    handleSendNotification,
    handleMarkAsNotified,
    handleAddNoteFrais,
    handleValidateNoteFrais,
    handleRejectNoteFrais,
    calculerTotal,
    handleShowDetails,
    getStatusColor,
    formatStatus
  } = useNotesFraisManagement();
  
  // Fonction pour générer un rapport PDF de toutes les notes de frais
  const handleExportPDF = () => {
    // Créer une note de frais de récapitulation
    const mergedNoteFrais = {
      id: 'recap-' + Date.now(),
      dossierId: 'recap',
      inspecteurId: 'system',
      date: new Date().toISOString(),
      dateCreation: new Date().toISOString(),
      description: `Récapitulatif des notes de frais (${filteredNotesFrais.length})`,
      montant: filteredNotesFrais.reduce((sum, note) => sum + (note.montant || 0), 0),
      status: 'valide' as const,
      acquitte: false,
      fraisGestion: filteredNotesFrais.reduce((sum, note) => sum + (note.fraisGestion || 0), 0),
      fraisInspection: filteredNotesFrais.reduce((sum, note) => sum + (note.fraisInspection || 0), 0),
      fraisAnalyses: filteredNotesFrais.reduce((sum, note) => sum + (note.fraisAnalyses || 0), 0),
      fraisSurveillance: filteredNotesFrais.reduce((sum, note) => sum + (note.fraisSurveillance || 0), 0),
      commentaire: `Rapport généré le ${new Date().toLocaleDateString()}`
    };
    
    const pdfData = generateNoteFraisPDF(mergedNoteFrais, null);
    downloadPDF(pdfData, `notes-frais-recap-${Date.now()}.pdf`);
  };

  return (
    <Layout>
      <Helmet>
        <title>Notes de Frais | ANOR Certification</title>
      </Helmet>
      
      {/* Dialog for adding new note */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <NotesFraisFormDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          newNoteFrais={newNoteFrais}
          dossiers={dossiers}
          fileInputRef={fileInputRef}
          onInputChange={handleInputChange}
          onDossierChange={(value) => {
            const updatedNote = { ...newNoteFrais, dossierId: value };
            newNoteFrais.dossierId = value; // Direct update for compatibility
            return updatedNote;
          }}
          onFileChange={handleFileChange}
          onSave={handleAddNoteFrais}
        />
      </Dialog>

      <NotesFraisHeader onOpenDialog={() => setDialogOpen(true)} />
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <NotesFraisFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="ml-2"
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter en PDF
          </Button>
        </div>

        <NotesFraisTable
          notesFrais={filteredNotesFrais}
          dossiers={dossiers}
          onValidate={handleValidateNoteFrais}
          onReject={handleRejectNoteFrais}
          onSendNotification={handleSendNotification}
          onMarkAsNotified={handleMarkAsNotified}
          onShowDetails={handleShowDetails}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
          calculerTotal={calculerTotal}
        />
      </div>

      {/* Dialog for viewing details */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <NotesFraisDetailsDialog
          detailDialogOpen={detailDialogOpen}
          setDetailDialogOpen={setDetailDialogOpen}
          selectedNote={selectedNote}
          dossiers={dossiers}
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
          calculerTotal={calculerTotal}
        />
      </Dialog>
    </Layout>
  );
};

export default NotesFrais;

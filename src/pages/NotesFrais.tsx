
import React from 'react';
import Layout from '../components/Layout';
import { useNotesFraisManagement } from '../hooks/notes-frais';
import NotesFraisHeader from '../components/notes-frais/NotesFraisHeader';
import NotesFraisFilters from '../components/notes-frais/NotesFraisFilters';
import NotesFraisTable from '../components/notes-frais/NotesFraisTable';
import NotesFraisFormDialog from '../components/notes-frais/NotesFraisFormDialog';
import NotesFraisDetailsDialog from '../components/notes-frais/NotesFraisDetailsDialog';
import { Dialog } from '@/components/ui/dialog';

const NotesFrais = () => {
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

  return (
    <Layout>
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
        <NotesFraisFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
        />

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

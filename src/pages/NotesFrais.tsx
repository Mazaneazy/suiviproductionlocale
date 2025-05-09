
import React from 'react';
import Layout from '../components/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useNotesFraisManagement } from '../hooks/useNotesFraisManagement';

// Import refactored components
import NotesFraisHeader from '../components/notes-frais/NotesFraisHeader';
import NotesFraisFilters from '../components/notes-frais/NotesFraisFilters';
import NotesFraisTable from '../components/notes-frais/NotesFraisTable';
import NotesFraisForm from '../components/notes-frais/NotesFraisForm';
import NotesFraisDetails from '../components/notes-frais/NotesFraisDetails';

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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <NotesFraisHeader onOpenDialog={() => setDialogOpen(true)} />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle note de frais</DialogTitle>
          </DialogHeader>
          <NotesFraisForm
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
        </DialogContent>
      </Dialog>

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

      {/* Dialog for note details */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la note de frais</DialogTitle>
          </DialogHeader>
          {selectedNote && (
            <NotesFraisDetails
              note={selectedNote}
              dossiers={dossiers}
              getStatusColor={getStatusColor}
              formatStatus={formatStatus}
              calculerTotal={calculerTotal}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NotesFrais;

import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useNotesFraisManagement } from '../hooks/notes-frais';
import NotesFraisHeader from '../components/notes-frais/NotesFraisHeader';
import NotesFraisFilters from '../components/notes-frais/NotesFraisFilters';
import NotesFraisTable from '../components/notes-frais/NotesFraisTable';

const NotesFrais = () => {
  const navigate = useNavigate();
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedNote,
    filteredNotesFrais,
    dossiers,
    handleSendNotification,
    handleMarkAsNotified,
    handleValidateNoteFrais,
    handleRejectNoteFrais,
    calculerTotal,
    getStatusColor,
    formatStatus
  } = useNotesFraisManagement();

  return (
    <Layout>
      <NotesFraisHeader />
      
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
          getStatusColor={getStatusColor}
          formatStatus={formatStatus}
          calculerTotal={calculerTotal}
        />
      </div>
      
      {/* Supprimé les Dialog components */}
    </Layout>
  );
};

export default NotesFrais;


import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import CreateResultDialog from '@/components/resultats/CreateResultDialog';
import ResultatsFilter from '@/components/resultats/ResultatsFilter';
import ResultatsTable from '@/components/resultats/ResultatsTable';
import { useResultats } from '@/hooks/useResultats';

const Certificats = () => {
  const { currentUser } = useAuth();
  const [selectedDossier, setSelectedDossier] = useState(null);
  
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dossiersEligibles,
    filteredCertificats,
    handleSuspendCertificat,
    handleReactivateCertificat,
    handleDownloadCertificat
  } = useResultats();

  // Déterminer si l'utilisateur peut créer des documents
  const canCreateDocuments = currentUser?.role === 'certificats' || 
                           currentUser?.role === 'directeur' ||
                           currentUser?.role === 'admin' ||
                           currentUser?.role === 'directeur_general';

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Certificats émis</h1>
        {canCreateDocuments && dossiersEligibles.length > 0 && (
          <CreateResultDialog 
            dossier={dossiersEligibles[0]}
          />
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <ResultatsFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <ResultatsTable
          filteredCertificats={filteredCertificats}
          canCreateDocuments={canCreateDocuments}
          handleSuspendCertificat={handleSuspendCertificat}
          handleReactivateCertificat={handleReactivateCertificat}
          handleDownloadCertificat={handleDownloadCertificat}
        />
      </div>
    </Layout>
  );
};

export default Certificats;

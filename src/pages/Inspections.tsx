
import React from 'react';
import Layout from '../components/Layout';
import InspectionFilters from '../components/inspections/InspectionFilters';
import InspectionsTable from '../components/inspections/InspectionsTable';
import NewInspectionDialog from '../components/inspections/NewInspectionDialog';
import InspectionDetails from '../components/inspections/InspectionDetails';
import { useInspectionPageLogic } from '../components/inspections/useInspectionPageLogic';

const Inspections = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredInspections,
    inspectionDetailsOpen,
    setInspectionDetailsOpen,
    selectedInspectionId,
    handleMarkAsConforme,
    handleMarkAsNonConforme,
    handleViewDetails,
  } = useInspectionPageLogic();

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Inspections</h1>
        <NewInspectionDialog />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <InspectionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <InspectionsTable
          filteredInspections={filteredInspections}
          handleMarkAsConforme={handleMarkAsConforme}
          handleMarkAsNonConforme={handleMarkAsNonConforme}
          handleViewDetails={handleViewDetails}
        />
      </div>
      
      {/* Le dialogue de détails d'inspection */}
      {inspectionDetailsOpen && selectedInspectionId && (
        <InspectionDetails 
          isOpen={inspectionDetailsOpen}
          onClose={() => setInspectionDetailsOpen(false)}
          inspectionId={selectedInspectionId}
        />
      )}
    </Layout>
  );
};

export default Inspections;

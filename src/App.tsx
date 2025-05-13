
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inspections from './pages/Inspections';
import NotesFrais from './pages/NotesFrais';
import Statistiques from './pages/Statistiques';
import { useAuth } from './hooks/useAuth';

// Importation des pages
import AddNoteFrais from './pages/AddNoteFrais';
import NoteFraisDetails from './pages/NoteFraisDetails';
import DossierDetails from './pages/DossierDetails';

import ProgrammerInspection from './pages/ProgrammerInspection';
import Dossiers from './pages/Dossiers';
import AddDossier from './components/dossiers/AddDossier';


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dossiers" element={<ProtectedRoute><Dossiers /></ProtectedRoute>} />
            <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
            <Route path="/notes-frais" element={<ProtectedRoute><NotesFrais /></ProtectedRoute>} />
            <Route path="/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />
            
            {/* Routes pour les pages dédiées remplaçant les popups */}
            <Route path="/notes-frais/add" element={<ProtectedRoute><AddNoteFrais /></ProtectedRoute>} />
            <Route path="/notes-frais/add/:dossierId" element={<ProtectedRoute><AddNoteFrais /></ProtectedRoute>} />
            <Route path="/notes-frais/:noteId" element={<ProtectedRoute><NoteFraisDetails /></ProtectedRoute>} />
            <Route path="/dossiers/add" element={<ProtectedRoute><AddDossier /></ProtectedRoute>} />
            <Route path="/dossiers/:dossierId" element={<ProtectedRoute><DossierDetails /></ProtectedRoute>} />
            <Route path="/inspections/programmer/:dossierId" element={<ProtectedRoute><ProgrammerInspection /></ProtectedRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

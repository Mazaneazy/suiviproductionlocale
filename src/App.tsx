
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dossiers from "./pages/Dossiers";
import Inspections from "./pages/Inspections";
import Certificats from "./pages/Certificats";
import Accueil from "./pages/Accueil";
import ResponsableTechnique from "./pages/ResponsableTechnique";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Statistiques from "./pages/Statistiques";
import UserManagement from "./pages/UserManagement";
import NotesFrais from "./pages/NotesFrais";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/dossiers" element={
                <ProtectedRoute moduleName="dossiers">
                  <Dossiers />
                </ProtectedRoute>
              } />

              <Route path="/accueil" element={
                <ProtectedRoute moduleName="acceuil">
                  <Accueil />
                </ProtectedRoute>
              } />

              <Route path="/responsable-technique" element={
                <ProtectedRoute moduleName="responsable-technique">
                  <ResponsableTechnique />
                </ProtectedRoute>
              } />

              <Route path="/inspections" element={
                <ProtectedRoute moduleName="inspections">
                  <Inspections />
                </ProtectedRoute>
              } />

              <Route path="/certificats" element={
                <ProtectedRoute moduleName="resultats">
                  <Certificats />
                </ProtectedRoute>
              } />

              <Route path="/statistiques" element={
                <ProtectedRoute moduleName="statistiques">
                  <Statistiques />
                </ProtectedRoute>
              } />

              <Route path="/user-management" element={
                <ProtectedRoute moduleName="user-management">
                  <UserManagement />
                </ProtectedRoute>
              } />

              <Route path="/notes-frais" element={
                <ProtectedRoute moduleName="notes-frais">
                  <NotesFrais />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

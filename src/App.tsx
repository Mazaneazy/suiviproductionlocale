
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
import NotesFrais from "./pages/NotesFrais";
import Inspections from "./pages/Inspections";
import Certificats from "./pages/Certificats";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

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
                <ProtectedRoute allowedRoles={['admin', 'gestionnaire']}>
                  <Dossiers />
                </ProtectedRoute>
              } />

              <Route path="/notes-frais" element={
                <ProtectedRoute allowedRoles={['admin', 'comptable', 'inspecteur']}>
                  <NotesFrais />
                </ProtectedRoute>
              } />

              <Route path="/inspections" element={
                <ProtectedRoute allowedRoles={['admin', 'inspecteur', 'gestionnaire']}>
                  <Inspections />
                </ProtectedRoute>
              } />

              <Route path="/certificats" element={
                <ProtectedRoute allowedRoles={['admin', 'certificateur']}>
                  <Certificats />
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

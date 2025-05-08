
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import Layout from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User, ClipboardCheck, Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { motion } from "framer-motion";

const Calendar = () => {
  const { inspections, dossiers } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Create a map of dates with inspections
  const inspectionDates = inspections.reduce((acc, inspection) => {
    const date = new Date(inspection.dateInspection);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(inspection);
    return acc;
  }, {} as Record<string, typeof inspections>);
  
  // Function to highlight dates with inspections
  const isDayWithInspection = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return !!inspectionDates[dateKey];
  };
  
  // Get inspections for the selected date
  const selectedDateFormatted = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const inspectionsForSelectedDate = selectedDateFormatted ? inspectionDates[selectedDateFormatted] || [] : [];

  // Format status for display with proper color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conforme':
        return 'bg-green-500 text-white';
      case 'non_conforme':
        return 'bg-red-500 text-white';
      case 'en_attente':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case 'conforme': return 'Conforme';
      case 'non_conforme': return 'Non conforme';
      case 'en_attente': return 'En attente';
      default: return status;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Calendrier des inspections | ANOR Certification</title>
      </Helmet>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-certif-blue"
        >
          Calendrier des inspections
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            variants={itemVariants}
            className="col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Sélectionner une date
                </CardTitle>
                <CardDescription>
                  Les dates avec des inspections sont surlignées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      hasInspection: isDayWithInspection
                    }}
                    modifiersStyles={{
                      hasInspection: {
                        backgroundColor: '#9b87f5',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                    className="rounded-md pointer-events-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="col-span-1 lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="mr-2 h-5 w-5" />
                  {selectedDate ? (
                    <>Inspections du {format(selectedDate, 'dd/MM/yyyy')}</>
                  ) : (
                    <>Sélectionnez une date</>
                  )}
                </CardTitle>
                <CardDescription>
                  {inspectionsForSelectedDate.length === 0 
                    ? "Aucune inspection programmée pour cette date" 
                    : `${inspectionsForSelectedDate.length} inspection${inspectionsForSelectedDate.length > 1 ? 's' : ''} programmée${inspectionsForSelectedDate.length > 1 ? 's' : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inspectionsForSelectedDate.length > 0 ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {inspectionsForSelectedDate.map((inspection) => {
                      const dossier = dossiers.find(d => d.id === inspection.dossierId);
                      return (
                        <motion.div 
                          key={inspection.id}
                          variants={itemVariants}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{dossier?.operateurNom}</h3>
                              <p className="text-sm text-gray-500">{dossier?.typeProduit}</p>
                              
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm">
                                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                  {inspection.lieu}
                                </div>
                                <div className="flex items-center text-sm">
                                  <User className="mr-2 h-4 w-4 text-gray-400" />
                                  {inspection.inspecteurs.join(', ')}
                                </div>
                              </div>
                            </div>
                            
                            <Badge className={getStatusColor(inspection.resultat)}>
                              {formatStatus(inspection.resultat)}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {selectedDate ? (
                      <p>Aucune inspection n'est programmée pour cette date</p>
                    ) : (
                      <p>Veuillez sélectionner une date pour voir les inspections</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Calendar;

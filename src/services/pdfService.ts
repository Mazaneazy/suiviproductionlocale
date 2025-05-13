
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { NoteFrais, Certificat, Dossier } from '@/types';
import { formatDate } from '@/utils/dateUtils';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateNoteFraisPDF = (noteFrais: NoteFrais, dossier?: Dossier | null): string => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text("NOTE DE FRAIS", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`N° ${noteFrais.id}`, 20, 30);
  doc.text(`Date: ${formatDate(noteFrais.date)}`, 20, 40);
  
  if (dossier) {
    doc.text(`Opérateur: ${dossier.operateurNom}`, 20, 50);
    doc.text(`Dossier: ${dossier.reference || dossier.id}`, 20, 60);
    doc.text(`Produit: ${dossier.typeProduit}`, 20, 70);
  }
  
  // Add frais details
  const tableData = [
    ['Désignation', 'Montant (FCFA)'],
    ['Frais de gestion', noteFrais.fraisGestion?.toLocaleString() || '-'],
    ['Frais d\'inspection', noteFrais.fraisInspection?.toLocaleString() || '-'],
    ['Frais d\'analyses laboratoire', noteFrais.fraisAnalyses?.toLocaleString() || '-'],
    ['Frais de surveillance', noteFrais.fraisSurveillance?.toLocaleString() || '-'],
    ['TOTAL', (noteFrais.montant || 0).toLocaleString()],
  ];
  
  // Add table
  doc.autoTable({
    startY: 80,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    styles: { halign: 'left' },
    columnStyles: { 1: { halign: 'right' } }
  });
  
  let finalY = 150;
  
  // Add parameters if available
  if (noteFrais.parametresAnalyse && noteFrais.parametresAnalyse.length > 0) {
    doc.setFontSize(12);
    doc.text("Paramètres à analyser au laboratoire:", 20, finalY);
    
    const parametersData = noteFrais.parametresAnalyse.map(param => [param]);
    
    doc.autoTable({
      startY: finalY + 5,
      head: [['Paramètre']],
      body: parametersData,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
    });
    
    finalY = finalY + 50; // Adjust as needed based on the number of parameters
  }
  
  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text("ANOR Certification - Organisme de Certification", 105, pageHeight - 20, { align: "center" });
  doc.text("Pour votre conformité aux normes camerounaises", 105, pageHeight - 15, { align: "center" });
  
  // Generate PDF file blob
  return doc.output('dataurlstring');
};

export const generateCertificatPDF = (certificat: Certificat, dossier: Dossier | null): string => {
  const doc = new jsPDF();
  
  // Add ANOR logo placeholder
  doc.rect(20, 20, 40, 20);
  doc.setFontSize(10);
  doc.text("LOGO ANOR", 40, 32, { align: "center" });
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(0, 51, 102);
  doc.text("CERTIFICAT DE CONFORMITÉ", 105, 30, { align: "center" });
  
  doc.setFontSize(16);
  doc.text(`N° ${certificat.numeroCertificat || certificat.numero}`, 105, 40, { align: "center" });
  
  // Add content
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  if (dossier) {
    const contentY = 60;
    doc.text("L'Agence des Normes et de la Qualité certifie que :", 105, contentY, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(dossier.operateurNom, 105, contentY + 10, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Adresse: ${dossier.operateurAdresse || "Non définie"}`, 105, contentY + 20, { align: "center" });
    doc.text(`Produit: ${dossier.typeProduit}`, 105, contentY + 30, { align: "center" });
    doc.text(`Norme(s): ${certificat.normeReference || "NC 01-2023"}`, 105, contentY + 40, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("est conforme aux exigences applicables", 105, contentY + 55, { align: "center" });
    doc.text(`Date d'émission: ${formatDate(certificat.dateEmission || certificat.dateDelivrance)}`, 50, contentY + 70);
    doc.text(`Date d'expiration: ${formatDate(certificat.dateExpiration)}`, 50, contentY + 80);
  }
  
  // Add signature placeholder
  const signatureY = 180;
  doc.line(120, signatureY, 170, signatureY);
  doc.text("Le Directeur Général", 145, signatureY + 5, { align: "center" });
  
  // Add QR code placeholder
  doc.rect(20, 160, 30, 30);
  doc.setFontSize(8);
  doc.text("QR CODE", 35, 175, { align: "center" });
  doc.text("pour vérification", 35, 180, { align: "center" });
  
  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text("ANOR Certification - Organisme de Certification", 105, pageHeight - 20, { align: "center" });
  doc.text("Pour votre conformité aux normes camerounaises", 105, pageHeight - 15, { align: "center" });
  
  // Generate PDF file blob
  return doc.output('dataurlstring');
};

export const downloadPDF = (pdfData: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = pdfData;
  link.download = filename;
  link.click();
};

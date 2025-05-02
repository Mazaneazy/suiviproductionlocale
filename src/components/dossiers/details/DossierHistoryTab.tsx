
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DossierHistoryTabProps {
  historique?: {
    id: string;
    date: string;
    action: string;
    responsable: string;
    commentaire?: string;
  }[];
}

const DossierHistoryTab: React.FC<DossierHistoryTabProps> = ({ historique }) => {
  return (
    <ScrollArea className="h-full pr-4">
      {historique && historique.length > 0 ? (
        <div className="space-y-4">
          {historique.map((event) => (
            <div key={event.id} className="p-3 border rounded-md">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{event.action}</span>
                <span className="text-sm text-gray-500">{new Date(event.date).toLocaleString()}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Responsable: {event.responsable}</span>
              </div>
              {event.commentaire && (
                <div className="text-sm mt-2 bg-gray-50 p-2 rounded">
                  {event.commentaire}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500">
          Aucun événement dans l'historique
        </div>
      )}
    </ScrollArea>
  );
};

export default DossierHistoryTab;

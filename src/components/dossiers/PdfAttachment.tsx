
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileImage, X, Upload, Paperclip } from 'lucide-react';

interface PdfAttachmentProps {
  attachments: File[];
  onAddAttachment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
}

const PdfAttachment: React.FC<PdfAttachmentProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
            <Upload className="h-4 w-4" />
            <span>Téléverser des pièces jointes</span>
          </div>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={onAddAttachment}
          />
        </label>
      </div>
      
      {attachments.length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Fichiers attachés ({attachments.length})
          </p>
          <ul className="space-y-2 border rounded-md p-2 bg-gray-50">
            {attachments.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-certif-blue" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({Math.round(file.size / 1024)} Ko)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-500"
                  onClick={() => onRemoveAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PdfAttachment;

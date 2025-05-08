
import React from 'react';

interface FileIconProps {
  type: string;
}

const FileIcon: React.FC<FileIconProps> = ({ type }) => {
  switch (type) {
    case 'registre_commerce':
      return <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">RC</div>;
    case 'carte_contribuable':
      return <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center text-green-600">NIU</div>;
    case 'processus_production':
      return <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">PP</div>;
    case 'certificats_conformite':
      return <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">CC</div>;
    case 'liste_personnel':
      return <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">LP</div>;
    case 'plan_localisation':
      return <div className="w-16 h-16 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">PL</div>;
    default:
      return <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center text-red-600">PDF</div>;
  }
};

export default FileIcon;

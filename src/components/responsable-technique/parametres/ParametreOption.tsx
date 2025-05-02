
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ParametreOptionProps {
  parametre: string;
  isSelected: boolean;
  onToggle: (parametre: string) => void;
}

const ParametreOption: React.FC<ParametreOptionProps> = ({
  parametre,
  isSelected,
  onToggle
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={parametre}
        checked={isSelected}
        onCheckedChange={() => onToggle(parametre)}
      />
      <Label htmlFor={parametre} className="text-sm cursor-pointer">
        {parametre}
      </Label>
    </div>
  );
};

export default ParametreOption;

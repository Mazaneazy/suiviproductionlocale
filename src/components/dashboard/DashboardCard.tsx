
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';

interface DashboardCardProps {
  type: string;
  title: string;
  description: string;
  isCustomizing: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  type,
  title,
  description,
  isCustomizing
}) => {
  return (
    <Card className={`transition-all ${isCustomizing ? 'cursor-move border-dashed border-gray-300 border-2' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {isCustomizing && <CardDescription>{description}</CardDescription>}
        </div>
        {isCustomizing && (
          <div className="cursor-grab hover:bg-gray-100 p-1 rounded">
            <DragHandleDots2Icon className="w-5 h-5" />
          </div>
        )}
      </CardHeader>
      {isCustomizing && (
        <CardContent className="text-sm text-gray-500">
          Cliquez et faites glisser pour déplacer cet élément
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardCard;

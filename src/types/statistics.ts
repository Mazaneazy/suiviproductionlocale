
export interface Statistique {
  id: string;
  title: string;
  value: number | string;
  description?: string;
  period?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

export interface Movement {
  id: string;
  type: 'Entrada' | 'Saída' | 'Ajuste';
  productName: string;
  quantity: number;
  date: string;
}

export const mockMovements: Movement[] = [
  {
    id: '1',
    type: 'Entrada',
    productName: 'Parafuso 8mm',
    quantity: 100,
    date: 'Hoje 14:22',
  },
  {
    id: '2',
    type: 'Saída',
    productName: 'Lâmpada LED 9W',
    quantity: -20,
    date: 'Hoje 13:48',
  },
  {
    id: '3',
    type: 'Ajuste',
    productName: 'Fita isolante',
    quantity: -5,
    date: 'Hoje 11:10',
  }
];

export interface Inventory {
  id: string;
  name: string;
  status: 'Em andamento' | 'Pendente' | 'Concluído';
  date: string;
  responsible: string;
  progress: number;
  locationsCount: number;
  totalLocations: number;
  lastUpdate: string;
}

export const mockInventories: Inventory[] = [
  {
    id: '1',
    name: 'Inventário Almoxarifado Central',
    status: 'Em andamento',
    date: 'Setembro/2026',
    responsible: 'João Silva',
    progress: 72,
    locationsCount: 18,
    totalLocations: 25,
    lastUpdate: 'Hoje',
  },
  {
    id: '2',
    name: 'Inventário Obra 03',
    status: 'Pendente',
    date: 'Outubro/2026',
    responsible: 'Maria Souza',
    progress: 0,
    locationsCount: 0,
    totalLocations: 12,
    lastUpdate: '-',
  },
  {
    id: '3',
    name: 'Inventário Geral 2025',
    status: 'Concluído',
    date: 'Dezembro/2025',
    responsible: 'Carlos Mendes',
    progress: 100,
    locationsCount: 40,
    totalLocations: 40,
    lastUpdate: '15/12/2025',
  }
];

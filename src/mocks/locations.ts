export interface Location {
  id: string;
  code: string;
  name: string;
  sector: string;
  productsCount: number;
  status: 'Ativo' | 'Inativo';
}

export const mockLocations: Location[] = [
  {
    id: '1',
    code: 'A01',
    name: 'Corredor A - Prateleira 01',
    sector: 'Almoxarifado Central',
    productsCount: 145,
    status: 'Ativo',
  },
  {
    id: '2',
    code: 'A02',
    name: 'Corredor A - Prateleira 02',
    sector: 'Almoxarifado Central',
    productsCount: 89,
    status: 'Ativo',
  },
  {
    id: '3',
    code: 'B01',
    name: 'Corredor B - Materiais Elétricos',
    sector: 'Almoxarifado Central',
    productsCount: 210,
    status: 'Ativo',
  },
  {
    id: '4',
    code: 'EXT-01',
    name: 'Pátio Externo',
    sector: 'Obra 03',
    productsCount: 12,
    status: 'Ativo',
  }
];

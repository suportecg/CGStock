export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  location: string;
  status: 'Ativo' | 'Estoque baixo' | 'Inativo';
}

export const mockProducts: Product[] = [
  {
    id: '1',
    code: 'MAT-00001',
    name: 'Parafuso 8mm',
    category: 'Ferragens',
    unit: 'UN',
    stock: 230,
    location: 'A01-03',
    status: 'Ativo',
  },
  {
    id: '2',
    code: 'MAT-00002',
    name: 'Fita isolante',
    category: 'Elétrica',
    unit: 'UN',
    stock: 18,
    location: 'A02-01',
    status: 'Estoque baixo',
  },
  {
    id: '3',
    code: 'MAT-00003',
    name: 'Lâmpada LED 9W',
    category: 'Elétrica',
    unit: 'UN',
    stock: 72,
    location: 'B01-02',
    status: 'Ativo',
  },
  {
    id: '4',
    code: 'MAT-00004',
    name: 'Cabo flexível 2.5mm',
    category: 'Elétrica',
    unit: 'M',
    stock: 500,
    location: 'C03-01',
    status: 'Ativo',
  },
  {
    id: '5',
    code: 'MAT-00005',
    name: 'Luva de PVC 3/4',
    category: 'Hidráulica',
    unit: 'UN',
    stock: 0,
    location: 'D01-04',
    status: 'Inativo',
  },
];

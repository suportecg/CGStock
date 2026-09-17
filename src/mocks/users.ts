export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gestor' | 'Almoxarife' | 'Conferente' | 'Solicitante';
  status: 'Ativo' | 'Inativo';
  lastAccess: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@estoka.com',
    role: 'Administrador',
    status: 'Ativo',
    lastAccess: 'Hoje 08:30',
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@estoka.com',
    role: 'Gestor',
    status: 'Ativo',
    lastAccess: 'Hoje 09:15',
  },
  {
    id: '3',
    name: 'Maria Souza',
    email: 'maria@estoka.com',
    role: 'Almoxarife',
    status: 'Ativo',
    lastAccess: 'Ontem 17:45',
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    email: 'carlos@estoka.com',
    role: 'Conferente',
    status: 'Inativo',
    lastAccess: '12/08/2026',
  }
];

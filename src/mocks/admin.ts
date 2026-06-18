import type { Admin } from './types';

export const admin: Admin = {
    name: 'Coordenadoria de Pesquisa ITL',
    email: 'coordenacao.pesquisa@itl.edu.br',
    role: 'Coordenador de Pesquisa',
    phone: '(13) 3368-0000',
    updatedAt: '2025-03-10',
};

export function updateAdmin(data: Partial<Admin>): void {
    Object.assign(admin, data, { updatedAt: new Date().toISOString().slice(0, 10) });
}

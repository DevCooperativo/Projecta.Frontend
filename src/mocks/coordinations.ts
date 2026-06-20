import type { Coordination } from './types';

export const coordinations: Coordination[] = [
    { id: 1, name: 'Coordenadoria de Computação e Tecnologia', acronym: 'CCT', block: 'B2', status: 'active', professorCount: 8, createdAt: '2019-02-10', updatedAt: '2025-10-15' },
    { id: 2, name: 'Coordenadoria de Engenharias', acronym: 'CENG', block: 'B4', status: 'active', professorCount: 12, createdAt: '2018-08-01', updatedAt: '2025-09-20' },
    { id: 3, name: 'Coordenadoria de Ciências Exatas', acronym: 'CCE', block: 'B1', status: 'active', professorCount: 6, createdAt: '2020-03-22', updatedAt: '2025-11-02' },
    { id: 4, name: 'Coordenadoria de Ciências da Vida', acronym: 'CCV', block: 'B6', status: 'active', professorCount: 5, createdAt: '2021-05-14', updatedAt: '2025-08-30' },
    { id: 5, name: 'Coordenadoria de Ciências Humanas', acronym: 'CCH', block: 'B0', status: 'inactive', professorCount: 0, createdAt: '2017-11-30', updatedAt: '2024-02-18' },
    { id: 6, name: 'Coordenadoria de Gestão e Negócios', acronym: 'CGN', block: 'B3', status: 'active', professorCount: 4, createdAt: '2022-01-10', updatedAt: '2025-07-05' },
    { id: 7, name: 'Coordenadoria de Saúde e Bem-Estar', acronym: 'CSB', block: 'B8', status: 'active', professorCount: 7, createdAt: '2020-09-01', updatedAt: '2025-10-28' },
];

export function getCoordinationName(id: number): string {
    return coordinations.find(c => c.id === id)?.name ?? '—';
}

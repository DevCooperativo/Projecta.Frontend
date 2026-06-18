import type { Professor, RemoveResult } from './types';

export const professors: Professor[] = [
    { id: 1, name: 'Ana Beatriz Carvalho', email: 'ana.carvalho@itl.edu.br', registration: 'SIAPE-102345', coordinationId: 1, lattes: 'http://lattes.cnpq.br/1234567890', status: 'active', projectCount: 2, borrowCount: 1, labCount: 1, createdAt: '2020-03-10', updatedAt: '2025-08-14' },
    { id: 2, name: 'Carlos Eduardo Mendes', email: 'carlos.mendes@itl.edu.br', registration: 'SIAPE-203456', coordinationId: 2, lattes: 'http://lattes.cnpq.br/2345678901', status: 'active', projectCount: 1, borrowCount: 0, labCount: 2, createdAt: '2019-07-22', updatedAt: '2025-09-01' },
    { id: 3, name: 'Fernanda Lima Rocha', email: 'fernanda.rocha@itl.edu.br', registration: 'SIAPE-304567', coordinationId: 1, lattes: '', status: 'active', projectCount: 0, borrowCount: 0, labCount: 0, createdAt: '2023-01-15', updatedAt: '2025-11-03' },
    { id: 4, name: 'Ricardo Sousa Teixeira', email: 'ricardo.teixeira@itl.edu.br', registration: 'SIAPE-405678', coordinationId: 3, lattes: 'http://lattes.cnpq.br/3456789012', status: 'active', projectCount: 3, borrowCount: 2, labCount: 1, createdAt: '2018-05-30', updatedAt: '2025-10-22' },
    { id: 5, name: 'Juliana Prado Ferreira', email: 'juliana.ferreira@itl.edu.br', registration: 'SIAPE-506789', coordinationId: 4, lattes: 'http://lattes.cnpq.br/4567890123', status: 'inactive', projectCount: 0, borrowCount: 0, labCount: 0, createdAt: '2021-09-08', updatedAt: '2024-06-17' },
    { id: 6, name: 'Marcos Vinícius Oliveira', email: 'marcos.oliveira@itl.edu.br', registration: 'SIAPE-607890', coordinationId: 2, lattes: 'http://lattes.cnpq.br/5678901234', status: 'active', projectCount: 1, borrowCount: 0, labCount: 1, createdAt: '2022-02-14', updatedAt: '2025-07-29' },
    { id: 7, name: 'Patrícia Nunes Alves', email: 'patricia.alves@itl.edu.br', registration: 'SIAPE-708901', coordinationId: 6, lattes: '', status: 'active', projectCount: 0, borrowCount: 0, labCount: 0, createdAt: '2024-03-01', updatedAt: '2025-10-10' },
];

export function canRemoveProfessor(id: number): RemoveResult {
    const p = professors.find(x => x.id === id);
    if (!p) return { allowed: false, reason: 'Professor não encontrado.' };
    const links: string[] = [];
    if (p.projectCount > 0) links.push(`${p.projectCount} projeto(s)`);
    if (p.borrowCount > 0) links.push(`${p.borrowCount} empréstimo(s)`);
    if (p.labCount > 0) links.push(`${p.labCount} laboratório(s)`);
    if (links.length > 0) return { allowed: false, reason: `Este professor possui vínculo com ${links.join(', ')} e não pode ser excluído.` };
    return { allowed: true };
}

export function removeProfessor(id: number): boolean {
    const idx = professors.findIndex(x => x.id === id);
    if (idx === -1) return false;
    professors.splice(idx, 1);
    return true;
}

export function nextProfessorId(): number {
    return professors.length > 0 ? Math.max(...professors.map(p => p.id)) + 1 : 1;
}

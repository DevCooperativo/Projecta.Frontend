import type { Student, RemoveResult } from './types';

export const students: Student[] = [
    { id: 1, name: 'Lucas Ferri Viana', email: 'lucas.ferri@aluno.itl.edu.br', registration: '2022001234', course: 'Análise e Desenvolvimento de Sistemas', lattes: 'http://lattes.cnpq.br/9876543210', status: 'active', projectCount: 1, borrowCount: 2, createdAt: '2022-02-07', updatedAt: '2025-10-01' },
    { id: 2, name: 'Izabelli Delcaro', email: 'izabelli.delcaro@aluno.itl.edu.br', registration: '2021005678', course: 'Engenharia de Software', lattes: '', status: 'active', projectCount: 2, borrowCount: 0, createdAt: '2021-03-01', updatedAt: '2025-09-15' },
    { id: 3, name: 'Nicolas Bassini', email: 'nicolas.bassini@aluno.itl.edu.br', registration: '2023008901', course: 'Ciência da Computação', lattes: 'http://lattes.cnpq.br/1122334455', status: 'active', projectCount: 1, borrowCount: 1, createdAt: '2023-02-20', updatedAt: '2025-11-05' },
    { id: 4, name: 'Beatriz Almeida Santos', email: 'beatriz.santos@aluno.itl.edu.br', registration: '2022003344', course: 'Análise e Desenvolvimento de Sistemas', lattes: '', status: 'active', projectCount: 0, borrowCount: 0, createdAt: '2022-02-14', updatedAt: '2025-08-22' },
    { id: 5, name: 'Gabriel Moreira Lima', email: 'gabriel.lima@aluno.itl.edu.br', registration: '2020009988', course: 'Engenharia Elétrica', lattes: 'http://lattes.cnpq.br/5566778899', status: 'inactive', projectCount: 0, borrowCount: 0, createdAt: '2020-08-03', updatedAt: '2024-12-10' },
    { id: 6, name: 'Mariana Costa Ramos', email: 'mariana.ramos@aluno.itl.edu.br', registration: '2023006677', course: 'Ciência da Computação', lattes: '', status: 'active', projectCount: 0, borrowCount: 1, createdAt: '2023-02-20', updatedAt: '2025-10-30' },
    { id: 7, name: 'Pedro Henrique Souza', email: 'pedro.souza@aluno.itl.edu.br', registration: '2021002211', course: 'Engenharia de Software', lattes: 'http://lattes.cnpq.br/6677889900', status: 'active', projectCount: 1, borrowCount: 0, createdAt: '2021-03-01', updatedAt: '2025-07-18' },
];

export function canRemoveStudent(id: number): RemoveResult {
    const s = students.find(x => x.id === id);
    if (!s) return { allowed: false, reason: 'Aluno não encontrado.' };
    const links: string[] = [];
    if (s.projectCount > 0) links.push(`${s.projectCount} projeto(s)`);
    if (s.borrowCount > 0) links.push(`${s.borrowCount} empréstimo(s)`);
    if (links.length > 0) return { allowed: false, reason: `Este aluno possui vínculo com ${links.join(' e ')} e não pode ser excluído.` };
    return { allowed: true };
}

export function removeStudent(id: number): boolean {
    const idx = students.findIndex(x => x.id === id);
    if (idx === -1) return false;
    students.splice(idx, 1);
    return true;
}

export function nextStudentId(): number {
    return students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
}

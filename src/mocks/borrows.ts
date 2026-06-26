import type { Borrow, Equipment, RemoveResult } from './types';

export const equipment: Equipment[] = [
    { id: 1, name: 'Osciloscópio Digital', category: 'Eletrônica', laboratory: 'Lab. de Eletrônica' },
    { id: 2, name: 'Multímetro Digital', category: 'Eletrônica', laboratory: 'Lab. de Eletrônica' },
    { id: 3, name: 'Fonte de Alimentação DC', category: 'Eletrônica', laboratory: 'Lab. de Eletrônica' },
    { id: 4, name: 'Kit Arduino Uno', category: 'Microcontroladores', laboratory: 'Lab. de Computação' },
    { id: 5, name: 'Raspberry Pi 4', category: 'Microcontroladores', laboratory: 'Lab. de Computação' },
    { id: 6, name: 'Projetor Portátil', category: 'Audiovisual', laboratory: 'Lab. Multimídia' },
    { id: 7, name: 'Câmera DSLR Canon EOS', category: 'Audiovisual', laboratory: 'Lab. Multimídia' },
    { id: 8, name: 'Notebook Dell Latitude', category: 'Informática', laboratory: 'Lab. de Computação' },
    { id: 9, name: 'Sensor de Pressão MPX5700', category: 'Sensores', laboratory: 'Lab. de Engenharia' },
    { id: 10, name: 'Estação de Solda Hakko FX888', category: 'Eletrônica', laboratory: 'Lab. de Eletrônica' },
];

export const borrows: Borrow[] = [
    { id: 1, equipmentId: 1, equipmentName: 'Osciloscópio Digital', borrowerType: 'professor', borrowerId: 1, borrowerName: 'Ana Beatriz Carvalho', startDate: '2026-04-01', expectedReturnDate: '2026-04-15', completionDate: null, status: 'pending', notes: '' },
    { id: 2, equipmentId: 4, equipmentName: 'Kit Arduino Uno', borrowerType: 'student', borrowerId: 1, borrowerName: 'Lucas Ferri Viana', startDate: '2026-04-10', expectedReturnDate: '2026-04-24', completionDate: null, status: 'pending', notes: '' },
    { id: 3, equipmentId: 8, equipmentName: 'Notebook Dell Latitude', borrowerType: 'professor', borrowerId: 4, borrowerName: 'Ricardo Sousa Teixeira', startDate: '2026-03-20', expectedReturnDate: '2026-04-03', completionDate: '2026-04-02', status: 'completed', notes: 'Devolvido em perfeito estado.' },
    { id: 4, equipmentId: 6, equipmentName: 'Projetor Portátil', borrowerType: 'student', borrowerId: 3, borrowerName: 'Nicolas Bassini', startDate: '2026-04-05', expectedReturnDate: '2026-04-12', completionDate: '2026-04-11', status: 'completed', notes: 'Cabo HDMI devolvido separado.' },
    { id: 5, equipmentId: 2, equipmentName: 'Multímetro Digital', borrowerType: 'student', borrowerId: 6, borrowerName: 'Mariana Costa Ramos', startDate: '2026-04-20', expectedReturnDate: '2026-05-04', completionDate: null, status: 'pending', notes: '' },
    { id: 6, equipmentId: 5, equipmentName: 'Raspberry Pi 4', borrowerType: 'professor', borrowerId: 2, borrowerName: 'Carlos Eduardo Mendes', startDate: '2026-04-15', expectedReturnDate: '2026-04-30', completionDate: null, status: 'pending', notes: '' },
    { id: 7, equipmentId: 9, equipmentName: 'Sensor de Pressão MPX5700', borrowerType: 'student', borrowerId: 2, borrowerName: 'Izabelli Delcaro', startDate: '2026-03-10', expectedReturnDate: '2026-03-24', completionDate: '2026-03-23', status: 'completed', notes: '' },
];

export function isEquipmentAvailable(equipmentId: number): boolean {
    return !borrows.some(b => b.equipmentId === equipmentId && b.status === 'pending');
}

function countPending(borrowerType: 'professor' | 'student', borrowerId: number): number {
    return borrows.filter(b => b.borrowerType === borrowerType && b.borrowerId === borrowerId && b.status === 'pending').length;
}

const PENDING_LIMIT = { student: 5, professor: 10 };

export function canCreateBorrow(
    borrowerType: 'professor' | 'student',
    borrowerId: number,
    equipmentId: number
): RemoveResult {
    if (!isEquipmentAvailable(equipmentId)) {
        return { allowed: false, reason: 'Este equipamento já possui um empréstimo ativo.' };
    }
    const limit = PENDING_LIMIT[borrowerType];
    const pending = countPending(borrowerType, borrowerId);
    if (pending >= limit) {
        const label = borrowerType === 'student' ? 'aluno' : 'professor';
        return { allowed: false, reason: `Este ${label} já possui ${pending} empréstimo(s) pendente(s) (limite: ${limit}).` };
    }
    return { allowed: true };
}

export function closeBorrow(id: number, notes: string): boolean {
    const borrow = borrows.find(b => b.id === id);
    if (!borrow || borrow.status !== 'pending') return false;
    borrow.status = 'completed';
    borrow.completionDate = new Date().toISOString().slice(0, 10);
    borrow.notes = notes;
    return true;
}

export function nextBorrowId(): number {
    return borrows.length > 0 ? Math.max(...borrows.map(b => b.id)) + 1 : 1;
}

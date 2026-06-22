import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Avatar';
import { studentsServices } from '@/api/students/implementation/studentsServices';
import type { StudentResponse } from '@/api/students/iStudentsServices';
import { useAuth } from '@/context/auth/useAuth';

const PAGE_SIZE = 10;

const SHIFT_LABELS: Record<string, string> = {
    MORNING: 'Manhã',
    AFTERNOON: 'Tarde',
    EVENING: 'Noite',
    NIGHT: 'Integral',
};

export const StudentList = () => {
    const { user } = useAuth();
    const isAdmin = user?.profileType === 'admin';
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [shiftFilter, setShiftFilter] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        studentsServices.list()
            .then(x => x.data && setStudents(x.data))
            .catch(() => setError('Não foi possível carregar os alunos.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return students.filter(s =>
            (q === '' || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.registration.toLowerCase().includes(q)) &&
            (shiftFilter === '' || s.shift === shiftFilter)
        );
    }, [students, search, shiftFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch('');
        setShiftFilter('');
        setPage(1);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item active">Alunos</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Alunos</h4>
                </div>
                {isAdmin && (
                    <Link to="/students/new" className="btn btn-dark">
                        + Novo aluno
                    </Link>
                )}
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por nome, e-mail ou matrícula..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={shiftFilter}
                                onChange={e => { setShiftFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todos os turnos</option>
                                {Object.entries(SHIFT_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-center">
                            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Aluno</th>
                                <th>Matrícula</th>
                                <th>Período</th>
                                <th>Turno</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">Carregando...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-danger py-4">{error}</td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(s => (
                                    <tr key={s.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <Avatar name={s.name} variant="student" size="sm" />
                                                <div>
                                                    <div className="fw-semibold">{s.name}</div>
                                                    <div className="text-muted small">{s.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{s.registration}</td>
                                        <td className="align-middle">{s.term}º</td>
                                        <td className="align-middle">{SHIFT_LABELS[s.shift] ?? s.shift}</td>
                                        <td className="align-middle text-end">
                                            <Link to={`/students/${s.id}`} className="btn btn-sm btn-outline-dark">
                                                Ver
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            {filtered.length} aluno{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                        </small>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
};

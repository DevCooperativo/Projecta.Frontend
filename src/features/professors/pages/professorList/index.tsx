import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coordinations } from '@/mocks/coordinations';
import { Avatar } from '@/components/Avatar';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';

const PAGE_SIZE = 10;

export const ProfessorList = () => {
    const [professors, setProfessors] = useState<ProfessorResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [coordinationFilter, setCoordinationFilter] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        professorsServices.list()
            .then(setProfessors)
            .catch(() => setError('Não foi possível carregar os professores.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return professors.filter(p =>
            (q === '' || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.registration.toLowerCase().includes(q)) &&
            (coordinationFilter === '' || p.coordinationId === Number(coordinationFilter))
        );
    }, [professors, search, coordinationFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch('');
        setCoordinationFilter('');
        setPage(1);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item active">Professores</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Professores</h4>
                </div>
                <Link to="/professors/new" className="btn btn-dark">
                    + Novo professor
                </Link>
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
                                value={coordinationFilter}
                                onChange={e => { setCoordinationFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todas as coordenadorias</option>
                                {coordinations.map(c => (
                                    <option key={c.id} value={c.id}>{c.acronym} — {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-center">
                            <button className="btn btn-outline-secondary w-100 text-nowrap" onClick={clearFilters}>
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
                                <th>Professor</th>
                                <th>Matrícula</th>
                                <th>Telefone</th>
                                <th>Coordenadoria</th>
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
                                        Nenhum professor encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(p => {
                                    const coord = coordinations.find(c => c.id === p.coordinationId);
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Avatar name={p.name} variant="professor" size="sm" />
                                                    <div>
                                                        <div className="fw-semibold">{p.name}</div>
                                                        <div className="text-muted small">{p.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align-middle">{p.registration}</td>
                                            <td className="align-middle">{p.telephone}</td>
                                            <td className="align-middle">{coord?.acronym ?? '—'}</td>
                                            <td className="align-middle text-end">
                                                <Link to={`/professors/${p.id}`} className="btn btn-sm btn-outline-dark">
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            {filtered.length} professor{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
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

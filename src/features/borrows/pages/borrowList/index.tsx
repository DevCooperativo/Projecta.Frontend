import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { borrowsServices } from '@/api/borrows/implementation/borrowsServices';
import type { BorrowResponse } from '@/api/borrows/iBorrowsServices';
import { useAuth } from '@/context/auth/useAuth';

const PAGE_SIZE = 10;

export const BorrowList = () => {
    const { user } = useAuth();
    const canCreate = user?.profileType !== 'admin';
    const [borrows, setBorrows] = useState<BorrowResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [borrowerTypeFilter, setBorrowerTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    const today = new Date().toISOString().slice(0, 10);

    const fetchBorrows = () => {
        setLoading(true);
        borrowsServices.list({
            startPeriod: dateFrom || undefined,
            endPeriod: dateTo || undefined,
        })
            .then(x => x.data && setBorrows(x.data))
            .catch(() => setError('Não foi possível carregar os empréstimos.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBorrows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return borrows.filter(b =>
            (q === '' || (b.equipmentName ?? '').toLowerCase().includes(q) || (b.professor?.name ?? b.student?.name ?? '').toLowerCase().includes(q)) &&
            (borrowerTypeFilter === '' || (borrowerTypeFilter === 'professor' ? b.professor != null : b.student != null)) &&
            (statusFilter === '' || (statusFilter === 'pending' ? b.isStillBorrowed : !b.isStillBorrowed))
        );
    }, [borrows, search, borrowerTypeFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch('');
        setBorrowerTypeFilter('');
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        setPage(1);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item active">Empréstimos</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Empréstimos</h4>
                </div>
                {canCreate && (
                    <Link to="/borrows/new" className="btn btn-dark">
                        + Novo empréstimo
                    </Link>
                )}
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por equipamento ou tomador..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={borrowerTypeFilter}
                                onChange={e => { setBorrowerTypeFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todos os tomadores</option>
                                <option value="professor">Professor</option>
                                <option value="student">Aluno</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todos os status</option>
                                <option value="pending">Pendente</option>
                                <option value="completed">Concluído</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                title="Data de início"
                                value={dateFrom}
                                onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="date"
                                className="form-control"
                                title="Data de término"
                                value={dateTo}
                                onChange={e => { setDateTo(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                                Limpar filtros
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
                                <th>Equipamento</th>
                                <th>Tomador</th>
                                <th>Data de empréstimo</th>
                                <th>Devolução prevista</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">Carregando...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-danger py-4">{error}</td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">
                                        Nenhum empréstimo encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(b => {
                                    const overdue = b.isStillBorrowed && b.expectedReturnDate != null && b.expectedReturnDate < today;
                                    return (
                                        <tr key={b.id}>
                                            <td className="align-middle">{b.equipmentName ?? `Equipamento #${b.equipmentId}`}</td>
                                            <td className="align-middle">
                                                {b.professor?.name ?? b.student?.name ?? '—'}
                                                {(b.professor || b.student) && (
                                                    <span className="badge bg-secondary-subtle text-secondary ms-2 fw-normal">
                                                        {b.professor ? 'Professor' : 'Aluno'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="align-middle">{b.borrowDate}</td>
                                            <td className="align-middle">
                                                {b.expectedReturnDate ? (
                                                    <>
                                                        <span className={overdue ? 'text-danger fw-semibold' : ''}>
                                                            {b.expectedReturnDate}
                                                        </span>
                                                        {overdue && <span className="badge bg-danger-subtle text-danger ms-2 fw-normal">Atrasado</span>}
                                                    </>
                                                ) : '—'}
                                            </td>
                                            <td className="align-middle"><StatusBadge status={b.isStillBorrowed ? 'pending' : 'completed'} /></td>
                                            <td className="align-middle text-end">
                                                {(() => {
                                                    const isAdmin = user?.profileType === 'admin';
                                                    const isCreator = b.professor?.id === user?.id || b.student?.id === user?.id;
                                                    const canAccess = isAdmin || isCreator;
                                                    return (
                                                        <div className="d-flex gap-2 justify-content-end">
                                                            {canAccess && (
                                                                <Link to={`/borrows/${b.id}`} className="btn btn-sm btn-outline-secondary">
                                                                    Ver
                                                                </Link>
                                                            )}
                                                            {canAccess && b.isStillBorrowed && (
                                                                <Link to={`/borrows/${b.id}/close`} className="btn btn-sm btn-outline-dark">
                                                                    {isAdmin ? 'Encerrar' : 'Devolver'}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
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
                            {filtered.length} empréstimo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
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

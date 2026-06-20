import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coordinationsServices } from '@/api/coordinations/implementation/coordinationsServices';
import type { CoordinationResponse } from '@/api/coordinations/iCoordinationsServices';

const PAGE_SIZE = 10;

const BLOCKS = ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10'];

export const CoordinationList = () => {
    const [coordinations, setCoordinations] = useState<CoordinationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [blockFilter, setBlockFilter] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        coordinationsServices.list()
            .then(x => x.data && setCoordinations(x.data))
            .catch(() => setError('Não foi possível carregar as coordenadorias.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return coordinations.filter(c =>
            (q === '' || c.area.toLowerCase().includes(q)) &&
            (blockFilter === '' || c.block === blockFilter)
        );
    }, [coordinations, search, blockFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch('');
        setBlockFilter('');
        setPage(1);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item active">Coordenadorias</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Coordenadorias</h4>
                </div>
                <Link to="/coordinations/new" className="btn btn-dark">
                    + Nova coordenadoria
                </Link>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por área..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={blockFilter}
                                onChange={e => { setBlockFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todos os blocos</option>
                                {BLOCKS.map(b => (
                                    <option key={b} value={b}>{b}</option>
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
                                <th>Área</th>
                                <th>Bloco</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-4">Carregando...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-danger py-4">{error}</td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-muted py-4">
                                        Nenhuma coordenadoria encontrada.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(c => (
                                    <tr key={c.id}>
                                        <td className="align-middle fw-semibold">{c.area}</td>
                                        <td className="align-middle">
                                            <span className="badge bg-light text-dark border">{c.block}</span>
                                        </td>
                                        <td className="align-middle text-end">
                                            <Link to={`/coordinations/${c.id}`} className="btn btn-sm btn-outline-dark">
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
                            {filtered.length} coordenadoria{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
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

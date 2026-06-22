import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import { useAuth } from '@/context/auth/useAuth';

const PAGE_SIZE = 10;

export const LaboratoryList = () => {
    const { user } = useAuth();
    const canManage = user?.profileType === 'professor';
    const [items, setItems] = useState<LaboratoryResponse[]>([]);
    const [professorNames, setProfessorNames] = useState<Map<number, string>>(new Map());
    const [search, setSearch] = useState('');
    const [storageFilter, setStorageFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([laboratoriesServices.list(), professorsServices.list()])
            .then(([labs, professors]) => {
                setItems(labs.data ?? []);
                setProfessorNames(new Map((professors.data ?? []).map(p => [p.id, p.name])));
            }).catch(() => setError('Não foi possível carregar os laboratórios.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => items.filter(item => {
        const q = search.toLowerCase();
        const responsible = professorNames.get(item.professorId) ?? '';
        return (!q || item.name.toLowerCase().includes(q) || responsible.toLowerCase().includes(q)) &&
            (!storageFilter || String(item.storageSpace) === storageFilter);
    }), [items, professorNames, search, storageFilter]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return <>
        <div className="d-flex justify-content-between align-items-start mb-4"><div>
            <nav><ol className="breadcrumb mb-1 small"><li className="breadcrumb-item"><Link to="/">Início</Link></li><li className="breadcrumb-item active">Laboratórios</li></ol></nav>
            <h4 className="fw-bold mb-0">Laboratórios</h4>
        </div>{canManage && <Link to="/laboratories/new" className="btn btn-dark">+ Novo laboratório</Link>}</div>
        <div className="card mb-4"><div className="card-body"><div className="row g-3">
            <div className="col-md-7"><input className="form-control" type="search" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nome ou responsável..." /></div>
            <div className="col-md-3"><select className="form-select" value={storageFilter} onChange={e => { setStorageFilter(e.target.value); setPage(1); }}><option value="">Todos</option><option value="true">Com armazenamento</option><option value="false">Sem armazenamento</option></select></div>
            <div className="col-md-2"><button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setStorageFilter(''); setPage(1); }}>Limpar</button></div>
        </div></div></div>
        <div className="card"><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Laboratório</th><th>Responsável</th><th>Capacidade</th><th>Armazenamento</th><th /></tr></thead><tbody>
            {loading ? <tr><td colSpan={5} className="text-center text-muted py-4">Carregando...</td></tr> : error ? <tr><td colSpan={5} className="text-center text-danger py-4">{error}</td></tr> : paginated.length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-4">Nenhum laboratório encontrado.</td></tr> : paginated.map(item => <tr key={item.id}>
                <td className="fw-semibold">{item.name}</td><td>{professorNames.get(item.professorId) ?? `Professor #${item.professorId}`}</td><td>{item.maxOccupants} pessoas</td>
                <td><span className={`badge ${item.storageSpace ? 'bg-success-subtle text-success' : 'bg-light text-secondary'} border`}>{item.storageSpace ? 'Disponível' : 'Não possui'}</span></td>
                <td className="text-end"><Link className="btn btn-sm btn-outline-dark" to={`/laboratories/${item.id}`}>Ver</Link></td>
            </tr>)}
        </tbody></table></div>
            {totalPages > 1 && <div className="card-footer bg-white d-flex justify-content-between align-items-center"><small className="text-muted">{filtered.length} resultado(s)</small><ul className="pagination pagination-sm mb-0">{Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <li key={p} className={`page-item ${p === page ? 'active' : ''}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>)}</ul></div>}
        </div>
    </>;
};

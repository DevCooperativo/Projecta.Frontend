import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProjectCategoryResponse } from '@/api/projectCategories/iProjectCategoriesServices';
import { projectCategoriesServices } from '@/api/projectCategories/implementation/projectCategoriesServices';
import { useAuth } from '@/context/auth/useAuth';

const PAGE_SIZE = 10;

export const ProjectCategoryList = () => {
    const { user } = useAuth(); const canManage = user?.profileType === 'professor';
    const [items, setItems] = useState<ProjectCategoryResponse[]>([]);
    const [search, setSearch] = useState(''); const [area, setArea] = useState(''); const [commercial, setCommercial] = useState(''); const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
    useEffect(() => { projectCategoriesServices.list().then(r => setItems(r.data ?? [])).catch(() => setError('Não foi possível carregar as categorias.')).finally(() => setLoading(false)); }, []);
    const areas = useMemo(() => [...new Set(items.map(i => i.area))].sort((a, b) => a.localeCompare(b, 'pt-BR')), [items]);
    const filtered = useMemo(() => items.filter(i => {
        const q = search.toLowerCase();
        return (!q || `${i.name} ${i.description}`.toLowerCase().includes(q)) && (!area || i.area === area) && (!commercial || String(i.commerciallyRelevant) === commercial);
    }).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')), [items, search, area, commercial]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const clear = () => { setSearch(''); setArea(''); setCommercial(''); setPage(1); };
    return <>
        <div className="d-flex justify-content-between align-items-start mb-4"><div><nav><ol className="breadcrumb mb-1 small"><li className="breadcrumb-item"><Link to="/">Início</Link></li><li className="breadcrumb-item active">Categorias de projetos</li></ol></nav><h4 className="fw-bold mb-0">Categorias de projetos</h4></div>{canManage && <Link className="btn btn-dark" to="/project-categories/new">+ Nova categoria</Link>}</div>
        <div className="card mb-4"><div className="card-body"><div className="row g-3">
            <div className="col-lg-5"><input type="search" className="form-control" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nome ou descrição..." /></div>
            <div className="col-lg-3"><select className="form-select" value={area} onChange={e => { setArea(e.target.value); setPage(1); }}><option value="">Todas as áreas</option>{areas.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
            <div className="col-lg-2"><select className="form-select" value={commercial} onChange={e => { setCommercial(e.target.value); setPage(1); }}><option value="">Todas</option><option value="true">Relevância comercial</option><option value="false">Sem relevância comercial</option></select></div>
            <div className="col-lg-2"><button className="btn btn-outline-secondary w-100" onClick={clear}>Limpar</button></div>
        </div></div></div>
        <div className="card"><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>Categoria</th><th>Área do conhecimento</th><th>Relevância comercial</th><th /></tr></thead><tbody>
            {loading ? <tr><td colSpan={4} className="text-center text-muted py-4">Carregando...</td></tr> : error ? <tr><td colSpan={4} className="text-center text-danger py-4">{error}</td></tr> : rows.length === 0 ? <tr><td colSpan={4} className="text-center text-muted py-4">Nenhuma categoria encontrada.</td></tr> : rows.map(i => <tr key={i.id}><td><div className="fw-semibold">{i.name}</div><small className="text-muted">{i.description}</small></td><td>{i.area}</td><td><span className={`badge border ${i.commerciallyRelevant ? 'bg-success-subtle text-success' : 'bg-light text-secondary'}`}>{i.commerciallyRelevant ? 'Sim' : 'Não'}</span></td><td className="text-end"><Link className="btn btn-sm btn-outline-dark" to={`/project-categories/${i.id}`}>Ver</Link></td></tr>)}
        </tbody></table></div>{totalPages > 1 && <div className="card-footer bg-white d-flex justify-content-between align-items-center"><small className="text-muted">{filtered.length} resultado(s)</small><ul className="pagination pagination-sm mb-0">{Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <li key={p} className={`page-item ${p === page ? 'active' : ''}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>)}</ul></div>}</div>
    </>;
};

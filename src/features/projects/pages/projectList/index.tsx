import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import { projectsServices } from '@/api/projects/implementation/projectsServices';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import { projectCategoriesServices } from '@/api/projectCategories/implementation/projectCategoriesServices';
import type { ProjectResponse } from '@/api/projects/iProjectsServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import type { ProjectCategoryResponse } from '@/api/projectCategories/iProjectCategoriesServices';
import { StatusBadge } from '@/components/StatusBadge';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
    { value: 'active', label: 'Em andamento' },
    { value: 'completed', label: 'Concluído' },
    { value: 'inactive', label: 'Inativo' },
];

export const ProjectList = () => {
    const { user } = useAuth();
    const canManage = user?.profileType === 'professor';
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [laboratories, setLaboratories] = useState<LaboratoryResponse[]>([]);
    const [categories, setCategories] = useState<ProjectCategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [labFilter, setLabFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        Promise.all([
            projectsServices.list(),
            laboratoriesServices.list(),
            projectCategoriesServices.list(),
        ])
            .then(([p, l, c]) => {
                if (p.data) setProjects(p.data);
                if (l.data) setLaboratories(l.data);
                if (c.data) setCategories(c.data);
            })
            .catch(() => setError('Não foi possível carregar os projetos.'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return projects.filter(p =>
            (q === '' || p.name.toLowerCase().includes(q)) &&
            (categoryFilter === '' || p.projectCategoryId === Number(categoryFilter)) &&
            (labFilter === '' || p.laboratoryId === Number(labFilter)) &&
            (statusFilter === '' || p.status === statusFilter)
        );
    }, [projects, search, categoryFilter, labFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const clearFilters = () => {
        setSearch('');
        setCategoryFilter('');
        setLabFilter('');
        setStatusFilter('');
        setPage(1);
    };

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name ?? `#${id}`;
    const getLabName = (id: number) => laboratories.find(l => l.id === id)?.name ?? `#${id}`;

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item active">Projetos</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Projetos</h4>
                </div>
                {canManage && (
                    <Link to="/projects/new" className="btn btn-dark">
                        + Novo projeto
                    </Link>
                )}
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por nome..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={categoryFilter}
                                onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todas as categorias</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">Todos os status</option>
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
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
                                <th>Projeto</th>
                                <th>Categoria</th>
                                <th>Laboratório</th>
                                <th className="text-center">Participantes</th>
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
                                        Nenhum projeto encontrado.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(p => (
                                    <tr key={p.id}>
                                        <td className="align-middle fw-semibold">{p.name}</td>
                                        <td className="align-middle">{getCategoryName(p.projectCategoryId)}</td>
                                        <td className="align-middle">{getLabName(p.laboratoryId)}</td>
                                        <td className="align-middle text-center">
                                            {p.participantCount ?? '—'}
                                        </td>
                                        <td className="align-middle">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="align-middle text-end">
                                            <Link to={`/projects/${p.id}`} className="btn btn-sm btn-outline-dark">
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
                            {filtered.length} projeto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
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

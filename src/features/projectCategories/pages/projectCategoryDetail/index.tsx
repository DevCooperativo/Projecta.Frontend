import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ProjectCategoryResponse } from '@/api/projectCategories/iProjectCategoriesServices';
import { projectCategoriesServices } from '@/api/projectCategories/implementation/projectCategoriesServices';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useAuth } from '@/context/auth/useAuth';

const formatDate = (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-';

export const ProjectCategoryDetail = () => {
    const { user } = useAuth(); const canManage = user?.profileType === 'professor';
    const { id } = useParams(); const navigate = useNavigate();
    const [item, setItem] = useState<ProjectCategoryResponse | null>(null); const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false); const [error, setError] = useState<string | null>(null);
    useEffect(() => { if (id) projectCategoriesServices.get(Number(id)).then(r => setItem(r.data ?? null)).catch(() => setItem(null)).finally(() => setLoading(false)); }, [id]);
    if (loading) return <div className="text-center text-muted py-5">Carregando...</div>;
    if (!item) return <div className="text-center text-muted py-5">Categoria não encontrada. <Link to="/project-categories">Voltar</Link></div>;
    const remove = async () => { try { await projectCategoriesServices.remove(item.id); navigate('/project-categories'); } catch { setShowModal(false); setError('Não foi possível excluir esta categoria. Verifique se existem projetos associados.'); } };
    return <>
        <div className="d-flex justify-content-between align-items-start mb-4"><div><nav><ol className="breadcrumb mb-1 small"><li className="breadcrumb-item"><Link to="/">Início</Link></li><li className="breadcrumb-item"><Link to="/project-categories">Categorias de projetos</Link></li><li className="breadcrumb-item active">{item.name}</li></ol></nav><h4 className="fw-bold mb-0">{item.name}</h4><span className="badge bg-light text-dark border mt-1">{item.area}</span></div>{canManage && <div className="d-flex gap-2"><Link className="btn btn-outline-dark" to={`/project-categories/${item.id}/edit`} state={{ category: item }}>Editar</Link><button className="btn btn-outline-danger" onClick={() => setShowModal(true)}>Excluir</button></div>}</div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-4"><div className="col-lg-8"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados da categoria</h6><div className="row g-3"><div className="col-md-6"><p className="text-muted small mb-1">Nome</p><p className="fw-semibold mb-0">{item.name}</p></div><div className="col-md-6"><p className="text-muted small mb-1">Área do conhecimento</p><p className="mb-0">{item.area}</p></div><div className="col-12"><p className="text-muted small mb-1">Descrição</p><p className="mb-0">{item.description}</p></div></div></div></div></div><div className="col-lg-4"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Informações</h6><p className="text-muted small mb-1">Relevância comercial</p><p><span className={`badge border ${item.commerciallyRelevant ? 'bg-success-subtle text-success' : 'bg-light text-secondary'}`}>{item.commerciallyRelevant ? 'Sim' : 'Não'}</span></p><p className="text-muted small mb-1">Cadastrada em</p><p>{formatDate(item.createdAt)}</p><p className="text-muted small mb-1">Atualizada em</p><p className="mb-0">{formatDate(item.updatedAt)}</p></div></div></div></div>
        <ConfirmModal show={showModal} title="Excluir categoria" message={`Tem certeza que deseja excluir "${item.name}"? Esta ação não pode ser desfeita.`} confirmLabel="Excluir" onConfirm={remove} onCancel={() => setShowModal(false)} />
    </>;
};

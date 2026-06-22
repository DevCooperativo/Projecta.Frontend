import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useAuth } from '@/context/auth/useAuth';
import { StatusBadge } from '@/components/StatusBadge';
import { projectsServices } from '@/api/projects/implementation/projectsServices';
import { coordinatorsServices } from '@/api/coordinators/implementation/coordinatorsServices';
import { researchersServices } from '@/api/researchers/implementation/researchersServices';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import { projectCategoriesServices } from '@/api/projectCategories/implementation/projectCategoriesServices';
import type { ProjectResponse } from '@/api/projects/iProjectsServices';
import type { CoordinatorResponse } from '@/api/coordinators/iCoordinatorsServices';
import type { ResearcherResponse } from '@/api/researchers/iResearchersServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import type { ProjectCategoryResponse } from '@/api/projectCategories/iProjectCategoriesServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';

export const ProjectDetail = () => {
    const { user } = useAuth();
    const canManage = user?.profileType === 'professor';
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [coordinators, setCoordinators] = useState<CoordinatorResponse[]>([]);
    const [researchers, setResearchers] = useState<ResearcherResponse[]>([]);
    const [professors, setProfessors] = useState<ProfessorResponse[]>([]);
    const [laboratories, setLaboratories] = useState<LaboratoryResponse[]>([]);
    const [categories, setCategories] = useState<ProjectCategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const projectId = Number(id);
        Promise.all([
            projectsServices.get(projectId),
            coordinatorsServices.list(),
            researchersServices.list(),
            professorsServices.list(),
            laboratoriesServices.list(),
            projectCategoriesServices.list(),
        ])
            .then(([p, c, r, prof, labs, cats]) => {
                if (p.data) setProject(p.data);
                if (c.data) setCoordinators(c.data.filter(x => x.projectId === projectId));
                if (r.data) setResearchers(r.data.filter(x => x.projectId === projectId));
                if (prof.data) setProfessors(prof.data);
                if (labs.data) setLaboratories(labs.data);
                if (cats.data) setCategories(cats.data);
            })
            .catch(() => setProject(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    if (!project) {
        return (
            <div className="text-center py-5 text-muted">
                Projeto não encontrado.{' '}
                <Link to="/projects">Voltar para a lista</Link>
            </div>
        );
    }

    const categoryName = categories.find(c => c.id === project.projectCategoryId)?.name ?? `#${project.projectCategoryId}`;
    const labName = laboratories.find(l => l.id === project.laboratoryId)?.name ?? `#${project.laboratoryId}`;
    const getProfessorName = (professorId: number) => professors.find(p => p.id === professorId)?.name ?? `Professor #${professorId}`;
    const getProfessorEmail = (professorId: number) => professors.find(p => p.id === professorId)?.email ?? '';

    const handleDelete = async () => {
        try {
            await projectsServices.remove(project.id);
            navigate('/projects');
        } catch {
            setDeleteError('Não foi possível excluir este projeto.');
            setShowDeleteModal(false);
        }
    };

    const participantCount = coordinators.length + researchers.length;

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/projects">Projetos</Link></li>
                            <li className="breadcrumb-item active">{project.name}</li>
                        </ol>
                    </nav>
                    <div className="d-flex align-items-center gap-2">
                        <h4 className="fw-bold mb-0">{project.name}</h4>
                        <StatusBadge status={project.status} />
                    </div>
                </div>
                {canManage && (
                    <div className="d-flex gap-2">
                        <Link to={`/projects/${project.id}/edit`} className="btn btn-outline-dark">
                            Editar
                        </Link>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => { setDeleteError(null); setShowDeleteModal(true); }}
                        >
                            Excluir
                        </button>
                    </div>
                )}
            </div>

            {deleteError && <div className="alert alert-danger mb-4">{deleteError}</div>}

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card mb-3">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Dados do projeto</h6>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Categoria</p>
                                    <p className="fw-semibold mb-0">{categoryName}</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Laboratório</p>
                                    <p className="fw-semibold mb-0">{labName}</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Data de início</p>
                                    <p className="fw-semibold mb-0">{project.startDate}</p>
                                </div>
                                {project.endDate && (
                                    <div className="col-sm-6">
                                        <p className="text-muted small mb-1">Data de término</p>
                                        <p className="fw-semibold mb-0">{project.endDate}</p>
                                    </div>
                                )}
                                {project.description && (
                                    <div className="col-12">
                                        <p className="text-muted small mb-1">Descrição</p>
                                        <p className="mb-0">{project.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Coordenadores</h6>
                            {coordinators.length === 0 ? (
                                <p className="text-muted small mb-0">Nenhum coordenador vinculado.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nome</th>
                                                <th>E-mail</th>
                                                <th>Área</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coordinators.map(c => (
                                                <tr key={c.id}>
                                                    <td className="align-middle fw-semibold">{getProfessorName(c.professorId)}</td>
                                                    <td className="align-middle text-muted">{getProfessorEmail(c.professorId)}</td>
                                                    <td className="align-middle">{c.area}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Pesquisadores</h6>
                            {researchers.length === 0 ? (
                                <p className="text-muted small mb-0">Nenhum pesquisador vinculado.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nome</th>
                                                <th>Função</th>
                                                <th className="text-center">Horas/sem.</th>
                                                <th>Tipo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {researchers.map(r => (
                                                <tr key={r.id}>
                                                    <td className="align-middle fw-semibold">{r.name}</td>
                                                    <td className="align-middle">{r.functionName}</td>
                                                    <td className="align-middle text-center">{r.weeklyHours}h</td>
                                                    <td className="align-middle">
                                                        <span className="badge bg-light text-dark border">
                                                            {r.professorId ? 'Professor' : 'Aluno'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Informações do registro</h6>
                            <div className="mb-2">
                                <p className="text-muted small mb-0">Status</p>
                                <StatusBadge status={project.status} />
                            </div>
                            <div className="mb-2">
                                <p className="text-muted small mb-0">Total de participantes</p>
                                <p className="fw-semibold mb-0">{participantCount}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-muted small mb-0">Cadastrado em</p>
                                <p className="mb-0">{project.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-muted small mb-0">Atualizado em</p>
                                <p className="mb-0">{project.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showDeleteModal}
                title="Excluir projeto"
                message={`Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
};

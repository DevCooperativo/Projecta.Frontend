import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import {
    projectCreateSchema,
    projectEditSchema,
    type ProjectCreateValues,
    type ProjectEditValues,
} from '@/schemas/projects/projectSchema';
import type { ApiResponse } from '@/api/abstractions/apiResponse';
import { projectsServices } from '@/api/projects/implementation/projectsServices';
import { coordinatorsServices } from '@/api/coordinators/implementation/coordinatorsServices';
import { researchersServices } from '@/api/researchers/implementation/researchersServices';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import { projectCategoriesServices } from '@/api/projectCategories/implementation/projectCategoriesServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProjectResponse } from '@/api/projects/iProjectsServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import type { ProjectCategoryResponse } from '@/api/projectCategories/iProjectCategoriesServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';
import { AddCoordinatorModal, type AddCoordinatorResult } from '../AddCoordinatorModal';
import { AddResearcherModal, type AddResearcherResult } from '../AddResearcherModal';

function extractApiError(err: unknown): string {
    const axiosErr = err as AxiosError<ApiResponse<unknown>>;
    const data = axiosErr?.response?.data;
    if (!data) return 'Ocorreu um erro ao salvar. Tente novamente.';
    if (data.details && data.details.length > 0) {
        return data.details.map(d => d.field ? `${d.field}: ${d.reason}` : d.reason).join(' • ');
    }
    return data.message ?? 'Ocorreu um erro ao salvar. Tente novamente.';
}

interface LocalCoordinator {
    id?: number;
    professorId: number;
    professorName: string;
    professorEmail: string;
    area: string;
    startDate: string;
    endDate?: string;
}

interface LocalResearcher {
    id?: number;
    personType: 'professor' | 'student';
    personId: number;
    personName: string;
    functionName: string;
    weeklyHours: number;
    startDate: string;
    endDate?: string;
}

interface ProjectFormProps {
    mode: 'new' | 'edit';
    projectId?: number;
}

export const ProjectForm = ({ mode, projectId }: ProjectFormProps) => {
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectResponse | null>(null);
    const [laboratories, setLaboratories] = useState<LaboratoryResponse[]>([]);
    const [categories, setCategories] = useState<ProjectCategoryResponse[]>([]);
    const [localCoordinators, setLocalCoordinators] = useState<LocalCoordinator[]>([]);
    const [localResearchers, setLocalResearchers] = useState<LocalResearcher[]>([]);
    const [showCoordModal, setShowCoordModal] = useState(false);
    const [showResearcherModal, setShowResearcherModal] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [coordError, setCoordError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const schema = mode === 'new' ? projectCreateSchema : projectEditSchema;

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm<ProjectCreateValues | ProjectEditValues>({
            resolver: yupResolver(schema) as Resolver<ProjectCreateValues | ProjectEditValues>,
        });

    useEffect(() => {
        const loadDropdowns = Promise.all([
            laboratoriesServices.list(),
            projectCategoriesServices.list(),
        ]).then(([l, c]) => {
            if (l.data) setLaboratories(l.data);
            if (c.data) setCategories(c.data);
        });

        if (mode === 'edit' && projectId != null) {
            Promise.all([
                loadDropdowns,
                projectsServices.get(projectId),
                coordinatorsServices.list(),
                researchersServices.list(),
                professorsServices.list(),
            ]).then(([, p, coords, researchers, profs]) => {
                if (p.data) {
                    setProject(p.data);
                    reset({
                        name: p.data.name,
                        description: p.data.description,
                        startDate: p.data.startDate?.split('T')[0] ?? p.data.startDate,
                        endDate: p.data.endDate?.split('T')[0] ?? undefined,
                        status: p.data.status,
                        laboratoryId: p.data.laboratoryId,
                        projectCategoryId: p.data.projectCategoryId,
                    });
                }
                const profMap = new Map<number, ProfessorResponse>(
                    (profs.data ?? []).map(x => [x.id, x])
                );
                if (coords.data) {
                    setLocalCoordinators(
                        coords.data
                            .filter(c => c.projectId === projectId)
                            .map(c => ({
                                id: c.id,
                                professorId: c.professorId,
                                professorName: profMap.get(c.professorId)?.name ?? `Professor #${c.professorId}`,
                                professorEmail: profMap.get(c.professorId)?.email ?? '',
                                area: c.area,
                                startDate: c.startDate,
                                endDate: c.endDate,
                            }))
                    );
                }
                if (researchers.data) {
                    setLocalResearchers(
                        researchers.data
                            .filter(r => r.projectId === projectId)
                            .map(r => ({
                                id: r.id,
                                personType: r.professorId ? 'professor' : 'student',
                                personId: (r.professorId ?? r.studentId)!,
                                personName: r.name,
                                functionName: r.functionName,
                                weeklyHours: r.weeklyHours,
                                startDate: r.startDate,
                                endDate: r.endDate,
                            }))
                    );
                }
            }).catch(() => {
                setServerError('Não foi possível carregar os dados do projeto.');
            });
        } else {
            loadDropdowns.catch(() => {
                setServerError('Não foi possível carregar os dados do formulário.');
            });
        }
    }, [mode, projectId, reset]);

    const handleAddCoordinator = async (data: AddCoordinatorResult) => {
        if (mode === 'edit' && projectId != null) {
            try {
                const resp = await coordinatorsServices.create({
                    area: data.area,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    professorId: data.professorId,
                    projectId,
                });
                if (resp.data) {
                    setLocalCoordinators(prev => [...prev, { ...data, id: resp.data!.id }]);
                }
            } catch (err) {
                setServerError(extractApiError(err));
            }
        } else {
            setLocalCoordinators(prev => [...prev, data]);
        }
        setShowCoordModal(false);
        setCoordError(null);
    };

    const handleRemoveCoordinator = async (index: number) => {
        const coord = localCoordinators[index];
        if (mode === 'edit' && coord.id != null) {
            try {
                await coordinatorsServices.remove(coord.id);
            } catch (err) {
                setServerError(extractApiError(err));
                return;
            }
        }
        setLocalCoordinators(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddResearcher = async (data: AddResearcherResult) => {
        if (mode === 'edit' && projectId != null) {
            try {
                const resp = await researchersServices.create({
                    name: data.personName,
                    functionName: data.functionName,
                    weeklyHours: data.weeklyHours,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    projectId,
                    professorId: data.personType === 'professor' ? data.personId : undefined,
                    studentId: data.personType === 'student' ? data.personId : undefined,
                });
                if (resp.data) {
                    setLocalResearchers(prev => [...prev, { ...data, id: resp.data!.id }]);
                }
            } catch (err) {
                setServerError(extractApiError(err));
            }
        } else {
            setLocalResearchers(prev => [...prev, data]);
        }
        setShowResearcherModal(false);
    };

    const handleRemoveResearcher = async (index: number) => {
        const researcher = localResearchers[index];
        if (mode === 'edit' && researcher.id != null) {
            try {
                await researchersServices.remove(researcher.id);
            } catch (err) {
                setServerError(extractApiError(err));
                return;
            }
        }
        setLocalResearchers(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ProjectCreateValues | ProjectEditValues) => {
        if (localCoordinators.length === 0) {
            setCoordError('É necessário adicionar ao menos um coordenador.');
            return;
        }
        setServerError(null);
        setCoordError(null);
        setLoading(true);
        try {
            if (mode === 'new') {
                await projectsServices.create({
                    ...data,
                    coordinators: localCoordinators.map(c => ({
                        area: c.area,
                        startDate: c.startDate,
                        endDate: c.endDate,
                        professorId: c.professorId,
                    })),
                    researchers: localResearchers.map(r => ({
                        name: r.personName,
                        functionName: r.functionName,
                        weeklyHours: r.weeklyHours,
                        startDate: r.startDate,
                        endDate: r.endDate,
                        professorId: r.personType === 'professor' ? r.personId : undefined,
                        studentId: r.personType === 'student' ? r.personId : undefined,
                    })),
                });
                navigate('/projects');
            } else if (projectId != null) {
                await projectsServices.update(projectId, data);
                navigate(`/projects/${projectId}`);
            }
        } catch (err) {
            setServerError(extractApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'new' ? 'Novo projeto' : 'Editar projeto';

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/projects">Projetos</Link></li>
                            {mode === 'edit' && project && (
                                <li className="breadcrumb-item">
                                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                                </li>
                            )}
                            <li className="breadcrumb-item active">{mode === 'new' ? 'Novo' : 'Editar'}</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">{title}</h4>
                </div>
            </div>

            {serverError && <div className="alert alert-danger mb-4">{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3 mb-3">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Dados do projeto</h6>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="name">Nome</label>
                                        <input
                                            {...register('name')}
                                            id="name"
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="projectCategoryId">Categoria</label>
                                        <select
                                            {...register('projectCategoryId', { valueAsNumber: true })}
                                            id="projectCategoryId"
                                            className={`form-select ${errors.projectCategoryId ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        {errors.projectCategoryId && <div className="invalid-feedback">{errors.projectCategoryId.message}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="laboratoryId">Laboratório</label>
                                        <select
                                            {...register('laboratoryId', { valueAsNumber: true })}
                                            id="laboratoryId"
                                            className={`form-select ${errors.laboratoryId ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {laboratories.map(l => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                        {errors.laboratoryId && <div className="invalid-feedback">{errors.laboratoryId.message}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="startDate">Data de início</label>
                                        <input
                                            {...register('startDate')}
                                            id="startDate"
                                            type="date"
                                            className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                                        />
                                        {errors.startDate && <div className="invalid-feedback">{errors.startDate.message}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="endDate">
                                            Data de término <span className="text-muted">(opcional)</span>
                                        </label>
                                        <input
                                            {...register('endDate')}
                                            id="endDate"
                                            type="date"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="description">Descrição</label>
                                        <textarea
                                            {...register('description')}
                                            id="description"
                                            rows={3}
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        />
                                        {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Configurações</h6>
                                <label className="form-label" htmlFor="status">Status</label>
                                <input
                                    {...register('status')}
                                    id="status"
                                    type="text"
                                    className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                />
                                {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? 'Salvando...' : mode === 'new' ? 'Salvar projeto' : 'Salvar alterações'}
                                </button>
                                <Link
                                    to={mode === 'edit' && projectId ? `/projects/${projectId}` : '/projects'}
                                    className="btn btn-outline-secondary w-100"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-semibold mb-0">Coordenadores</h6>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => setShowCoordModal(true)}
                            >
                                + Adicionar coordenador
                            </button>
                        </div>
                        {coordError && <div className="alert alert-warning py-2 mb-3">{coordError}</div>}
                        {localCoordinators.length === 0 ? (
                            <p className="text-muted small mb-0">Nenhum coordenador adicionado. É obrigatório ao menos um.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Professor</th>
                                            <th>E-mail</th>
                                            <th>Área</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localCoordinators.map((c, i) => (
                                            <tr key={i}>
                                                <td className="align-middle fw-semibold">{c.professorName}</td>
                                                <td className="align-middle text-muted">{c.professorEmail}</td>
                                                <td className="align-middle">{c.area}</td>
                                                <td className="align-middle text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleRemoveCoordinator(i)}
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
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
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-semibold mb-0">Pesquisadores</h6>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => setShowResearcherModal(true)}
                            >
                                + Adicionar pesquisador
                            </button>
                        </div>
                        {localResearchers.length === 0 ? (
                            <p className="text-muted small mb-0">Nenhum pesquisador adicionado.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Função</th>
                                            <th className="text-center">Horas/sem.</th>
                                            <th>Tipo</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localResearchers.map((r, i) => (
                                            <tr key={i}>
                                                <td className="align-middle fw-semibold">{r.personName}</td>
                                                <td className="align-middle">{r.functionName}</td>
                                                <td className="align-middle text-center">{r.weeklyHours}h</td>
                                                <td className="align-middle">
                                                    <span className="badge bg-light text-dark border">
                                                        {r.personType === 'professor' ? 'Professor' : 'Aluno'}
                                                    </span>
                                                </td>
                                                <td className="align-middle text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleRemoveResearcher(i)}
                                                    >
                                                        Remover
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <AddCoordinatorModal
                show={showCoordModal}
                onClose={() => setShowCoordModal(false)}
                onAdd={handleAddCoordinator}
            />
            <AddResearcherModal
                show={showResearcherModal}
                onClose={() => setShowResearcherModal(false)}
                onAdd={handleAddResearcher}
            />
        </>
    );
};

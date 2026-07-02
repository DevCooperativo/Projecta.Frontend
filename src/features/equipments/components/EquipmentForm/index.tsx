import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { EquipmentCategoryResponse } from '@/api/equipmentCategories/iEquipmentCategoriesServices';
import { equipmentCategoriesServices } from '@/api/equipmentCategories/implementation/equipmentCategoriesServices';
import type { EquipmentResponse } from '@/api/equipments/iEquipmentsServices';
import { equipmentsServices } from '@/api/equipments/implementation/equipmentsServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import type { ProjectResponse } from '@/api/projects/iProjectsServices';
import { projectsServices } from '@/api/projects/implementation/projectsServices';
import { equipmentSchema, type EquipmentValues } from '@/schemas/equipments/equipmentSchema';

interface Props {
    mode: 'new' | 'edit';
    equipmentId?: number;
}

const MAX_EQUIPMENTS_PER_LABORATORY = 50;

export const EquipmentForm = ({ mode, equipmentId }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefetched = (location.state as { equipment?: EquipmentResponse } | null)?.equipment;
    const [equipment, setEquipment] = useState<EquipmentResponse | null>(null);
    const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
    const [labs, setLabs] = useState<LaboratoryResponse[]>([]);
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [categories, setCategories] = useState<EquipmentCategoryResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<EquipmentValues>({ resolver: yupResolver(equipmentSchema) });

    const laboratoryId = watch('laboratoryId');

    const getLaboratoryEquipmentCount = (labId: number) =>
        equipments.filter(item => item.laboratoryId === labId && item.id !== equipmentId).length;

    const compatibleProjects = useMemo(
        () => projects.filter(project => !laboratoryId || project.laboratoryId === laboratoryId),
        [projects, laboratoryId],
    );

    const selectedLaboratory = useMemo(
        () => labs.find(lab => lab.id === Number(laboratoryId)),
        [labs, laboratoryId],
    );

    const selectedLaboratoryEquipmentCount = selectedLaboratory
        ? getLaboratoryEquipmentCount(selectedLaboratory.id)
        : 0;

    useEffect(() => {
        if (prefetched) {
            setEquipment(prefetched);
            reset({
                name: prefetched.name,
                laboratoryId: prefetched.laboratoryId,
                projectId: prefetched.projectId,
                equipmentCategoryId: prefetched.equipmentCategoryId,
            });
        }

        const requests: Promise<unknown>[] = [
            equipmentsServices.list().then(response => setEquipments(response.data ?? [])),
            laboratoriesServices.list().then(response => setLabs(response.data ?? [])),
            projectsServices.list().then(response => setProjects(response.data ?? [])),
            equipmentCategoriesServices.list().then(response => setCategories(response.data ?? [])),
        ];

        if (mode === 'edit' && equipmentId && !prefetched) {
            requests.push(equipmentsServices.get(equipmentId).then(response => {
                if (!response.data) return;
                setEquipment(response.data);
                reset({
                    name: response.data.name,
                    laboratoryId: response.data.laboratoryId,
                    projectId: response.data.projectId,
                    equipmentCategoryId: response.data.equipmentCategoryId,
                });
            }));
        }

        Promise.all(requests).catch(() => setError('Não foi possível carregar os dados do formulário.'));
    }, [mode, equipmentId, prefetched, reset]);

    const submit = async (values: EquipmentValues) => {
        setLoading(true);
        setError(null);

        try {
            const laboratory = labs.find(lab => lab.id === values.laboratoryId);
            const laboratoryEquipmentCount = getLaboratoryEquipmentCount(values.laboratoryId);

            if (laboratory && !laboratory.storageSpace) {
                setError('Não foi possível salvar o equipamento. O laboratório selecionado não possui espaço de armazenamento.');
                return;
            }

            if (laboratoryEquipmentCount >= MAX_EQUIPMENTS_PER_LABORATORY) {
                setError('Não foi possível salvar o equipamento. O laboratório selecionado já possui 50 equipamentos.');
                return;
            }

            if (mode === 'new') {
                await equipmentsServices.create(values);
                navigate('/equipments');
            } else if (equipmentId) {
                await equipmentsServices.update(equipmentId, values);
                navigate(`/equipments/${equipmentId}`);
            }
        } catch {
            setError('Não foi possível salvar o equipamento. Verifique os vínculos e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const laboratoryHelperText = () => {
        if (!selectedLaboratory) return null;

        if (!selectedLaboratory.storageSpace) {
            return 'Este laboratório não possui espaço de armazenamento.';
        }

        if (selectedLaboratoryEquipmentCount >= MAX_EQUIPMENTS_PER_LABORATORY) {
            return 'Este laboratório já atingiu o limite de 50 equipamentos.';
        }

        return `${selectedLaboratoryEquipmentCount} de 50 equipamentos cadastrados neste laboratório.`;
    };

    const hasLaboratoryWarning = selectedLaboratory
        ? !selectedLaboratory.storageSpace || selectedLaboratoryEquipmentCount >= MAX_EQUIPMENTS_PER_LABORATORY
        : false;

    return (
        <>
            <div className="mb-4">
                <nav>
                    <ol className="breadcrumb mb-1 small">
                        <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                        <li className="breadcrumb-item"><Link to="/equipments">Equipamentos</Link></li>
                        {equipment && <li className="breadcrumb-item"><Link to={`/equipments/${equipment.id}`}>{equipment.name}</Link></li>}
                        <li className="breadcrumb-item active">{mode === 'new' ? 'Novo' : 'Editar'}</li>
                    </ol>
                </nav>
                <h4 className="fw-bold mb-0">{mode === 'new' ? 'Novo equipamento' : 'Editar equipamento'}</h4>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit(submit)} noValidate>
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados do equipamento</h6>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold small" htmlFor="name">Nome</label>
                                        <input
                                            {...register('name')}
                                            id="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Ex: Osciloscópio Digital"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small" htmlFor="laboratoryId">Laboratório</label>
                                        <select
                                            {...register('laboratoryId', { valueAsNumber: true, onChange: () => setValue('projectId', Number.NaN) })}
                                            id="laboratoryId"
                                            className={`form-select ${errors.laboratoryId ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {labs.map(lab => {
                                                const count = getLaboratoryEquipmentCount(lab.id);
                                                const status = !lab.storageSpace
                                                    ? 'sem armazenamento'
                                                    : count >= MAX_EQUIPMENTS_PER_LABORATORY
                                                        ? 'limite atingido'
                                                        : `${count}/50`;

                                                return <option key={lab.id} value={lab.id}>{lab.name} ({status})</option>;
                                            })}
                                        </select>
                                        {errors.laboratoryId && <div className="invalid-feedback">{errors.laboratoryId.message}</div>}
                                        {selectedLaboratory && (
                                            <div className={`form-text ${hasLaboratoryWarning ? 'text-danger' : ''}`}>
                                                {laboratoryHelperText()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small" htmlFor="projectId">Projeto</label>
                                        <select
                                            {...register('projectId', { valueAsNumber: true })}
                                            id="projectId"
                                            disabled={!laboratoryId}
                                            className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">{laboratoryId ? 'Selecione...' : 'Selecione primeiro o laboratório'}</option>
                                            {compatibleProjects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                                        </select>
                                        {errors.projectId && <div className="invalid-feedback">{errors.projectId.message}</div>}
                                        <div className="form-text">Somente projetos vinculados ao laboratório selecionado são exibidos.</div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold small" htmlFor="equipmentCategoryId">Categoria</label>
                                        <select
                                            {...register('equipmentCategoryId', { valueAsNumber: true })}
                                            id="equipmentCategoryId"
                                            className={`form-select ${errors.equipmentCategoryId ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.description} - {category.powerSource}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.equipmentCategoryId && <div className="invalid-feedback">{errors.equipmentCategoryId.message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Regras de cadastro</h6>
                                <ul className="small text-muted ps-3 mb-0">
                                    <li className="mb-2">O equipamento deve pertencer a um laboratório com espaço de armazenamento.</li>
                                    <li className="mb-2">O laboratório pode comportar no máximo 50 equipamentos.</li>
                                    <li className="mb-2">O projeto deve estar vinculado ao mesmo laboratório.</li>
                                    <li>A categoria deve estar previamente cadastrada.</li>
                                </ul>
                            </div>
                            <div className="card-footer bg-white d-grid gap-2">
                                <button className="btn btn-dark" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Salvar equipamento'}
                                </button>
                                <Link className="btn btn-outline-secondary" to={equipmentId ? `/equipments/${equipmentId}` : '/equipments'}>
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

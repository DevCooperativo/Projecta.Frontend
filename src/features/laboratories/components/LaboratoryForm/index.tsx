import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';
import { laboratorySchema, type LaboratoryValues } from '@/schemas/laboratories/laboratorySchema';

interface Props { mode: 'new' | 'edit'; laboratoryId?: number }

export const LaboratoryForm = ({ mode, laboratoryId }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefetched = (location.state as { laboratory?: LaboratoryResponse } | null)?.laboratory;
    const [laboratory, setLaboratory] = useState<LaboratoryResponse | null>(null);
    const [professors, setProfessors] = useState<ProfessorResponse[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<LaboratoryValues>({
        resolver: yupResolver(laboratorySchema),
        defaultValues: { storageSpace: false },
    });

    useEffect(() => {
        if (prefetched) {
            setLaboratory(prefetched);
            reset({ name: prefetched.name, description: prefetched.description, maxOccupants: prefetched.maxOccupants, storageSpace: prefetched.storageSpace, professorId: prefetched.professorId });
        }
        const requests: Promise<unknown>[] = [
            professorsServices.list().then(response => setProfessors(response.data ?? [])),
        ];
        if (mode === 'edit' && laboratoryId && !prefetched) {
            requests.push(laboratoriesServices.get(laboratoryId).then(response => {
                if (!response.data) return;
                setLaboratory(response.data);
                reset({ name: response.data.name, description: response.data.description, maxOccupants: response.data.maxOccupants, storageSpace: response.data.storageSpace, professorId: response.data.professorId });
            }));
        }
        Promise.all(requests).catch(() => setServerError('Não foi possível carregar os dados do formulário.'));
    }, [mode, laboratoryId, reset]);

    const onSubmit = async (values: LaboratoryValues) => {
        setLoading(true);
        setServerError(null);
        try {
            if (mode === 'new') {
                await laboratoriesServices.create(values);
                navigate('/laboratories');
            } else if (laboratoryId) {
                await laboratoriesServices.update(laboratoryId, values);
                navigate(`/laboratories/${laboratoryId}`);
            }
        } catch {
            setServerError('Não foi possível salvar o laboratório. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'new' ? 'Novo laboratório' : 'Editar laboratório';
    return <>
        <div className="mb-4">
            <nav aria-label="breadcrumb"><ol className="breadcrumb mb-1 small">
                <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                <li className="breadcrumb-item"><Link to="/laboratories">Laboratórios</Link></li>
                {laboratory && <li className="breadcrumb-item"><Link to={`/laboratories/${laboratory.id}`}>{laboratory.name}</Link></li>}
                <li className="breadcrumb-item active">{mode === 'new' ? 'Novo' : 'Editar'}</li>
            </ol></nav>
            <h4 className="fw-bold mb-0">{title}</h4>
        </div>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-4">
                <div className="col-lg-8"><div className="card"><div className="card-body p-4">
                    <h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados do laboratório</h6>
                    <div className="row g-3">
                        <div className="col-12"><label className="form-label fw-semibold small" htmlFor="name">Nome</label>
                            <input {...register('name')} id="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Ex: Laboratório de Computação Aplicada" />
                            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                        </div>
                        <div className="col-md-6"><label className="form-label fw-semibold small" htmlFor="professorId">Professor responsável</label>
                            <select {...register('professorId', { valueAsNumber: true })} id="professorId" className={`form-select ${errors.professorId ? 'is-invalid' : ''}`}>
                                <option value="">Selecione...</option>{professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>{errors.professorId && <div className="invalid-feedback">{errors.professorId.message}</div>}
                        </div>
                        <div className="col-md-6"><label className="form-label fw-semibold small" htmlFor="maxOccupants">Capacidade</label>
                            <input {...register('maxOccupants', { valueAsNumber: true })} id="maxOccupants" type="number" min={1} className={`form-control ${errors.maxOccupants ? 'is-invalid' : ''}`} placeholder="Ex: 30" />
                            {errors.maxOccupants && <div className="invalid-feedback">{errors.maxOccupants.message}</div>}
                        </div>
                        <div className="col-12"><label className="form-label fw-semibold small" htmlFor="description">Descrição</label>
                            <textarea {...register('description')} id="description" rows={4} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                        </div>
                    </div>
                </div></div></div>
                <div className="col-lg-4"><div className="card"><div className="card-body p-4">
                    <h6 className="fw-semibold mb-4 pb-2 border-bottom">Configurações</h6>
                    <div className="form-check form-switch">
                        <input {...register('storageSpace')} id="storageSpace" type="checkbox" className="form-check-input" />
                        <label className="form-check-label" htmlFor="storageSpace">Possui espaço de armazenamento</label>
                    </div>
                </div><div className="card-footer bg-white d-grid gap-2">
                    <button className="btn btn-dark" disabled={loading}>{loading ? 'Salvando...' : 'Salvar laboratório'}</button>
                    <Link className="btn btn-outline-secondary" to={laboratoryId ? `/laboratories/${laboratoryId}` : '/laboratories'}>Cancelar</Link>
                </div></div></div>
            </div>
        </form>
    </>;
};

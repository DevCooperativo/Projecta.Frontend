import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { professorCreateSchema, professorEditSchema, type ProfessorCreateValues, type ProfessorEditValues } from '@/schemas/professors/professorSchema';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';
import { coordinations } from '@/mocks/coordinations';

interface ProfessorFormProps {
    mode: 'new' | 'edit';
    professorId?: number;
}

export const ProfessorForm = ({ mode, professorId }: ProfessorFormProps) => {
    const navigate = useNavigate();
    const [professor, setProfessor] = useState<ProfessorResponse | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const schema = mode === 'new' ? professorCreateSchema : professorEditSchema;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfessorCreateValues | ProfessorEditValues>({
        resolver: yupResolver(schema) as Resolver<ProfessorCreateValues | ProfessorEditValues>,
    });

    useEffect(() => {
        if (mode === 'edit' && professorId != null) {
            professorsServices.get(professorId).then((data) => {
                setProfessor(data);
                reset({
                    name: data.name,
                    registration: data.registration,
                    telephone: data.telephone,
                    coordinationId: data.coordinationId,
                });
            }).catch(() => {
                setServerError('Não foi possível carregar os dados do professor.');
            });
        }
    }, [mode, professorId, reset]);

    const onSubmit = async (data: ProfessorCreateValues | ProfessorEditValues) => {
        setServerError(null);
        setLoading(true);
        try {
            if (mode === 'new') {
                await professorsServices.create(data as ProfessorCreateValues);
                navigate('/professors');
            } else if (professorId != null) {
                const { coordinationId, ...rest } = data as ProfessorEditValues;
                await professorsServices.update(professorId, rest);
                if (professor && coordinationId !== professor.coordinationId) {
                    await professorsServices.changeCoordination(coordinationId);
                }
                navigate(`/professors/${professorId}`);
            }
        } catch {
            setServerError('Ocorreu um erro ao salvar. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'new' ? 'Novo professor' : 'Editar professor';
    const breadcrumbLabel = mode === 'new' ? 'Novo' : 'Editar';

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/professors">Professores</Link></li>
                            {mode === 'edit' && professor && (
                                <li className="breadcrumb-item"><Link to={`/professors/${professor.id}`}>{professor.name}</Link></li>
                            )}
                            <li className="breadcrumb-item active">{breadcrumbLabel}</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">{title}</h4>
                </div>
            </div>

            {serverError && <div className="alert alert-danger mb-4">{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Dados do professor</h6>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="name">Nome completo</label>
                                        <input
                                            {...register('name')}
                                            id="name"
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                    </div>
                                    {mode === 'new' && (
                                        <div className="col-md-7">
                                            <label className="form-label" htmlFor="email">E-mail</label>
                                            <input
                                                {...register('email' as keyof ProfessorCreateValues)}
                                                id="email"
                                                type="email"
                                                className={`form-control ${'email' in errors && errors.email ? 'is-invalid' : ''}`}
                                            />
                                            {'email' in errors && errors.email && (
                                                <div className="invalid-feedback">{errors.email.message}</div>
                                            )}
                                        </div>
                                    )}
                                    <div className={mode === 'new' ? 'col-md-5' : 'col-md-6'}>
                                        <label className="form-label" htmlFor="registration">Matrícula / SIAPE</label>
                                        <input
                                            {...register('registration')}
                                            id="registration"
                                            type="text"
                                            className={`form-control ${errors.registration ? 'is-invalid' : ''}`}
                                        />
                                        {errors.registration && <div className="invalid-feedback">{errors.registration.message}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="telephone">Telefone</label>
                                        <input
                                            {...register('telephone')}
                                            id="telephone"
                                            type="tel"
                                            className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                            placeholder="(00) 00000-0000"
                                        />
                                        {errors.telephone && <div className="invalid-feedback">{errors.telephone.message}</div>}
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="coordinationId">Coordenadoria</label>
                                        <select
                                            {...register('coordinationId', { valueAsNumber: true })}
                                            id="coordinationId"
                                            className={`form-select ${errors.coordinationId ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {coordinations.filter(c => c.status === 'active').map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        {errors.coordinationId && <div className="invalid-feedback">{errors.coordinationId.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? 'Salvando...' : mode === 'new' ? 'Cadastrar professor' : 'Salvar alterações'}
                                </button>
                                <Link
                                    to={mode === 'edit' && professorId ? `/professors/${professorId}` : '/professors'}
                                    className="btn btn-outline-secondary w-100"
                                >
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

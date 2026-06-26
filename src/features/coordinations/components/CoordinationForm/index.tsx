import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    coordinationCreateSchema,
    coordinationEditSchema,
    type CoordinationCreateValues,
    type CoordinationEditValues,
} from '@/schemas/coordinations/coordinationSchema';
import { coordinationsServices } from '@/api/coordinations/implementation/coordinationsServices';
import type { CoordinationResponse } from '@/api/coordinations/iCoordinationsServices';


interface CoordinationFormProps {
    mode: 'new' | 'edit';
    coordinationId?: number;
}

export const CoordinationForm = ({ mode, coordinationId }: CoordinationFormProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefetched = (location.state as { coordination?: CoordinationResponse } | null)?.coordination;
    const [coordination, setCoordination] = useState<CoordinationResponse | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const schema = mode === 'new' ? coordinationCreateSchema : coordinationEditSchema;

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm<CoordinationCreateValues | CoordinationEditValues>({
            resolver: yupResolver(schema) as Resolver<CoordinationCreateValues | CoordinationEditValues>,
        });

    useEffect(() => {
        if (mode !== 'edit' || coordinationId == null) return;
        if (prefetched) {
            setCoordination(prefetched);
            reset({ area: prefetched.area, block: prefetched.block, description: prefetched.description });
            return;
        }
        coordinationsServices.get(coordinationId).then(x => {
            if (x.data) {
                setCoordination(x.data);
                reset({ area: x.data.area, block: x.data.block, description: x.data.description });
            }
        }).catch(() => {
            setServerError('Não foi possível carregar os dados da coordenadoria.');
        });
    }, [mode, coordinationId, reset]);

    const onSubmit = async (data: CoordinationCreateValues | CoordinationEditValues) => {
        setServerError(null);
        setLoading(true);
        try {
            if (mode === 'new') {
                await coordinationsServices.create(data);
                navigate('/coordinations');
            } else if (coordinationId != null) {
                await coordinationsServices.update(coordinationId, data);
                navigate(`/coordinations/${coordinationId}`);
            }
        } catch {
            setServerError('Ocorreu um erro ao salvar. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'new' ? 'Nova coordenadoria' : 'Editar coordenadoria';

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/coordinations">Coordenadorias</Link></li>
                            {mode === 'edit' && coordination && (
                                <li className="breadcrumb-item">
                                    <Link to={`/coordinations/${coordination.id}`}>{coordination.area}</Link>
                                </li>
                            )}
                            <li className="breadcrumb-item active">{mode === 'new' ? 'Nova' : 'Editar'}</li>
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
                                <h6 className="fw-semibold mb-3">Dados da coordenadoria</h6>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="area">Área</label>
                                        <input
                                            {...register('area')}
                                            id="area"
                                            type="text"
                                            className={`form-control ${errors.area ? 'is-invalid' : ''}`}
                                        />
                                        {errors.area && <div className="invalid-feedback">{errors.area.message}</div>}
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="block">Bloco</label>
                                        <input
                                            {...register('block')}
                                            type={"text"}
                                            className={`form-control ${errors.block ? 'is-invalid' : ''}`}
                                        >
                                        </input>
                                        {errors.block && <div className="invalid-feedback">{errors.block.message}</div>}
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
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? 'Salvando...' : mode === 'new' ? 'Salvar coordenadoria' : 'Salvar alterações'}
                                </button>
                                <Link
                                    to={mode === 'edit' && coordinationId ? `/coordinations/${coordinationId}` : '/coordinations'}
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

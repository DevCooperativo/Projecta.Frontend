import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { object, string } from 'yup';
import { useAuth } from '@/context/auth/useAuth';
import { administratorsServices } from '@/api/administrators/implementation/administratorsServices';

interface AdminEditValues {
    email: string;
}

const schema = object({
    email: string().email('E-mail inválido').required('E-mail é obrigatório'),
});

export const AdminEdit = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminEditValues>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (user?.email) {
            reset({ email: user.email });
        }
    }, [user, reset]);

    const onSubmit = async (data: AdminEditValues) => {
        if (!user?.id) return;
        setServerError(null);
        setLoading(true);
        try {
            await administratorsServices.update(user.id, { email: data.email });
            navigate('/admin');
        } catch {
            setServerError('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/admin">Meu perfil</Link></li>
                            <li className="breadcrumb-item active">Editar</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Editar perfil</h4>
                </div>
            </div>

            {serverError && <div className="alert alert-danger mb-4">{serverError}</div>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Dados do perfil</h6>
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <label className="form-label" htmlFor="email">E-mail</label>
                                        <input
                                            {...register('email')}
                                            id="email"
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Conta</h6>
                                <div className="mb-2">
                                    <p className="text-muted small mb-1">Nível de acesso</p>
                                    <span className="badge bg-dark fw-normal">Administrador</span>
                                </div>
                                <div>
                                    <p className="text-muted small mb-1">Instituição</p>
                                    <p className="mb-0 small">Instituto Tecnológico do Litoral</p>
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Salvar alterações'}
                                </button>
                                <Link to="/admin" className="btn btn-outline-secondary w-100">
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

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import { authServices } from '@/api/auth/implementation/authServices';
import { LoginSchema } from '@/schemas/auth/loginSchema';

interface LoginFormValues {
    email: string;
    password: string;
}


export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const schema = LoginSchema()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setServerError(null);
        setLoading(true);
        try {
            const response = await authServices.signin({
                email: data.email,
                password: data.password,
            });
            if (response.code !== 200 || !response.data) {
                setServerError('E-mail, senha ou perfil incorretos. Verifique e tente novamente.');
                return
            }
            login({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email ?? data.email,
                profileType: response.data.profileType
            });
            navigate('/');
        } catch {
            setServerError('E-mail, senha ou perfil incorretos. Verifique e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Projecta</h2>
                            <p className="text-muted small">Instituto Tecnológico do Litoral</p>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold mb-4">Entrar na plataforma</h5>
                                {serverError && (
                                    <div className="alert alert-danger py-2 small">{serverError}</div>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="email">E-mail</label>
                                        <input
                                            {...register('email')}
                                            id="email"
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            placeholder="seu@email.com"
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="password">Senha</label>
                                        <input
                                            {...register('password')}
                                            id="password"
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                        {loading ? 'Entrando...' : 'Entrar'}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <p className="text-center text-muted small mt-3">
                            Não tem acesso?{' '}
                            <a href="/register" className="text-dark">Solicitar cadastro</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

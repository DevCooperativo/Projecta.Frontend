import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, type RegisterSchemaType } from '@/schemas/auth/registerSchema';
import { Link } from 'react-router-dom';

export const Register = () => {
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchemaType>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = (_data: RegisterSchemaType) => {
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-vh-100 d-flex align-items-center bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="card shadow-sm text-center p-5">
                                <div className="mb-3">
                                    <span className="badge bg-success-subtle text-success fs-5 p-3 rounded-circle">✓</span>
                                </div>
                                <h5 className="fw-bold mb-2">Solicitação enviada!</h5>
                                <p className="text-muted mb-4">
                                    Sua solicitação de acesso foi registrada. Você receberá uma resposta por e-mail em breve.
                                </p>
                                <Link to="/login" className="btn btn-dark">
                                    Voltar para o login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light py-5">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold">Projecta</h2>
                            <p className="text-muted small">Instituto Tecnológico do Litoral</p>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold mb-4">Solicitar acesso à plataforma</h5>
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label className="form-label" htmlFor="name">Nome completo</label>
                                            <input
                                                {...register('name')}
                                                id="name"
                                                type="text"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Seu nome completo"
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label" htmlFor="profile">Perfil</label>
                                            <select
                                                {...register('profile')}
                                                id="profile"
                                                className={`form-select ${errors.profile ? 'is-invalid' : ''}`}
                                            >
                                                <option value="">Selecione...</option>
                                                <option value="professor">Professor</option>
                                                <option value="student">Aluno</option>
                                            </select>
                                            {errors.profile && <div className="invalid-feedback">{errors.profile.message}</div>}
                                        </div>
                                        <div className="col-md-7">
                                            <label className="form-label" htmlFor="email">E-mail institucional</label>
                                            <input
                                                {...register('email')}
                                                id="email"
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder="seu@itl.edu.br"
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                        </div>
                                        <div className="col-md-5">
                                            <label className="form-label" htmlFor="registration">Matrícula / SIAPE</label>
                                            <input
                                                {...register('registration')}
                                                id="registration"
                                                type="text"
                                                className={`form-control ${errors.registration ? 'is-invalid' : ''}`}
                                                placeholder="Matrícula ou SIAPE"
                                            />
                                            {errors.registration && <div className="invalid-feedback">{errors.registration.message}</div>}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label" htmlFor="justification">Justificativa de acesso</label>
                                            <textarea
                                                {...register('justification')}
                                                id="justification"
                                                rows={4}
                                                className={`form-control ${errors.justification ? 'is-invalid' : ''}`}
                                                placeholder="Descreva brevemente por que precisa de acesso à plataforma..."
                                            />
                                            {errors.justification && <div className="invalid-feedback">{errors.justification.message}</div>}
                                        </div>
                                        <div className="col-12 d-flex gap-2 pt-2">
                                            <button type="submit" className="btn btn-dark">
                                                Enviar solicitação
                                            </button>
                                            <Link to="/login" className="btn btn-outline-secondary">
                                                Cancelar
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card border-0 bg-dark text-white h-100">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">O que acontece a seguir?</h6>
                                <ol className="list-unstyled small">
                                    <li className="mb-3 d-flex gap-2">
                                        <span className="badge bg-light text-dark rounded-circle flex-shrink-0" style={{ width: 24, height: 24, lineHeight: '16px' }}>1</span>
                                        <span>Sua solicitação é recebida pela coordenadoria de pesquisa.</span>
                                    </li>
                                    <li className="mb-3 d-flex gap-2">
                                        <span className="badge bg-light text-dark rounded-circle flex-shrink-0" style={{ width: 24, height: 24, lineHeight: '16px' }}>2</span>
                                        <span>O administrador analisa os dados e verifica o vínculo institucional.</span>
                                    </li>
                                    <li className="mb-3 d-flex gap-2">
                                        <span className="badge bg-light text-dark rounded-circle flex-shrink-0" style={{ width: 24, height: 24, lineHeight: '16px' }}>3</span>
                                        <span>Você recebe um e-mail com as credenciais de acesso.</span>
                                    </li>
                                </ol>
                                <hr className="border-secondary" />
                                <p className="text-secondary small mb-0">
                                    Dúvidas? Entre em contato com a coordenadoria pelo e-mail
                                    coordenacao.pesquisa@itl.edu.br
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

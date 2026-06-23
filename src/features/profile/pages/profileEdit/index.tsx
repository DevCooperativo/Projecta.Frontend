import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/context/auth/useAuth';
import { authServices } from '@/api/auth/implementation/authServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import { studentsServices } from '@/api/students/implementation/studentsServices';
import { userUpdateProfile } from '@/state/userSlice';
import type { AppDispatch } from '@/state/store';

// ─── Admin ───────────────────────────────────────────────────────────────────

interface AdminValues { name: string }
const adminSchema = object({ name: string().required('Nome é obrigatório') });

function AdminEditForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminValues>({
        resolver: yupResolver(adminSchema) as Resolver<AdminValues>,
    });

    useEffect(() => {
        if (user?.name) reset({ name: user.name });
    }, [user, reset]);

    const onSubmit = async (data: AdminValues) => {
        setServerError(null);
        setLoading(true);
        try {
            await authServices.updateMe({ name: data.name });
            dispatch(userUpdateProfile({ name: data.name }));
            navigate('/profile');
        } catch {
            setServerError('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Dados do perfil</h6>
                            {serverError && <div className="alert alert-danger">{serverError}</div>}
                            <div className="row g-3">
                                <div className="col-md-8">
                                    <label className="form-label" htmlFor="name">Nome</label>
                                    <input
                                        {...register('name')}
                                        id="name"
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
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
                            <Link to="/profile" className="btn btn-outline-secondary w-100">Cancelar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

// ─── Professor ────────────────────────────────────────────────────────────────

interface ProfessorValues { name: string; registration: string; telephone: string }
const professorSchema = object({
    name: string().required('Nome é obrigatório'),
    registration: string().required('Matrícula/SIAPE é obrigatória'),
    telephone: string().required('Telefone é obrigatório'),
});

function ProfessorEditForm({ userId }: { userId: number }) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfessorValues>({
        resolver: yupResolver(professorSchema) as Resolver<ProfessorValues>,
    });

    useEffect(() => {
        professorsServices.get(userId)
            .then(res => {
                if (res.data) reset({ name: res.data.name, registration: res.data.registration, telephone: res.data.telephone });
            })
            .catch(() => {});
    }, [userId, reset]);

    const onSubmit = async (data: ProfessorValues) => {
        setServerError(null);
        setLoading(true);
        try {
            await authServices.updateMe({ name: data.name, registration: data.registration, telephone: data.telephone });
            dispatch(userUpdateProfile({ name: data.name }));
            navigate('/profile');
        } catch {
            setServerError('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Dados do perfil</h6>
                            {serverError && <div className="alert alert-danger">{serverError}</div>}
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
                                    <label className="form-label" htmlFor="registration">Matrícula/SIAPE</label>
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
                                        type="text"
                                        className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                    />
                                    {errors.telephone && <div className="invalid-feedback">{errors.telephone.message}</div>}
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
                                <p className="text-muted small mb-1">Tipo de perfil</p>
                                <span className="badge bg-secondary fw-normal">Professor</span>
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
                            <Link to="/profile" className="btn btn-outline-secondary w-100">Cancelar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

// ─── Student ──────────────────────────────────────────────────────────────────

interface StudentValues { name: string; birthdate: string }
const studentSchema = object({
    name: string().required('Nome é obrigatório'),
    birthdate: string().required('Data de nascimento é obrigatória'),
});

function StudentEditForm({ userId }: { userId: number }) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentValues>({
        resolver: yupResolver(studentSchema) as Resolver<StudentValues>,
    });

    useEffect(() => {
        studentsServices.get(userId)
            .then(res => {
                if (res.data) reset({ name: res.data.name, birthdate: res.data.birthdate });
            })
            .catch(() => {});
    }, [userId, reset]);

    const onSubmit = async (data: StudentValues) => {
        setServerError(null);
        setLoading(true);
        try {
            await authServices.updateMe({ name: data.name, birthdate: data.birthdate });
            dispatch(userUpdateProfile({ name: data.name }));
            navigate('/profile');
        } catch {
            setServerError('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Dados do perfil</h6>
                            {serverError && <div className="alert alert-danger">{serverError}</div>}
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
                                    <label className="form-label" htmlFor="birthdate">Data de nascimento</label>
                                    <input
                                        {...register('birthdate')}
                                        id="birthdate"
                                        type="date"
                                        className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
                                    />
                                    {errors.birthdate && <div className="invalid-feedback">{errors.birthdate.message}</div>}
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
                                <p className="text-muted small mb-1">Tipo de perfil</p>
                                <span className="badge bg-primary fw-normal">Aluno</span>
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
                            <Link to="/profile" className="btn btn-outline-secondary w-100">Cancelar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export const ProfileEdit = () => {
    const { user } = useAuth();

    if (!user?.id || !user.profileType) return null;

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/profile">Meu perfil</Link></li>
                            <li className="breadcrumb-item active">Editar</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Editar perfil</h4>
                </div>
            </div>
            {user.profileType === 'admin' && <AdminEditForm />}
            {user.profileType === 'professor' && <ProfessorEditForm userId={user.id} />}
            {user.profileType === 'student' && <StudentEditForm userId={user.id} />}
        </>
    );
};

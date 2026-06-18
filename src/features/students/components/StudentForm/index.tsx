import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import { studentCreateSchema, studentEditSchema, type StudentCreateValues, type StudentEditValues } from '@/schemas/students/studentSchema';
import { studentsServices } from '@/api/students/implementation/studentsServices';
import type { StudentResponse } from '@/api/students/iStudentsServices';

const SHIFTS = [
    { value: 'MORNING', label: 'Manhã' },
    { value: 'AFTERNOON', label: 'Tarde' },
    { value: 'EVENING', label: 'Noite' },
    { value: 'NIGHT', label: 'Integral' },
];

interface StudentFormProps {
    mode: 'new' | 'edit';
    studentId?: number;
}

export const StudentForm = ({ mode, studentId }: StudentFormProps) => {
    const navigate = useNavigate();
    const [student, setStudent] = useState<StudentResponse | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const schema = mode === 'new' ? studentCreateSchema : studentEditSchema;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentCreateValues | StudentEditValues>({
        resolver: yupResolver(schema) as Resolver<StudentCreateValues | StudentEditValues>,
    });

    useEffect(() => {
        if (mode === 'edit' && studentId != null) {
            studentsServices.get(studentId).then((data) => {
                setStudent(data);
                reset({
                    name: data.name,
                    email: data.email,
                    registration: data.registration,
                    birthdate: data.birthdate,
                    term: data.term,
                    shift: data.shift,
                });
            }).catch(() => {
                setServerError('Não foi possível carregar os dados do aluno.');
            });
        }
    }, [mode, studentId, reset]);

    const onSubmit = async (data: StudentCreateValues | StudentEditValues) => {
        setServerError(null);
        setLoading(true);
        try {
            if (mode === 'new') {
                await studentsServices.create(data as StudentCreateValues);
                navigate('/students');
            } else if (studentId != null) {
                await studentsServices.update(studentId, data as StudentEditValues);
                navigate(`/students/${studentId}`);
            }
        } catch {
            setServerError('Ocorreu um erro ao salvar. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const title = mode === 'new' ? 'Novo aluno' : 'Editar aluno';
    const breadcrumbLabel = mode === 'new' ? 'Novo' : 'Editar';

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/students">Alunos</Link></li>
                            {mode === 'edit' && student && (
                                <li className="breadcrumb-item"><Link to={`/students/${student.id}`}>{student.name}</Link></li>
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
                                <h6 className="fw-semibold mb-3">Dados do aluno</h6>
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
                                    <div className="col-md-7">
                                        <label className="form-label" htmlFor="email">E-mail</label>
                                        <input
                                            {...register('email')}
                                            id="email"
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                    </div>
                                    <div className="col-md-5">
                                        <label className="form-label" htmlFor="registration">Matrícula</label>
                                        <input
                                            {...register('registration')}
                                            id="registration"
                                            type="text"
                                            className={`form-control ${errors.registration ? 'is-invalid' : ''}`}
                                        />
                                        {errors.registration && <div className="invalid-feedback">{errors.registration.message}</div>}
                                    </div>
                                    {mode === 'new' && (
                                        <div className="col-md-7">
                                            <label className="form-label" htmlFor="password">Senha</label>
                                            <input
                                                {...register('password' as keyof StudentCreateValues)}
                                                id="password"
                                                type="password"
                                                className={`form-control ${'password' in errors && errors.password ? 'is-invalid' : ''}`}
                                            />
                                            {'password' in errors && errors.password && (
                                                <div className="invalid-feedback">{errors.password.message}</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="col-md-5">
                                        <label className="form-label" htmlFor="birthdate">Data de nascimento</label>
                                        <input
                                            {...register('birthdate')}
                                            id="birthdate"
                                            type="date"
                                            className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
                                        />
                                        {errors.birthdate && <div className="invalid-feedback">{errors.birthdate.message}</div>}
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label" htmlFor="term">Período</label>
                                        <input
                                            {...register('term', { valueAsNumber: true })}
                                            id="term"
                                            type="number"
                                            min={1}
                                            className={`form-control ${errors.term ? 'is-invalid' : ''}`}
                                        />
                                        {errors.term && <div className="invalid-feedback">{errors.term.message}</div>}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="shift">Turno</label>
                                        <select
                                            {...register('shift')}
                                            id="shift"
                                            className={`form-select ${errors.shift ? 'is-invalid' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {SHIFTS.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                        {errors.shift && <div className="invalid-feedback">{errors.shift.message}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? 'Salvando...' : mode === 'new' ? 'Cadastrar aluno' : 'Salvar alterações'}
                                </button>
                                <Link
                                    to={mode === 'edit' && studentId ? `/students/${studentId}` : '/students'}
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

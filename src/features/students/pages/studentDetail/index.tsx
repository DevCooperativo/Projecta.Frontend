import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Avatar } from '@/components/Avatar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { studentsServices } from '@/api/students/implementation/studentsServices';
import type { StudentResponse } from '@/api/students/iStudentsServices';

const SHIFT_LABELS: Record<string, string> = {
    MORNING: 'Manhã',
    AFTERNOON: 'Tarde',
    EVENING: 'Noite',
    NIGHT: 'Integral',
};

export const StudentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [student, setStudent] = useState<StudentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        studentsServices.get(Number(id))
            .then(setStudent)
            .catch(() => setStudent(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    if (!student) {
        return (
            <div className="text-center py-5 text-muted">
                Aluno não encontrado.{' '}
                <Link to="/students">Voltar para a lista</Link>
            </div>
        );
    }

    const handleDelete = async () => {
        try {
            await studentsServices.remove(student.id);
            navigate('/students');
        } catch {
            setDeleteError('Não foi possível excluir este aluno. Verifique se há vínculos ativos.');
            setShowModal(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/students">Alunos</Link></li>
                            <li className="breadcrumb-item active">{student.name}</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">{student.name}</h4>
                </div>
                <div className="d-flex gap-2">
                    <Link to={`/students/${student.id}/edit`} className="btn btn-outline-dark">
                        Editar
                    </Link>
                    <button className="btn btn-outline-danger" onClick={() => { setDeleteError(null); setShowModal(true); }}>
                        Excluir
                    </button>
                </div>
            </div>

            {deleteError && (
                <div className="alert alert-danger mb-4">{deleteError}</div>
            )}

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                <Avatar name={student.name} variant="student" size="md" />
                                <div>
                                    <h5 className="fw-bold mb-0">{student.name}</h5>
                                    <p className="text-muted mb-0">{student.email}</p>
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Matrícula</p>
                                    <p className="fw-semibold mb-0">{student.registration}</p>
                                </div>
                                <div className="col-sm-3">
                                    <p className="text-muted small mb-1">Período</p>
                                    <p className="fw-semibold mb-0">{student.term}º</p>
                                </div>
                                <div className="col-sm-3">
                                    <p className="text-muted small mb-1">Turno</p>
                                    <p className="fw-semibold mb-0">{SHIFT_LABELS[student.shift] ?? student.shift}</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Data de nascimento</p>
                                    <p className="fw-semibold mb-0">{student.birthdate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Informações do registro</h6>
                            <div className="mb-2">
                                <p className="text-muted small mb-0">Cadastrado em</p>
                                <p className="mb-0">{student.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-muted small mb-0">Atualizado em</p>
                                <p className="mb-0">{student.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showModal}
                title="Excluir aluno"
                message={`Tem certeza que deseja excluir o aluno "${student.name}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
            />
        </>
    );
};

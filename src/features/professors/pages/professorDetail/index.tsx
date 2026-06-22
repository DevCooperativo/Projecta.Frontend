import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coordinations } from '@/mocks/coordinations';
import { Avatar } from '@/components/Avatar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import type { ProfessorResponse } from '@/api/professors/iProfessorsServices';
import { useAuth } from '@/context/auth/useAuth';

export const ProfessorDetail = () => {
    const { user } = useAuth();
    const isAdmin = user?.profileType === 'admin';
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [professor, setProfessor] = useState<ProfessorResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        professorsServices.get(Number(id))
            .then(x=>x.data && setProfessor(x.data))
            .catch(() => setProfessor(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    if (!professor) {
        return (
            <div className="text-center py-5 text-muted">
                Professor não encontrado.{' '}
                <Link to="/professors">Voltar para a lista</Link>
            </div>
        );
    }

    const coord = coordinations.find(c => c.id === professor.coordinationId);

    const handleDelete = async () => {
        try {
            await professorsServices.remove(professor.id);
            navigate('/professors');
        } catch {
            setDeleteError('Não foi possível excluir este professor. Verifique se há vínculos ativos.');
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
                            <li className="breadcrumb-item"><Link to="/professors">Professores</Link></li>
                            <li className="breadcrumb-item active">{professor.name}</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">{professor.name}</h4>
                </div>
                {isAdmin && (
                    <div className="d-flex gap-2">
                        <Link to={`/professors/${professor.id}/edit`} state={{ professor }} className="btn btn-outline-dark">
                            Editar
                        </Link>
                        <button className="btn btn-outline-danger" onClick={() => { setDeleteError(null); setShowModal(true); }}>
                            Excluir
                        </button>
                    </div>
                )}
            </div>

            {deleteError && (
                <div className="alert alert-danger mb-4">{deleteError}</div>
            )}

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                <Avatar name={professor.name} variant="professor" size="md" />
                                <div>
                                    <h5 className="fw-bold mb-0">{professor.name}</h5>
                                    <p className="text-muted mb-0">{professor.email}</p>
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Matrícula / SIAPE</p>
                                    <p className="fw-semibold mb-0">{professor.registration}</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Telefone</p>
                                    <p className="fw-semibold mb-0">{professor.telephone}</p>
                                </div>
                                <div className="col-12">
                                    <p className="text-muted small mb-1">Coordenadoria</p>
                                    <p className="fw-semibold mb-0">{coord?.name ?? `ID ${professor.coordinationId}`}</p>
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
                                <p className="mb-0">{professor.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-muted small mb-0">Atualizado em</p>
                                <p className="mb-0">{professor.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showModal}
                title="Excluir professor"
                message={`Tem certeza que deseja excluir o professor "${professor.name}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
            />
        </>
    );
};

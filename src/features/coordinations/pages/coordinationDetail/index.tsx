import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ConfirmModal } from '@/components/ConfirmModal';
import { coordinationsServices } from '@/api/coordinations/implementation/coordinationsServices';
import type { CoordinationResponse } from '@/api/coordinations/iCoordinationsServices';

export const CoordinationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [coordination, setCoordination] = useState<CoordinationResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        coordinationsServices.get(Number(id))
            .then(x => x.data && setCoordination(x.data))
            .catch(() => setCoordination(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    if (!coordination) {
        return (
            <div className="text-center py-5 text-muted">
                Coordenadoria não encontrada.{' '}
                <Link to="/coordinations">Voltar para a lista</Link>
            </div>
        );
    }

    const handleDelete = async () => {
        try {
            await coordinationsServices.remove(coordination.id);
            navigate('/coordinations');
        } catch {
            setDeleteError('Não foi possível excluir esta coordenadoria. Verifique se há professores vinculados.');
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
                            <li className="breadcrumb-item"><Link to="/coordinations">Coordenadorias</Link></li>
                            <li className="breadcrumb-item active">{coordination.area}</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">{coordination.area}</h4>
                    <span className="badge bg-light text-dark border mt-1">{coordination.block}</span>
                </div>
                <div className="d-flex gap-2">
                    <Link to={`/coordinations/${coordination.id}/edit`} className="btn btn-outline-dark">
                        Editar
                    </Link>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => { setDeleteError(null); setShowModal(true); }}
                    >
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
                            <h6 className="fw-semibold mb-3">Dados da coordenadoria</h6>
                            <div className="row g-3">
                                <div className="col-sm-8">
                                    <p className="text-muted small mb-1">Área</p>
                                    <p className="fw-semibold mb-0">{coordination.area}</p>
                                </div>
                                <div className="col-sm-4">
                                    <p className="text-muted small mb-1">Bloco</p>
                                    <p className="fw-semibold mb-0">{coordination.block}</p>
                                </div>
                                <div className="col-12">
                                    <p className="text-muted small mb-1">Descrição</p>
                                    <p className="mb-0">{coordination.description}</p>
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
                                <p className="text-muted small mb-0">Cadastrada em</p>
                                <p className="mb-0">{coordination.createdAt}</p>
                            </div>
                            <div>
                                <p className="text-muted small mb-0">Atualizada em</p>
                                <p className="mb-0">{coordination.updatedAt}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                show={showModal}
                title="Excluir coordenadoria"
                message={`Tem certeza que deseja excluir a coordenadoria "${coordination.area}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
            />
        </>
    );
};

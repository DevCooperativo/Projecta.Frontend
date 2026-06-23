import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { borrowsServices } from '@/api/borrows/implementation/borrowsServices';
import type { BorrowResponse } from '@/api/borrows/iBorrowsServices';
import { useAuth } from '@/context/auth/useAuth';

export const BorrowDetail = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [borrow, setBorrow] = useState<BorrowResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        borrowsServices.get(Number(id))
            .then(x => x.data && setBorrow(x.data))
            .catch(() => setBorrow(null))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    if (!borrow) {
        return (
            <div className="text-center py-5 text-muted">
                Empréstimo não encontrado.{' '}
                <Link to="/borrows">Voltar para a lista</Link>
            </div>
        );
    }

    const isAdmin = user?.profileType === 'admin';
    const isCreator = borrow.professor?.id === user?.id || borrow.student?.id === user?.id;
    if (!isAdmin && !isCreator) {
        return <Navigate to="/borrows" replace />;
    }

    const borrowerName = borrow.professor?.name ?? borrow.student?.name ?? '—';
    const borrowerType = borrow.professor ? 'Professor' : borrow.student ? 'Aluno' : null;

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/borrows">Empréstimos</Link></li>
                            <li className="breadcrumb-item active">Empréstimo #{borrow.id}</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Empréstimo #{borrow.id}</h4>
                </div>
                {borrow.isStillBorrowed && (
                    <div className="d-flex gap-2">
                        {isAdmin && (
                            <Link to={`/borrows/${borrow.id}/edit`} state={{ borrow }} className="btn btn-outline-dark">
                                Editar
                            </Link>
                        )}
                        <Link to={`/borrows/${borrow.id}/close`} className="btn btn-dark">
                            {isAdmin ? 'Encerrar' : 'Devolver'}
                        </Link>
                    </div>
                )}
            </div>

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Dados do empréstimo</h6>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Equipamento</p>
                                    <p className="fw-semibold mb-0">{borrow.equipmentName ?? `Equipamento #${borrow.equipmentId}`}</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Tomador</p>
                                    <p className="fw-semibold mb-0">
                                        {borrowerName}
                                        {borrowerType && (
                                            <span className="badge bg-secondary-subtle text-secondary ms-2 fw-normal">
                                                {borrowerType}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Data de empréstimo</p>
                                    <p className="fw-semibold mb-0">{borrow.borrowDate}</p>
                                </div>
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">Devolução prevista</p>
                                    <p className="fw-semibold mb-0">{borrow.expectedReturnDate ?? '—'}</p>
                                </div>
                                {borrow.completionDate && (
                                    <div className="col-sm-6">
                                        <p className="text-muted small mb-1">Data de encerramento</p>
                                        <p className="fw-semibold mb-0">{borrow.completionDate}</p>
                                    </div>
                                )}
                                {borrow.notes && (
                                    <div className="col-12">
                                        <p className="text-muted small mb-1">Observações</p>
                                        <p className="fw-semibold mb-0">{borrow.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Status</h6>
                            <StatusBadge status={borrow.isStillBorrowed ? 'pending' : 'completed'} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

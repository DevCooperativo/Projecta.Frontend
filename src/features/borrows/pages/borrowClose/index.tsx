import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { borrowsServices } from '@/api/borrows/implementation/borrowsServices';
import type { BorrowResponse } from '@/api/borrows/iBorrowsServices';

export const BorrowClose = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [borrow, setBorrow] = useState<BorrowResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        if (!id) return;
        borrowsServices.get(Number(id))
            .then(setBorrow)
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

    if (borrow.status === 'completed') {
        return (
            <div className="text-center py-5 text-muted">
                Este empréstimo já foi encerrado.{' '}
                <Link to="/borrows">Voltar para a lista</Link>
            </div>
        );
    }

    const isOverdue = borrow.expectedReturnDate != null && borrow.expectedReturnDate < today;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await borrowsServices.returnBorrow(borrow.id);
            navigate('/borrows');
        } catch {
            setError('Não foi possível registrar a devolução. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/borrows">Empréstimos</Link></li>
                            <li className="breadcrumb-item active">Encerrar empréstimo</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Encerrar empréstimo</h4>
                </div>
            </div>

            {isOverdue && (
                <div className="alert alert-warning d-flex align-items-center gap-2 mb-4" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <div>
                        <strong>Devolução em atraso!</strong> A data prevista era {borrow.expectedReturnDate} e hoje é {today}.
                    </div>
                </div>
            )}

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
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
                                            {borrow.borrowerName ?? `ID ${borrow.borrowerId}`}
                                            {borrow.borrowerType && (
                                                <span className="badge bg-secondary-subtle text-secondary ms-2 fw-normal">
                                                    {borrow.borrowerType === 'professor' ? 'Professor' : 'Aluno'}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p className="text-muted small mb-1">Data de empréstimo</p>
                                        <p className="fw-semibold mb-0">{borrow.borrowDate}</p>
                                    </div>
                                    {borrow.expectedReturnDate && (
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Devolução prevista</p>
                                            <p className={`fw-semibold mb-0 ${isOverdue ? 'text-danger' : ''}`}>
                                                {borrow.expectedReturnDate}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Confirmação</h6>
                                <p className="text-muted small">
                                    Data de encerramento será registrada automaticamente como <strong>{today}</strong>.
                                </p>
                                <p className="text-muted small mb-0">
                                    O status do empréstimo será alterado para <strong>Concluído</strong>.
                                </p>
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
                                    {submitting ? 'Confirmando...' : 'Confirmar devolução'}
                                </button>
                                <Link to="/borrows" className="btn btn-outline-secondary w-100">
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

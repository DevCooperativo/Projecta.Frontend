import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { borrowsServices } from '@/api/borrows/implementation/borrowsServices';
import type { BorrowResponse } from '@/api/borrows/iBorrowsServices';
import { useAuth } from '@/context/auth/useAuth';

export const BorrowEdit = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const prefetched = (location.state as { borrow?: BorrowResponse } | null)?.borrow;

    const [borrow, setBorrow] = useState<BorrowResponse | null>(prefetched ?? null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [loadingBorrow, setLoadingBorrow] = useState(!prefetched);

    const [equipmentId, setEquipmentId] = useState('');
    const [borrowerType, setBorrowerType] = useState<'professor' | 'student'>('student');
    const [borrowerId, setBorrowerId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        if (prefetched) {
            initForm(prefetched);
            return;
        }
        borrowsServices.get(Number(id))
            .then(x => {
                if (x.data) {
                    setBorrow(x.data);
                    initForm(x.data);
                }
            })
            .catch(() => setLoadError('Não foi possível carregar os dados do empréstimo.'))
            .finally(() => setLoadingBorrow(false));
    }, [id]);

    const initForm = (b: BorrowResponse) => {
        setEquipmentId(String(b.equipmentId));
        if (b.professor) {
            setBorrowerType('professor');
            setBorrowerId(String(b.professor.id));
        } else if (b.student) {
            setBorrowerType('student');
            setBorrowerId(String(b.student.id));
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!equipmentId || isNaN(Number(equipmentId)) || Number(equipmentId) < 1) {
            errs.equipmentId = 'Informe um ID de equipamento válido';
        }
        if (!borrowerId || isNaN(Number(borrowerId)) || Number(borrowerId) < 1) {
            errs.borrowerId = borrowerType === 'professor'
                ? 'Informe um ID de professor válido'
                : 'Informe um ID de aluno válido';
        }
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setValidationErrors(errs);
            return;
        }
        setValidationErrors({});
        setError(null);
        setLoading(true);

        try {
            await borrowsServices.update(Number(id), {
                equipmentId: Number(equipmentId),
                ...(borrowerType === 'professor'
                    ? { professorId: Number(borrowerId) }
                    : { studentId: Number(borrowerId) }),
            });
            navigate(`/borrows/${id}`);
        } catch {
            setError('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingBorrow) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    if (loadError || !borrow) {
        return (
            <div className="text-center py-5 text-muted">
                {loadError ?? 'Empréstimo não encontrado.'}{' '}
                <Link to="/borrows">Voltar para a lista</Link>
            </div>
        );
    }

    const isAdmin = user?.profileType === 'admin';
    const isCreator = borrow.professor?.id === user?.id || borrow.student?.id === user?.id;
    if (!isAdmin && !isCreator) {
        return <Navigate to="/borrows" replace />;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item"><Link to="/borrows">Empréstimos</Link></li>
                            <li className="breadcrumb-item"><Link to={`/borrows/${borrow.id}`}>Empréstimo #{borrow.id}</Link></li>
                            <li className="breadcrumb-item active">Editar</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Editar empréstimo</h4>
                </div>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Dados do empréstimo</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="equipmentId">ID do equipamento</label>
                                        <input
                                            id="equipmentId"
                                            type="number"
                                            min={1}
                                            className={`form-control ${validationErrors.equipmentId ? 'is-invalid' : ''}`}
                                            value={equipmentId}
                                            onChange={e => setEquipmentId(e.target.value)}
                                        />
                                        {validationErrors.equipmentId && (
                                            <div className="invalid-feedback">{validationErrors.equipmentId}</div>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" htmlFor="borrowerType">Tipo de tomador</label>
                                        <select
                                            id="borrowerType"
                                            className="form-select"
                                            value={borrowerType}
                                            onChange={e => {
                                                setBorrowerType(e.target.value as 'professor' | 'student');
                                                setBorrowerId('');
                                            }}
                                        >
                                            <option value="student">Aluno</option>
                                            <option value="professor">Professor</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label" htmlFor="borrowerId">
                                            ID do {borrowerType === 'professor' ? 'professor' : 'aluno'}
                                        </label>
                                        <input
                                            id="borrowerId"
                                            type="number"
                                            min={1}
                                            className={`form-control ${validationErrors.borrowerId ? 'is-invalid' : ''}`}
                                            value={borrowerId}
                                            onChange={e => setBorrowerId(e.target.value)}
                                        />
                                        {validationErrors.borrowerId && (
                                            <div className="invalid-feedback">{validationErrors.borrowerId}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading}>
                                    {loading ? 'Salvando...' : 'Salvar alterações'}
                                </button>
                                <Link to={`/borrows/${borrow.id}`} className="btn btn-outline-secondary w-100">
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

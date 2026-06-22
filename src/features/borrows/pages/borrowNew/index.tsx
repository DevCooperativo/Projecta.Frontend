import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { borrowsServices } from '@/api/borrows/implementation/borrowsServices';
import { equipmentsServices } from '@/api/equipments/implementation/equipmentsServices';
import type { EquipmentResponse } from '@/api/equipments/iEquipmentsServices';
import { useAuth } from '@/context/auth/useAuth';

export const BorrowNew = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const today = new Date().toISOString().slice(0, 10);

    const [equipmentId, setEquipmentId] = useState('');
    const [borrowDate, setBorrowDate] = useState(today);
    const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
    const [loadingEquipments, setLoadingEquipments] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        equipmentsServices.list()
            .then(res => setEquipments(res.data ?? []))
            .catch(() => setError('Não foi possível carregar os equipamentos.'))
            .finally(() => setLoadingEquipments(false));
    }, []);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!equipmentId) errs.equipmentId = 'Selecione um equipamento';
        if (!borrowDate) errs.borrowDate = 'Informe a data do empréstimo';
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
            await borrowsServices.create({
                equipmentId: Number(equipmentId),
                borrowDate,
                ...(user?.profileType === 'professor'
                    ? { professorId: user.id }
                    : { studentId: user?.id }),
            });
            navigate('/borrows');
        } catch {
            setError('Não foi possível registrar o empréstimo. Verifique se o equipamento está disponível.');
        } finally {
            setLoading(false);
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
                            <li className="breadcrumb-item active">Novo</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Novo empréstimo</h4>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Dados do empréstimo</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="equipmentId">Equipamento</label>
                                        <select
                                            id="equipmentId"
                                            className={`form-select ${validationErrors.equipmentId ? 'is-invalid' : ''}`}
                                            value={equipmentId}
                                            onChange={e => setEquipmentId(e.target.value)}
                                            disabled={loadingEquipments}
                                        >
                                            <option value="">
                                                {loadingEquipments ? 'Carregando...' : 'Selecione um equipamento'}
                                            </option>
                                            {equipments.map(eq => (
                                                <option key={eq.id} value={eq.id}>{eq.name}</option>
                                            ))}
                                        </select>
                                        {validationErrors.equipmentId && (
                                            <div className="invalid-feedback">{validationErrors.equipmentId}</div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="borrowDate">Data do empréstimo</label>
                                        <input
                                            id="borrowDate"
                                            type="date"
                                            className={`form-control ${validationErrors.borrowDate ? 'is-invalid' : ''}`}
                                            value={borrowDate}
                                            onChange={e => setBorrowDate(e.target.value)}
                                        />
                                        {validationErrors.borrowDate && (
                                            <div className="invalid-feedback">{validationErrors.borrowDate}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white d-flex flex-column gap-2">
                                <button type="submit" className="btn btn-dark w-100" disabled={loading || loadingEquipments}>
                                    {loading ? 'Registrando...' : 'Registrar empréstimo'}
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

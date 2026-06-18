import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { borrows } from '@/mocks/borrows';
import { StatusBadge } from '@/components/StatusBadge';

export const Dashboard = () => {
    const pendingBorrows = useMemo(
        () => borrows.filter(b => b.status === 'pending').sort((a, b) => a.expectedReturnDate.localeCompare(b.expectedReturnDate)).slice(0, 5),
        []
    );
    const pendingCount = borrows.filter(b => b.status === 'pending').length;

    const today = new Date().toISOString().slice(0, 10);

    return (
        <>
            <div className="mb-4">
                <h4 className="fw-bold mb-0">Dashboard</h4>
                <p className="text-muted small mb-0">Visão geral do sistema</p>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Projetos ativos</p>
                            <h3 className="fw-bold mb-0">0</h3>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Laboratórios ativos</p>
                            <h3 className="fw-bold mb-0">0</h3>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Empréstimos pendentes</p>
                            <h3 className="fw-bold mb-0">{pendingCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card h-100">
                        <div className="card-body">
                            <p className="text-muted small mb-1">Usuários em projetos</p>
                            <h3 className="fw-bold mb-0">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="fw-semibold mb-3">Ações rápidas</h6>
                            <div className="d-flex flex-wrap gap-2">
                                <span className="btn btn-outline-secondary btn-sm disabled">Novo projeto</span>
                                <Link to="/borrows/new" className="btn btn-dark btn-sm">Novo empréstimo</Link>
                                <Link to="/professors/new" className="btn btn-outline-dark btn-sm">Cadastrar professor</Link>
                                <Link to="/students/new" className="btn btn-outline-dark btn-sm">Cadastrar aluno</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h6 className="fw-semibold mb-0">Empréstimos pendentes</h6>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Equipamento</th>
                                        <th>Tomador</th>
                                        <th>Devolução prevista</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingBorrows.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted py-4">
                                                Nenhum empréstimo pendente.
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingBorrows.map(b => {
                                            const overdue = b.expectedReturnDate < today;
                                            return (
                                                <tr key={b.id}>
                                                    <td>{b.equipmentName}</td>
                                                    <td>
                                                        {b.borrowerName}
                                                        <span className="badge bg-secondary-subtle text-secondary ms-2 fw-normal">
                                                            {b.borrowerType === 'professor' ? 'Professor' : 'Aluno'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={overdue ? 'text-danger fw-semibold' : ''}>
                                                            {b.expectedReturnDate}
                                                        </span>
                                                        {overdue && <span className="badge bg-danger-subtle text-danger ms-2 fw-normal">Atrasado</span>}
                                                    </td>
                                                    <td><StatusBadge status={b.status} /></td>
                                                    <td>
                                                        <Link to={`/borrows/${b.id}/close`} className="btn btn-sm btn-outline-dark">
                                                            Encerrar
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pendingBorrows.length > 0 && (
                            <div className="card-footer bg-white text-end">
                                <Link to="/borrows" className="btn btn-sm btn-outline-secondary">
                                    Ver todos os empréstimos
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

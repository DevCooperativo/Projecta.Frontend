import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/context/auth/useAuth';
import { administratorsServices } from '@/api/administrators/implementation/administratorsServices';
import type { AdministratorResponse } from '@/api/administrators/iAdministratorsServices';

export const AdminDetail = () => {
    const { user } = useAuth();
    const [admin, setAdmin] = useState<AdministratorResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        administratorsServices.get(user.id)
            .then(setAdmin)
            .catch(() => setAdmin(null))
            .finally(() => setLoading(false));
    }, [user]);

    const displayName = admin?.name ?? user?.name ?? user?.email ?? 'Administrador';
    const displayEmail = admin?.email ?? user?.email ?? '';

    if (loading) {
        return <div className="text-center py-5 text-muted">Carregando...</div>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1 small">
                            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
                            <li className="breadcrumb-item active">Meu perfil</li>
                        </ol>
                    </nav>
                    <h4 className="fw-bold mb-0">Meu perfil</h4>
                </div>
                <Link to="/admin/edit" className="btn btn-outline-dark">
                    Editar
                </Link>
            </div>

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                <Avatar name={displayName} variant="admin" size="md" />
                                <div>
                                    <h5 className="fw-bold mb-0">{displayName}</h5>
                                    <p className="text-muted mb-0">{displayEmail}</p>
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">E-mail</p>
                                    <p className="fw-semibold mb-0">{displayEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card mb-3">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Conta</h6>
                            <div className="mb-2">
                                <p className="text-muted small mb-1">Nível de acesso</p>
                                <span className="badge bg-dark fw-normal">Administrador</span>
                            </div>
                            <div>
                                <p className="text-muted small mb-1">Instituição</p>
                                <p className="mb-0">Instituto Tecnológico do Litoral</p>
                            </div>
                        </div>
                    </div>
                    {admin && (
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Informações do registro</h6>
                                <div>
                                    <p className="text-muted small mb-0">Atualizado em</p>
                                    <p className="mb-0">{admin.updatedAt}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

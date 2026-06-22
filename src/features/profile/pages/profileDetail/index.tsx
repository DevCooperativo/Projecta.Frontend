import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Avatar';
import { administratorsServices } from '@/api/administrators/implementation/administratorsServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import { studentsServices } from '@/api/students/implementation/studentsServices';
import type { AdministratorResponse } from '@/api/administrators/iAdministratorsServices';
import type { ProfessorResponse, BorrowMetrics as ProfessorBorrowMetrics } from '@/api/professors/iProfessorsServices';
import type { StudentResponse } from '@/api/students/iStudentsServices';
import { useSelector } from 'react-redux';
import type { RootState } from '@/state/store';

type ProfileData = AdministratorResponse | ProfessorResponse | StudentResponse | null;

export const ProfileDetail = () => {
    const user = useSelector((state: RootState) => state.user);
    const [profile, setProfile] = useState<ProfileData>(null);
    const [metrics, setMetrics] = useState<ProfessorBorrowMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(user)
        if (!user?.id || !user.profileType) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {

            try {
                if (user.profileType === 'admin') {
                    const res = await administratorsServices.get(user.id!);
                    if (res.data) setProfile(res.data);
                } else if (user.profileType === 'professor') {
                    const [profRes, metricsRes] = await Promise.all([
                        professorsServices.get(user.id!),
                        professorsServices.metrics(),
                    ]);
                    if (profRes.data) setProfile(profRes.data);
                    if (metricsRes.data) setMetrics(metricsRes.data);
                } else {
                    const [stuRes, metricsRes] = await Promise.all([
                        studentsServices.get(user.id!),
                        studentsServices.metrics(),
                    ]);
                    if (stuRes.data) setProfile(stuRes.data);
                    if (metricsRes.data) setMetrics(metricsRes.data);
                }
            } catch {
                // fall through — display Redux fallback data
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const displayName = (profile as { name?: string })?.name ?? user?.name ?? user?.email ?? 'Usuário';
    const displayEmail = (profile as { email?: string })?.email ?? user?.email ?? '';

    const avatarVariant = user?.profileType === 'admin' ? 'admin' : user?.profileType === 'professor' ? 'professor' : 'student';
    const roleName = user?.profileType === 'admin' ? 'Administrador' : user?.profileType === 'professor' ? 'Professor' : 'Aluno';
    const badgeClass = user?.profileType === 'admin' ? 'bg-dark' : user?.profileType === 'professor' ? 'bg-secondary' : 'bg-primary';

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
                <Link to="/profile/edit" className="btn btn-outline-dark">Editar</Link>
            </div>

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card mb-3">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                <Avatar name={displayName} variant={avatarVariant} size="md" />
                                <div>
                                    <h5 className="fw-bold mb-0">{displayName}</h5>
                                    <p className="text-muted mb-0 small">{displayEmail}</p>
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <p className="text-muted small mb-1">E-mail</p>
                                    <p className="fw-semibold mb-0">{displayEmail}</p>
                                </div>
                                {user?.profileType === 'professor' && profile && (
                                    <>
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Matrícula/SIAPE</p>
                                            <p className="fw-semibold mb-0">{(profile as ProfessorResponse).registration}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Telefone</p>
                                            <p className="fw-semibold mb-0">{(profile as ProfessorResponse).telephone}</p>
                                        </div>
                                    </>
                                )}
                                {user?.profileType === 'student' && profile && (
                                    <>
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Matrícula</p>
                                            <p className="fw-semibold mb-0">{(profile as StudentResponse).registration}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Período</p>
                                            <p className="fw-semibold mb-0">{(profile as StudentResponse).term}°</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Turno</p>
                                            <p className="fw-semibold mb-0">{(profile as StudentResponse).shift}</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <p className="text-muted small mb-1">Data de nascimento</p>
                                            <p className="fw-semibold mb-0">{(profile as StudentResponse).birthdate}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {user?.profileType !== 'admin' && (
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Atividade de empréstimos</h6>
                                <div className="row g-3 mb-3">
                                    <div className="col-4">
                                        <div className="text-center p-3 rounded bg-light">
                                            <p className="fs-4 fw-bold mb-0">{metrics?.total ?? 0}</p>
                                            <p className="text-muted small mb-0">Total</p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="text-center p-3 rounded" style={{ backgroundColor: '#fff3cd' }}>
                                            <p className="fs-4 fw-bold mb-0 text-warning-emphasis">{metrics?.active ?? 0}</p>
                                            <p className="text-muted small mb-0">Ativos</p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="text-center p-3 rounded" style={{ backgroundColor: '#d1e7dd' }}>
                                            <p className="fs-4 fw-bold mb-0 text-success-emphasis">{metrics?.finished ?? 0}</p>
                                            <p className="text-muted small mb-0">Concluídos</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <Link to="/borrows" className="text-decoration-none small">
                                        Ver todos os empréstimos →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-lg-4">
                    <div className="card mb-3">
                        <div className="card-body p-4">
                            <h6 className="fw-semibold mb-3">Conta</h6>
                            <div className="mb-2">
                                <p className="text-muted small mb-1">Tipo de perfil</p>
                                <span className={`badge fw-normal ${badgeClass}`}>{roleName}</span>
                            </div>
                            <div>
                                <p className="text-muted small mb-1">Instituição</p>
                                <p className="mb-0 small">Instituto Tecnológico do Litoral</p>
                            </div>
                        </div>
                    </div>
                    {profile && (
                        <div className="card">
                            <div className="card-body p-4">
                                <h6 className="fw-semibold mb-3">Informações do registro</h6>
                                <div className="mb-2">
                                    <p className="text-muted small mb-0">Criado em</p>
                                    <p className="mb-0 small">{profile.createdAt}</p>
                                </div>
                                <div>
                                    <p className="text-muted small mb-0">Atualizado em</p>
                                    <p className="mb-0 small">{profile.updatedAt}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

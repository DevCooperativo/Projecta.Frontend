import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import { professorsServices } from '@/api/professors/implementation/professorsServices';
import { ConfirmModal } from '@/components/ConfirmModal';

const date = (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-';

export const LaboratoryDetail = () => {
    const { id } = useParams(); const navigate = useNavigate();
    const [item, setItem] = useState<LaboratoryResponse | null>(null);
    const [responsible, setResponsible] = useState('-');
    const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false); const [error, setError] = useState<string | null>(null);
    useEffect(() => { if (!id) return; Promise.all([laboratoriesServices.get(Number(id)), professorsServices.list()]).then(([lab, professors]) => {
        setItem(lab.data ?? null); const professor = professors.data?.find(p => p.id === lab.data?.professorId); if (professor) setResponsible(professor.name);
    }).finally(() => setLoading(false)); }, [id]);
    if (loading) return <div className="text-center text-muted py-5">Carregando...</div>;
    if (!item) return <div className="text-center text-muted py-5">Laboratório não encontrado. <Link to="/laboratories">Voltar</Link></div>;
    const remove = async () => { try { await laboratoriesServices.remove(item.id); navigate('/laboratories'); } catch { setShowModal(false); setError('Não foi possível excluir. Verifique se existem projetos ou empréstimos vinculados.'); } };
    return <>
        <div className="d-flex justify-content-between align-items-start mb-4"><div><nav><ol className="breadcrumb mb-1 small"><li className="breadcrumb-item"><Link to="/">Início</Link></li><li className="breadcrumb-item"><Link to="/laboratories">Laboratórios</Link></li><li className="breadcrumb-item active">{item.name}</li></ol></nav><h4 className="fw-bold mb-0">{item.name}</h4></div>
        <div className="d-flex gap-2"><Link className="btn btn-outline-dark" to={`/laboratories/${item.id}/edit`}>Editar</Link><button className="btn btn-outline-danger" onClick={() => setShowModal(true)}>Excluir</button></div></div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-4"><div className="col-lg-8"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados do laboratório</h6><div className="row g-3">
            <div className="col-md-8"><p className="text-muted small mb-1">Nome</p><p className="fw-semibold mb-0">{item.name}</p></div><div className="col-md-4"><p className="text-muted small mb-1">Capacidade</p><p className="mb-0">{item.maxOccupants} pessoas</p></div>
            <div className="col-md-8"><p className="text-muted small mb-1">Professor responsável</p><p className="mb-0">{responsible}</p></div><div className="col-md-4"><p className="text-muted small mb-1">Armazenamento</p><p className="mb-0">{item.storageSpace ? 'Sim' : 'Não'}</p></div>
            <div className="col-12"><p className="text-muted small mb-1">Descrição</p><p className="mb-0">{item.description}</p></div>
        </div></div></div></div><div className="col-lg-4"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Informações do registro</h6><p className="text-muted small mb-1">Cadastrado em</p><p>{date(item.createdAt)}</p><p className="text-muted small mb-1">Atualizado em</p><p className="mb-0">{date(item.updatedAt)}</p></div></div></div></div>
        <ConfirmModal show={showModal} title="Excluir laboratório" message={`Tem certeza que deseja excluir "${item.name}"? Esta ação não pode ser desfeita.`} confirmLabel="Excluir" onConfirm={remove} onCancel={() => setShowModal(false)} />
    </>;
};

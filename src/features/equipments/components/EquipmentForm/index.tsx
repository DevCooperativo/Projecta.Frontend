import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { EquipmentResponse } from '@/api/equipments/iEquipmentsServices';
import { equipmentsServices } from '@/api/equipments/implementation/equipmentsServices';
import type { LaboratoryResponse } from '@/api/laboratories/iLaboratoriesServices';
import { laboratoriesServices } from '@/api/laboratories/implementation/laboratoriesServices';
import type { ProjectResponse } from '@/api/projects/iProjectsServices';
import { projectsServices } from '@/api/projects/implementation/projectsServices';
import type { EquipmentCategoryResponse } from '@/api/equipmentCategories/iEquipmentCategoriesServices';
import { equipmentCategoriesServices } from '@/api/equipmentCategories/implementation/equipmentCategoriesServices';
import { equipmentSchema, type EquipmentValues } from '@/schemas/equipments/equipmentSchema';

interface Props { mode: 'new' | 'edit'; equipmentId?: number }

export const EquipmentForm = ({ mode, equipmentId }: Props) => {
    const navigate = useNavigate(); const [equipment, setEquipment] = useState<EquipmentResponse | null>(null);
    const [labs, setLabs] = useState<LaboratoryResponse[]>([]); const [projects, setProjects] = useState<ProjectResponse[]>([]); const [categories, setCategories] = useState<EquipmentCategoryResponse[]>([]);
    const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<EquipmentValues>({ resolver: yupResolver(equipmentSchema) });
    const laboratoryId = watch('laboratoryId');
    const compatibleProjects = useMemo(() => projects.filter(p => !laboratoryId || p.laboratoryId === laboratoryId), [projects, laboratoryId]);

    useEffect(() => {
        const requests: Promise<unknown>[] = [
            laboratoriesServices.list().then(r => setLabs(r.data ?? [])), projectsServices.list().then(r => setProjects(r.data ?? [])), equipmentCategoriesServices.list().then(r => setCategories(r.data ?? [])),
        ];
        if (mode === 'edit' && equipmentId) requests.push(equipmentsServices.get(equipmentId).then(r => { if (r.data) { setEquipment(r.data); reset({ name: r.data.name, laboratoryId: r.data.laboratoryId, projectId: r.data.projectId, equipmentCategoryId: r.data.equipmentCategoryId }); } }));
        Promise.all(requests).catch(() => setError('Não foi possível carregar os dados do formulário.'));
    }, [mode, equipmentId, reset]);

    const submit = async (values: EquipmentValues) => { setLoading(true); setError(null); try { if (mode === 'new') { await equipmentsServices.create(values); navigate('/equipments'); } else if (equipmentId) { await equipmentsServices.update(equipmentId, values); navigate(`/equipments/${equipmentId}`); } } catch { setError('Não foi possível salvar o equipamento. Verifique os vínculos e tente novamente.'); } finally { setLoading(false); } };
    return <><div className="mb-4"><nav><ol className="breadcrumb mb-1 small"><li className="breadcrumb-item"><Link to="/">Início</Link></li><li className="breadcrumb-item"><Link to="/equipments">Equipamentos</Link></li>{equipment && <li className="breadcrumb-item"><Link to={`/equipments/${equipment.id}`}>{equipment.name}</Link></li>}<li className="breadcrumb-item active">{mode === 'new' ? 'Novo' : 'Editar'}</li></ol></nav><h4 className="fw-bold mb-0">{mode === 'new' ? 'Novo equipamento' : 'Editar equipamento'}</h4></div>
        {error && <div className="alert alert-danger">{error}</div>}<form onSubmit={handleSubmit(submit)} noValidate><div className="row g-4"><div className="col-lg-8"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados do equipamento</h6><div className="row g-3">
            <div className="col-12"><label className="form-label fw-semibold small" htmlFor="name">Nome</label><input {...register('name')} id="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Ex: Osciloscópio Digital" />{errors.name && <div className="invalid-feedback">{errors.name.message}</div>}</div>
            <div className="col-md-6"><label className="form-label fw-semibold small" htmlFor="laboratoryId">Laboratório</label><select {...register('laboratoryId', { valueAsNumber: true, onChange: () => setValue('projectId', Number.NaN) })} id="laboratoryId" className={`form-select ${errors.laboratoryId ? 'is-invalid' : ''}`}><option value="">Selecione...</option>{labs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select>{errors.laboratoryId && <div className="invalid-feedback">{errors.laboratoryId.message}</div>}</div>
            <div className="col-md-6"><label className="form-label fw-semibold small" htmlFor="projectId">Projeto</label><select {...register('projectId', { valueAsNumber: true })} id="projectId" disabled={!laboratoryId} className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}><option value="">{laboratoryId ? 'Selecione...' : 'Selecione primeiro o laboratório'}</option>{compatibleProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>{errors.projectId && <div className="invalid-feedback">{errors.projectId.message}</div>}<div className="form-text">Somente projetos vinculados ao laboratório selecionado são exibidos.</div></div>
            <div className="col-12"><label className="form-label fw-semibold small" htmlFor="equipmentCategoryId">Categoria</label><select {...register('equipmentCategoryId', { valueAsNumber: true })} id="equipmentCategoryId" className={`form-select ${errors.equipmentCategoryId ? 'is-invalid' : ''}`}><option value="">Selecione...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.description} — {c.powerSource}</option>)}</select>{errors.equipmentCategoryId && <div className="invalid-feedback">{errors.equipmentCategoryId.message}</div>}</div>
        </div></div></div></div><div className="col-lg-4"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-3">Regras de cadastro</h6><ul className="small text-muted ps-3 mb-0"><li className="mb-2">O equipamento deve pertencer a um laboratório.</li><li className="mb-2">O projeto deve estar vinculado ao mesmo laboratório.</li><li>A categoria deve estar previamente cadastrada.</li></ul></div><div className="card-footer bg-white d-grid gap-2"><button className="btn btn-dark" disabled={loading}>{loading ? 'Salvando...' : 'Salvar equipamento'}</button><Link className="btn btn-outline-secondary" to={equipmentId ? `/equipments/${equipmentId}` : '/equipments'}>Cancelar</Link></div></div></div></div></form>
    </>;
};

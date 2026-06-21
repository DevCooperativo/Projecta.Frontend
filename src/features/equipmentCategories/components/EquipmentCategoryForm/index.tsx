import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { EQUIPMENT_POWER_SOURCES, type EquipmentCategoryResponse } from '@/api/equipmentCategories/iEquipmentCategoriesServices';
import { equipmentCategoriesServices } from '@/api/equipmentCategories/implementation/equipmentCategoriesServices';
import { equipmentCategorySchema, type EquipmentCategoryValues } from '@/schemas/equipmentCategories/equipmentCategorySchema';

interface Props { mode: 'new' | 'edit'; categoryId?: number }

export const EquipmentCategoryForm = ({ mode, categoryId }: Props) => {
    const navigate = useNavigate(); const [category, setCategory] = useState<EquipmentCategoryResponse | null>(null);
    const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EquipmentCategoryValues>({ resolver: yupResolver(equipmentCategorySchema), defaultValues: { fragile: false } });
    useEffect(() => { if (mode === 'edit' && categoryId) equipmentCategoriesServices.get(categoryId).then(r => { if (r.data) { setCategory(r.data); reset({ powerSource: r.data.powerSource, fragile: r.data.fragile, description: r.data.description }); } }).catch(() => setError('Não foi possível carregar a categoria.')); }, [mode, categoryId, reset]);
    const submit = async (values: EquipmentCategoryValues) => { setLoading(true); setError(null); try { if (mode === 'new') { await equipmentCategoriesServices.create(values); navigate('/equipment-categories'); } else if (categoryId) { await equipmentCategoriesServices.update(categoryId, values); navigate(`/equipment-categories/${categoryId}`); } } catch { setError('Não foi possível salvar a categoria. Verifique os dados e tente novamente.'); } finally { setLoading(false); } };
    return <>
        <div className="mb-4"><nav><ol className="breadcrumb mb-1 small"><li className="breadcrumb-item"><Link to="/">Início</Link></li><li className="breadcrumb-item"><Link to="/equipment-categories">Categorias de equipamentos</Link></li>{category && <li className="breadcrumb-item"><Link to={`/equipment-categories/${category.id}`}>{category.description}</Link></li>}<li className="breadcrumb-item active">{mode === 'new' ? 'Nova' : 'Editar'}</li></ol></nav><h4 className="fw-bold mb-0">{mode === 'new' ? 'Nova categoria de equipamento' : 'Editar categoria de equipamento'}</h4></div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit(submit)} noValidate><div className="row g-4"><div className="col-lg-8"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados da categoria</h6><div className="row g-3">
            <div className="col-12"><label className="form-label fw-semibold small" htmlFor="powerSource">Fonte de alimentação para funcionamento</label><select {...register('powerSource')} id="powerSource" className={`form-select ${errors.powerSource ? 'is-invalid' : ''}`}><option value="">Selecione...</option>{EQUIPMENT_POWER_SOURCES.map(source => <option key={source} value={source}>{source}</option>)}</select>{errors.powerSource && <div className="invalid-feedback">{errors.powerSource.message}</div>}</div>
            <div className="col-12"><label className="form-label fw-semibold small" htmlFor="description">Descrição</label><textarea {...register('description')} id="description" rows={4} className={`form-control ${errors.description ? 'is-invalid' : ''}`} placeholder="Descreva os equipamentos pertencentes a esta categoria..." />{errors.description && <div className="invalid-feedback">{errors.description.message}</div>}</div>
        </div></div></div></div><div className="col-lg-4"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Configurações</h6><div className="form-check form-switch"><input {...register('fragile')} id="fragile" type="checkbox" className="form-check-input" /><label className="form-check-label" htmlFor="fragile">Equipamento frágil</label></div><p className="small text-muted mt-2 mb-0">Marque esta opção quando a categoria exigir cuidados especiais de manuseio.</p></div><div className="card-footer bg-white d-grid gap-2"><button className="btn btn-dark" disabled={loading}>{loading ? 'Salvando...' : 'Salvar categoria'}</button><Link className="btn btn-outline-secondary" to={categoryId ? `/equipment-categories/${categoryId}` : '/equipment-categories'}>Cancelar</Link></div></div></div></div></form>
    </>;
};

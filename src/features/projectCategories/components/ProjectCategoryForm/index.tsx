import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { KNOWLEDGE_AREAS, type ProjectCategoryResponse } from '@/api/projectCategories/iProjectCategoriesServices';
import { projectCategoriesServices } from '@/api/projectCategories/implementation/projectCategoriesServices';
import { projectCategorySchema, type ProjectCategoryValues } from '@/schemas/projectCategories/projectCategorySchema';

interface Props { mode: 'new' | 'edit'; categoryId?: number }

export const ProjectCategoryForm = ({ mode, categoryId }: Props) => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<ProjectCategoryResponse | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectCategoryValues>({
        resolver: yupResolver(projectCategorySchema),
        defaultValues: { commerciallyRelevant: false },
    });

    useEffect(() => {
        if (mode === 'edit' && categoryId) {
            projectCategoriesServices.get(categoryId).then(response => {
                if (!response.data) return;
                setCategory(response.data);
                reset({
                    name: response.data.name,
                    area: response.data.area,
                    description: response.data.description,
                    commerciallyRelevant: response.data.commerciallyRelevant,
                });
            }).catch(() => setServerError('Não foi possível carregar a categoria.'));
        }
    }, [mode, categoryId, reset]);

    const onSubmit = async (values: ProjectCategoryValues) => {
        setLoading(true); setServerError(null);
        try {
            if (mode === 'new') {
                await projectCategoriesServices.create(values);
                navigate('/project-categories');
            } else if (categoryId) {
                await projectCategoriesServices.update(categoryId, values);
                navigate(`/project-categories/${categoryId}`);
            }
        } catch {
            setServerError('Não foi possível salvar a categoria. Verifique os dados e tente novamente.');
        } finally { setLoading(false); }
    };

    return <>
        <div className="mb-4"><nav><ol className="breadcrumb mb-1 small">
            <li className="breadcrumb-item"><Link to="/">Início</Link></li>
            <li className="breadcrumb-item"><Link to="/project-categories">Categorias de projetos</Link></li>
            {category && <li className="breadcrumb-item"><Link to={`/project-categories/${category.id}`}>{category.name}</Link></li>}
            <li className="breadcrumb-item active">{mode === 'new' ? 'Nova' : 'Editar'}</li>
        </ol></nav><h4 className="fw-bold mb-0">{mode === 'new' ? 'Nova categoria de projeto' : 'Editar categoria de projeto'}</h4></div>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate><div className="row g-4">
            <div className="col-lg-8"><div className="card"><div className="card-body p-4">
                <h6 className="fw-semibold mb-4 pb-2 border-bottom">Dados da categoria</h6><div className="row g-3">
                    <div className="col-12"><label className="form-label fw-semibold small" htmlFor="name">Nome</label><input {...register('name')} id="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Ex: Inovação Tecnológica" />{errors.name && <div className="invalid-feedback">{errors.name.message}</div>}</div>
                    <div className="col-12"><label className="form-label fw-semibold small" htmlFor="area">Área do conhecimento</label><select {...register('area')} id="area" className={`form-select ${errors.area ? 'is-invalid' : ''}`}><option value="">Selecione...</option>{KNOWLEDGE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}</select>{errors.area && <div className="invalid-feedback">{errors.area.message}</div>}</div>
                    <div className="col-12"><label className="form-label fw-semibold small" htmlFor="description">Descrição</label><textarea {...register('description')} id="description" rows={4} className={`form-control ${errors.description ? 'is-invalid' : ''}`} placeholder="Descreva a finalidade e o escopo desta categoria..." />{errors.description && <div className="invalid-feedback">{errors.description.message}</div>}</div>
                </div>
            </div></div></div>
            <div className="col-lg-4"><div className="card"><div className="card-body p-4"><h6 className="fw-semibold mb-4 pb-2 border-bottom">Configurações</h6><div className="form-check form-switch"><input {...register('commerciallyRelevant')} id="commerciallyRelevant" type="checkbox" className="form-check-input" /><label className="form-check-label" htmlFor="commerciallyRelevant">Possui relevância comercial</label></div><p className="small text-muted mt-2 mb-0">Indica categorias voltadas a resultados com potencial de mercado.</p></div><div className="card-footer bg-white d-grid gap-2"><button className="btn btn-dark" disabled={loading}>{loading ? 'Salvando...' : 'Salvar categoria'}</button><Link className="btn btn-outline-secondary" to={categoryId ? `/project-categories/${categoryId}` : '/project-categories'}>Cancelar</Link></div></div></div>
        </div></form>
    </>;
};

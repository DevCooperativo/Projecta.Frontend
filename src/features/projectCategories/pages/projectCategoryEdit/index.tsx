import { useParams } from 'react-router-dom';
import { ProjectCategoryForm } from '../../components/ProjectCategoryForm';
export const ProjectCategoryEdit = () => { const { id } = useParams(); return <ProjectCategoryForm mode="edit" categoryId={Number(id)} />; };

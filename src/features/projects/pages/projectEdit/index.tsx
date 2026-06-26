import { useParams } from 'react-router-dom';
import { ProjectForm } from '@/features/projects/components/ProjectForm';

export const ProjectEdit = () => {
    const { id } = useParams<{ id: string }>();
    return <ProjectForm mode="edit" projectId={Number(id)} />;
};

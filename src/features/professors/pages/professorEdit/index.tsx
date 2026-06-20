import { useParams } from 'react-router-dom';
import { ProfessorForm } from '@/features/professors/components/ProfessorForm';

export const ProfessorEdit = () => {
    const { id } = useParams<{ id: string }>();
    return <ProfessorForm mode="edit" professorId={Number(id)} />;
};

import { useParams } from 'react-router-dom';
import { CoordinationForm } from '@/features/coordinations/components/CoordinationForm';

export const CoordinationEdit = () => {
    const { id } = useParams<{ id: string }>();
    return <CoordinationForm mode="edit" coordinationId={Number(id)} />;
};

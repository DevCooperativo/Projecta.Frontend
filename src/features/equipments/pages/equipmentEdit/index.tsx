import { Navigate, useParams } from 'react-router-dom';
import { EquipmentForm } from '../../components/EquipmentForm';
import { useAuth } from '@/context/auth/useAuth';

export const EquipmentEdit = () => {
    const { id } = useParams();
    const { user } = useAuth();
    return user?.profileType === 'professor'
        ? <EquipmentForm mode="edit" equipmentId={Number(id)} />
        : <Navigate to="/equipments" replace />;
};

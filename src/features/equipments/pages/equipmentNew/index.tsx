import { Navigate } from 'react-router-dom';
import { EquipmentForm } from '../../components/EquipmentForm';
import { useAuth } from '@/context/auth/useAuth';

export const EquipmentNew = () => {
    const { user } = useAuth();
    return user?.profileType === 'professor' ? <EquipmentForm mode="new" /> : <Navigate to="/equipments" replace />;
};

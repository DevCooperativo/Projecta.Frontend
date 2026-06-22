import { useParams } from 'react-router-dom';
import { EquipmentCategoryForm } from '../../components/EquipmentCategoryForm';
export const EquipmentCategoryEdit = () => { const { id } = useParams(); return <EquipmentCategoryForm mode="edit" categoryId={Number(id)} />; };

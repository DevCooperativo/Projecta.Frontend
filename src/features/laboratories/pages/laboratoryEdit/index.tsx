import { useParams } from 'react-router-dom';
import { LaboratoryForm } from '../../components/LaboratoryForm';
export const LaboratoryEdit = () => { const { id } = useParams(); return <LaboratoryForm mode="edit" laboratoryId={Number(id)} />; };

import { useParams } from 'react-router-dom';
import { StudentForm } from '@/features/students/components/StudentForm';

export const StudentEdit = () => {
    const { id } = useParams<{ id: string }>();
    return <StudentForm mode="edit" studentId={Number(id)} />;
};

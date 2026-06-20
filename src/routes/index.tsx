import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from '@/features/auth/pages/login';
import { Register } from '@/features/auth/pages/register';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute';
import { DefaultStructure } from '@/features/_layout/components/DefaultStructure/defaultStructure';
import { Dashboard } from '@/features/dashboard/pages/dashboard';
import { ProfessorList } from '@/features/professors/pages/professorList';
import { ProfessorDetail } from '@/features/professors/pages/professorDetail';
import { ProfessorNew } from '@/features/professors/pages/professorNew';
import { ProfessorEdit } from '@/features/professors/pages/professorEdit';
import { StudentList } from '@/features/students/pages/studentList';
import { StudentDetail } from '@/features/students/pages/studentDetail';
import { StudentNew } from '@/features/students/pages/studentNew';
import { StudentEdit } from '@/features/students/pages/studentEdit';
import { BorrowList } from '@/features/borrows/pages/borrowList';
import { BorrowNew } from '@/features/borrows/pages/borrowNew';
import { BorrowClose } from '@/features/borrows/pages/borrowClose';
import { AdminDetail } from '@/features/admin/pages/adminDetail';
import { AdminEdit } from '@/features/admin/pages/adminEdit';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicOnlyRoute>
                            <Register />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <DefaultStructure />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="/professors" element={<ProfessorList />} />
                    <Route path="/professors/new" element={<ProfessorNew />} />
                    <Route path="/professors/:id" element={<ProfessorDetail />} />
                    <Route path="/professors/:id/edit" element={<ProfessorEdit />} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/students/new" element={<StudentNew />} />
                    <Route path="/students/:id" element={<StudentDetail />} />
                    <Route path="/students/:id/edit" element={<StudentEdit />} />
                    <Route path="/borrows" element={<BorrowList />} />
                    <Route path="/borrows/new" element={<BorrowNew />} />
                    <Route path="/borrows/:id/close" element={<BorrowClose />} />
                    <Route path="/admin" element={<AdminDetail />} />
                    <Route path="/admin/edit" element={<AdminEdit />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

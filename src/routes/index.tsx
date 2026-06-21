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
import { CoordinationList } from '@/features/coordinations/pages/coordinationList';
import { CoordinationDetail } from '@/features/coordinations/pages/coordinationDetail';
import { CoordinationNew } from '@/features/coordinations/pages/coordinationNew';
import { CoordinationEdit } from '@/features/coordinations/pages/coordinationEdit';
import { ProjectList } from '@/features/projects/pages/projectList';
import { ProjectDetail } from '@/features/projects/pages/projectDetail';
import { ProjectNew } from '@/features/projects/pages/projectNew';
import { ProjectEdit } from '@/features/projects/pages/projectEdit';
import { LaboratoryList } from '@/features/laboratories/pages/laboratoryList';
import { LaboratoryDetail } from '@/features/laboratories/pages/laboratoryDetail';
import { LaboratoryNew } from '@/features/laboratories/pages/laboratoryNew';
import { LaboratoryEdit } from '@/features/laboratories/pages/laboratoryEdit';
import { EquipmentCategoryList } from '@/features/equipmentCategories/pages/equipmentCategoryList';
import { EquipmentCategoryDetail } from '@/features/equipmentCategories/pages/equipmentCategoryDetail';
import { EquipmentCategoryNew } from '@/features/equipmentCategories/pages/equipmentCategoryNew';
import { EquipmentCategoryEdit } from '@/features/equipmentCategories/pages/equipmentCategoryEdit';
import { EquipmentList } from '@/features/equipments/pages/equipmentList';
import { EquipmentDetail } from '@/features/equipments/pages/equipmentDetail';
import { EquipmentNew } from '@/features/equipments/pages/equipmentNew';
import { EquipmentEdit } from '@/features/equipments/pages/equipmentEdit';
import { ProjectCategoryList } from '@/features/projectCategories/pages/projectCategoryList';
import { ProjectCategoryDetail } from '@/features/projectCategories/pages/projectCategoryDetail';
import { ProjectCategoryNew } from '@/features/projectCategories/pages/projectCategoryNew';
import { ProjectCategoryEdit } from '@/features/projectCategories/pages/projectCategoryEdit';

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
                    <Route path="/coordinations" element={<CoordinationList />} />
                    <Route path="/coordinations/new" element={<CoordinationNew />} />
                    <Route path="/coordinations/:id" element={<CoordinationDetail />} />
                    <Route path="/coordinations/:id/edit" element={<CoordinationEdit />} />
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/projects/new" element={<ProjectNew />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/projects/:id/edit" element={<ProjectEdit />} />
                    <Route path="/project-categories" element={<ProjectCategoryList />} />
                    <Route path="/project-categories/new" element={<ProjectCategoryNew />} />
                    <Route path="/project-categories/:id" element={<ProjectCategoryDetail />} />
                    <Route path="/project-categories/:id/edit" element={<ProjectCategoryEdit />} />
                    <Route path="/laboratories" element={<LaboratoryList />} />
                    <Route path="/laboratories/new" element={<LaboratoryNew />} />
                    <Route path="/laboratories/:id" element={<LaboratoryDetail />} />
                    <Route path="/laboratories/:id/edit" element={<LaboratoryEdit />} />
                    <Route path="/equipment-categories" element={<EquipmentCategoryList />} />
                    <Route path="/equipment-categories/new" element={<EquipmentCategoryNew />} />
                    <Route path="/equipment-categories/:id" element={<EquipmentCategoryDetail />} />
                    <Route path="/equipment-categories/:id/edit" element={<EquipmentCategoryEdit />} />
                    <Route path="/equipments" element={<EquipmentList />} />
                    <Route path="/equipments/new" element={<EquipmentNew />} />
                    <Route path="/equipments/:id" element={<EquipmentDetail />} />
                    <Route path="/equipments/:id/edit" element={<EquipmentEdit />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

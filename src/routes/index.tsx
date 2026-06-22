import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HttpClientSetup } from '@/api/HttpClientSetup';
import { Login } from '@/features/auth/pages/login';
import { Register } from '@/features/auth/pages/register';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute';
import { RoleRoute } from '@/features/auth/components/RoleRoute';
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
import { BorrowDetail } from '@/features/borrows/pages/borrowDetail';
import { BorrowEdit } from '@/features/borrows/pages/borrowEdit';
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
import { ProfileDetail } from '@/features/profile/pages/profileDetail';
import { ProfileEdit } from '@/features/profile/pages/profileEdit';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <HttpClientSetup>
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
                    <Route path="/professors/new" element={<RoleRoute allowedRoles={['admin']}><ProfessorNew /></RoleRoute>} />
                    <Route path="/professors/:id" element={<ProfessorDetail />} />
                    <Route path="/professors/:id/edit" element={<RoleRoute allowedRoles={['admin']}><ProfessorEdit /></RoleRoute>} />
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/students/new" element={<RoleRoute allowedRoles={['admin']}><StudentNew /></RoleRoute>} />
                    <Route path="/students/:id" element={<StudentDetail />} />
                    <Route path="/students/:id/edit" element={<RoleRoute allowedRoles={['admin']}><StudentEdit /></RoleRoute>} />
                    <Route path="/borrows" element={<BorrowList />} />
                    <Route path="/borrows/new" element={<RoleRoute allowedRoles={['professor', 'student']}><BorrowNew /></RoleRoute>} />
                    <Route path="/borrows/:id" element={<BorrowDetail />} />
                    <Route path="/borrows/:id/edit" element={<BorrowEdit />} />
                    <Route path="/borrows/:id/close" element={<BorrowClose />} />
                    <Route path="/admin" element={<AdminDetail />} />
                    <Route path="/admin/edit" element={<AdminEdit />} />
                    <Route path="/profile" element={<ProfileDetail />} />
                    <Route path="/profile/edit" element={<ProfileEdit />} />
                    <Route path="/coordinations" element={<CoordinationList />} />
                    <Route path="/coordinations/new" element={<RoleRoute allowedRoles={['admin']}><CoordinationNew /></RoleRoute>} />
                    <Route path="/coordinations/:id" element={<CoordinationDetail />} />
                    <Route path="/coordinations/:id/edit" element={<RoleRoute allowedRoles={['admin']}><CoordinationEdit /></RoleRoute>} />
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/projects/new" element={<RoleRoute allowedRoles={['professor']}><ProjectNew /></RoleRoute>} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/projects/:id/edit" element={<RoleRoute allowedRoles={['professor']}><ProjectEdit /></RoleRoute>} />
                    <Route path="/project-categories" element={<ProjectCategoryList />} />
                    <Route path="/project-categories/new" element={<RoleRoute allowedRoles={['professor']}><ProjectCategoryNew /></RoleRoute>} />
                    <Route path="/project-categories/:id" element={<ProjectCategoryDetail />} />
                    <Route path="/project-categories/:id/edit" element={<RoleRoute allowedRoles={['professor']}><ProjectCategoryEdit /></RoleRoute>} />
                    <Route path="/laboratories" element={<LaboratoryList />} />
                    <Route path="/laboratories/new" element={<RoleRoute allowedRoles={['professor']}><LaboratoryNew /></RoleRoute>} />
                    <Route path="/laboratories/:id" element={<LaboratoryDetail />} />
                    <Route path="/laboratories/:id/edit" element={<RoleRoute allowedRoles={['professor']}><LaboratoryEdit /></RoleRoute>} />
                    <Route path="/equipment-categories" element={<EquipmentCategoryList />} />
                    <Route path="/equipment-categories/new" element={<RoleRoute allowedRoles={['professor']}><EquipmentCategoryNew /></RoleRoute>} />
                    <Route path="/equipment-categories/:id" element={<EquipmentCategoryDetail />} />
                    <Route path="/equipment-categories/:id/edit" element={<RoleRoute allowedRoles={['professor']}><EquipmentCategoryEdit /></RoleRoute>} />
                    <Route path="/equipments" element={<EquipmentList />} />
                    <Route path="/equipments/new" element={<RoleRoute allowedRoles={['professor']}><EquipmentNew /></RoleRoute>} />
                    <Route path="/equipments/:id" element={<EquipmentDetail />} />
                    <Route path="/equipments/:id/edit" element={<RoleRoute allowedRoles={['professor']}><EquipmentEdit /></RoleRoute>} />
                </Route>
            </Routes>
            </HttpClientSetup>
        </BrowserRouter>
    );
};

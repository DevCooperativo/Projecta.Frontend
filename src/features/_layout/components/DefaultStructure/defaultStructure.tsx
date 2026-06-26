import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';

export interface IDefaultStructure {
    children?: ReactNode;
}

export const DefaultStructure = ({ children }: IDefaultStructure) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="d-flex flex-column" style={{ height: '100vh' }}>
            <Navbar onToggleSidebar={() => setSidebarOpen(o => !o)} />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} />
                <main className="flex-grow-1 overflow-auto py-4 px-4">
                    {children ?? <Outlet />}
                </main>
            </div>
        </div>
    );
};

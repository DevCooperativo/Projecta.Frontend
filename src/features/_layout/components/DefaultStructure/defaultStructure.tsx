import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';

export interface IDefaultStructure {
    children?: ReactNode;
}

export const DefaultStructure = ({ children }: IDefaultStructure) => {
    return (
        <>
            <Navbar />
            <main className="container py-4">
                {children ?? <Outlet />}
            </main>
        </>
    );
};

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import { useSelector } from 'react-redux';
import type { RootState } from '@/state/store';
import { useMemo, useState, useRef, useEffect } from 'react';

interface NavbarProps {
    onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const profileName = useMemo(() => {
        return `${user.profileType?.substring(0, 1).toLocaleUpperCase()}${user.profileType?.slice(1)}`;
    }, [user.profileType]);

    return (
        <nav className="navbar navbar-dark bg-dark" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="container-fluid px-3">
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-dark p-1 d-flex align-items-center justify-content-center"
                        style={{ width: '36px', height: '36px' }}
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <span className="navbar-toggler-icon" style={{ width: '1.1em', height: '1.1em' }} />
                    </button>
                    <NavLink className="navbar-brand fw-bold mb-0" to="/">
                        Projecta
                    </NavLink>
                </div>

                <ul className="navbar-nav ms-auto">
                    <li className={`nav-item dropdown${menuOpen ? ' show' : ''}`} ref={menuRef} style={{ position: 'relative' }}>
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            aria-expanded={menuOpen}
                            onClick={(e) => { e.preventDefault(); setMenuOpen(o => !o); }}
                        >
                            {profileName}
                        </a>
                        <ul className={`dropdown-menu dropdown-menu-end${menuOpen ? ' show' : ''}`} style={{ position: 'absolute', top: '100%', right: 0 }}>
                            <li>
                                <NavLink className="dropdown-item" to="/profile" onClick={() => setMenuOpen(false)}>
                                    Perfil
                                </NavLink>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item text-danger" onClick={handleLogout}>
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

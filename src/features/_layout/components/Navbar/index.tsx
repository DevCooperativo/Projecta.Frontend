import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';

export const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-link ${isActive ? 'active fw-semibold' : ''}`;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold" to="/">
                    Projecta
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/" end>
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Projetos
                            </a>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/projects">Gerenciamento</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/project-categories">Categorias</NavLink></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/coordinations">
                                Coordenadorias
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/laboratories">
                                Laboratórios
                            </NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Equipamentos
                            </a>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/equipments">Gerenciamento</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/equipment-categories">Categorias</NavLink></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/professors">
                                Professores
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/students">
                                Alunos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={linkClass} to="/borrows">
                                Empréstimos
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Admin
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <NavLink className="dropdown-item" to="/admin">
                                        Meu perfil
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
            </div>
        </nav>
    );
};

import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? 'nav-link px-3 py-2 text-white fw-semibold'
        : 'nav-link px-3 py-2 text-white-50';

const SectionLabel = ({ label }: { label: string }) => (
    <span className="px-3 pt-3 pb-1 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>
        {label}
    </span>
);

export const Sidebar = ({ isOpen }: SidebarProps) => {
    return (
        <div
            style={{
                width: isOpen ? '220px' : '0',
                minWidth: isOpen ? '220px' : '0',
                overflow: 'hidden',
                transition: 'width 0.25s ease, min-width 0.25s ease',
                backgroundColor: '#1a1d20',
                borderRight: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            <nav className="d-flex flex-column py-2" style={{ whiteSpace: 'nowrap', width: '220px' }}>
                <NavLink className={linkClass} to="/" end>Dashboard</NavLink>

                <SectionLabel label="Projetos" />
                <NavLink className={linkClass} to="/projects">Gerenciamento</NavLink>
                <NavLink className={linkClass} to="/project-categories">Categorias</NavLink>

                <SectionLabel label="Infraestrutura" />
                <NavLink className={linkClass} to="/coordinations">Coordenadorias</NavLink>
                <NavLink className={linkClass} to="/laboratories">Laboratórios</NavLink>

                <SectionLabel label="Equipamentos" />
                <NavLink className={linkClass} to="/equipments">Gerenciamento</NavLink>
                <NavLink className={linkClass} to="/equipment-categories">Categorias</NavLink>

                <SectionLabel label="Pessoas" />
                <NavLink className={linkClass} to="/professors">Professores</NavLink>
                <NavLink className={linkClass} to="/students">Alunos</NavLink>

                <SectionLabel label="Operações" />
                <NavLink className={linkClass} to="/borrows">Empréstimos</NavLink>
            </nav>
        </div>
    );
};

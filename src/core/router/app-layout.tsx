import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/presentation/context/use-auth';

type NavigationItem = {
    label: string;
    path: string;
    allowedRoles?: Array<'admin' | 'support' | 'user'>;
};

const navigationItems: NavigationItem[] = [
    {
        label: 'Dashboard',
        path: '/tickets',
    },
    {
        label: 'Tickets',
        path: '/tickets',
    },
    {
        label: 'Usuários',
        path: '/users',
        allowedRoles: ['admin'],
    },
];

export const AppLayout = () =>
{
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const visibleNavigationItems = useMemo(
        () =>
            navigationItems.filter((item) => !item.allowedRoles || (user ? item.allowedRoles.includes(user.role) : false)),
        [user],
    );

    const initials = useMemo(() =>
    {
        if (!user?.name)
        {
            return 'U';
        }

        return user.name
            .split(' ')
            .slice(0, 2)
            .map((namePart) => namePart[0]?.toUpperCase() ?? '')
            .join('');
    }, [user?.name]);

    const closeSidebar = () =>
    {
        setIsSidebarOpen(false);
    };

    const handleLogout = async () =>
    {
        setIsProfileMenuOpen(false);
        await logout();
    };

    return (
        <div className="tf-layout">
            <header className="tf-topbar">
                <div className="tf-topbar-left">
                    <button type="button" className="tf-icon-button tf-mobile-only" onClick={() => setIsSidebarOpen((previous) => !previous)}>
                        ☰
                    </button>
                    <span className="tf-brand">TicketForge</span>
                </div>

                <div className="tf-topbar-search-wrap">
                    <input className="tf-search-input" placeholder="Buscar ticket, comentário ou usuário..." />
                </div>

                <div className="tf-topbar-right">
                    <button type="button" className="tf-icon-button">
                        🔔
                    </button>
                    <div className="tf-profile-wrap">
                        <button type="button" className="tf-profile-trigger" onClick={() => setIsProfileMenuOpen((previous) => !previous)}>
                            <span className="tf-avatar">{initials}</span>
                            <span className="tf-profile-name">{user?.name ?? 'Usuário'}</span>
                            <span>▾</span>
                        </button>
                        {isProfileMenuOpen ? (
                            <div className="tf-profile-menu">
                                <p className="tf-profile-menu-name">{user?.name ?? 'Usuário'}</p>
                                <p className="tf-profile-menu-email">{user?.email ?? 'sem-email@ticketforge.local'}</p>
                                <span className="tf-role-badge">{user?.role ?? 'user'}</span>
                                <button type="button" onClick={() => setIsProfileMenuOpen(false)}>
                                    Meu perfil
                                </button>
                                <button type="button" onClick={() => setIsProfileMenuOpen(false)}>
                                    Configurações
                                </button>
                                <button type="button" className="tf-danger-text" onClick={() => void handleLogout()}>
                                    Sair
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </header>

            <div className="tf-layout-body">
                <aside className={`tf-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
                    <div className="tf-sidebar-title">Navegação</div>
                    <nav className="tf-sidebar-nav">
                        {visibleNavigationItems.map((item) => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) =>
                                    `tf-sidebar-link ${isActive || location.pathname.startsWith(`${item.path}/`) ? 'is-active' : ''}`
                                }
                                onClick={closeSidebar}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="tf-sidebar-user">
                        <span className="tf-avatar">{initials}</span>
                        <div>
                            <p>{user?.name ?? 'Usuário'}</p>
                            <span className="tf-role-badge">{user?.role ?? 'user'}</span>
                        </div>
                    </div>
                </aside>

                {isSidebarOpen ? <button type="button" className="tf-sidebar-backdrop" onClick={closeSidebar} /> : null}

                <main className="tf-content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

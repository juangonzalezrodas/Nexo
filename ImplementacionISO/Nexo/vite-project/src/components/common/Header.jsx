import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import NotificationList from '../notifications/NotificationList';
import styles from './Header.module.css';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        await logout();
        toast.success('Sesión cerrada correctamente');
        navigate('/login');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        toast.error('Error al cerrar sesión');
    }
    };

    return (
    <header className={styles.header}>
        <div className={styles.container}>
        <Link to="/" className={styles.logo}>
            <h1>Nexo</h1>
            <span className={styles.tagline}>Encuentra buscando menos</span>
        </Link>

        <nav className={styles.nav}>
            <Link to="/catalog" className={styles.navLink}>
            Catálogo
            </Link>
            <Link to="/my-tickets" className={styles.navLink}>
            Mis Reportes
            </Link>
            <Link to="/admin" className={styles.navLink}>
            Administración
            </Link>
        </nav>

        <div className={styles.userSection}>
            <NotificationList />
            <Link to="/profile" className={styles.profileLink}>
            <span className={styles.userAvatar}>
                {currentUser?.email?.charAt(0).toUpperCase()}
            </span>
            <span className={styles.userEmail}>{currentUser?.email}</span>
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar Sesión
            </button>
        </div>
        </div>
    </header>
    );
};

export default Header;
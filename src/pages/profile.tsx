import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTES } from '../constant/page-routes';
import { getProfile, logout } from '../api/auth';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<{ id: number; username: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(PAGE_ROUTES.PUBLIC.LOGIN);
            return;
        }

        getProfile(token)
            .then((res) => setUser(res.data.user))
            .catch((err) => {
                console.error('Error fetching profile:', err);
                navigate(PAGE_ROUTES.PUBLIC.LOGIN);
            });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        }
        localStorage.removeItem('token');
        navigate(PAGE_ROUTES.PUBLIC.LOGIN);
    };

    return (
        <div>
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p>
                        <strong>ID:</strong> {user.id}
                    </p>
                    <p>
                        <strong>Username:</strong> {user.username}
                    </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
        </div>
    );
};

export default ProfilePage;

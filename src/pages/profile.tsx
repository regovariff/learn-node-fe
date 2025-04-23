import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout, updateProfile } from '../api/api';
import { PAGE_ROUTES } from '../constant/page-routes';
import '../styles/profile.scss';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        bio: '',
        password: '',
        skills: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(PAGE_ROUTES.PUBLIC.LOGIN);
            return;
        }

        getProfile(token)
            .then((res) => {
                const data = res.data.user;
                setUser(data);
                setFormData({
                    email: data.email ?? '',
                    fullname: data.fullname ?? '',
                    bio: data.bio ?? '',
                    password: '',
                    skills: (data.skills ?? []).join(', '),
                });
            })
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map((s) => s.trim()),
            };
            const res = await updateProfile(token, payload);
            setUser(res.data.user);
            setEditMode(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className='profile-container'>
            <h2>Profile</h2>
            {user ? (
                <div className='profile-section'>
                    {!editMode ? (
                        <div className="profile-content-container">
                            <p>
                                <strong>ID:</strong> {user.id}
                            </p>
                            <p>
                                <strong>Username:</strong> {user.username}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email || 'N/A'}
                            </p>
                            <p>
                                <strong>Full Name:</strong> {user.fullname || 'N/A'}
                            </p>
                            <p>
                                <strong>Bio:</strong> {user.bio || 'N/A'}
                            </p>
                            <p>
                                <strong>Skills:</strong> {(user.skills || []).join(', ') || 'N/A'}
                            </p>
                            <button onClick={() => setEditMode(true)}>Edit</button>
                        </div>
                    ) : (
                        <div className="profile-content-container">
                            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                            <input
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
                            <input
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="Skills (comma-separated)"
                            />
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="New Password"
                                type="password"
                            />
                            <button onClick={handleSubmit}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    )}
                    <br />
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
        </div>
    );
};

export default ProfilePage;

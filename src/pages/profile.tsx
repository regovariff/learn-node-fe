import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout, updateProfile, postStatus } from '../api/api';
import { PAGE_ROUTES } from '../constant/page-routes';
import '../styles/profile.scss';

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<{
        email: string;
        fullname: string;
        bio: string;
        password: string;
        skills: string;
        profile_picture?: File;
    }>({
        email: '',
        fullname: '',
        bio: '',
        password: '',
        skills: '',
        profile_picture: undefined,
    });

    const [statusMessage, setStatusMessage] = useState('');
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
                    profile_picture: undefined,
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, profile_picture: file }));
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const payload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    if (key === 'skills' && typeof value === 'string') {
                        payload.append('skills', JSON.stringify(value.split(',').map((s) => s.trim())));
                    } else {
                        payload.append(key, value);
                    }
                }
            });

            const res = await updateProfile(token, payload);
            setUser(res.data.user);
            setEditMode(false);
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    const handlePostStatus = async () => {
        if (!statusMessage.trim()) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await postStatus(token, { message: statusMessage });
            alert('Status posted!');
            setStatusMessage('');
        } catch (err) {
            console.error('Posting status failed:', err);
        }
    };

    const goToStatusPage = () => {
        navigate(PAGE_ROUTES.PROTECTED.STATUS);
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <div className="navigation-buttons">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
                <button className="status-page-button" onClick={goToStatusPage}>
                    View Statuses
                </button>
            </div>

            {user ? (
                <div className="profile-section">
                    {!editMode ? (
                        <div className="profile-content-container">
                            <div className="id-tag">ID: {user.id}</div>

                            <div className="top-section">
                                {user.profile_picture && (
                                    <div className="profile-picture-wrapper">
                                        <img src={user.profile_picture} alt="Profile" className="profile-picture" />
                                    </div>
                                )}

                                <div className="status-post-container">
                                    <h3>Post a Status</h3>
                                    <textarea
                                        placeholder="What's on your mind?"
                                        value={statusMessage}
                                        onChange={(e) => setStatusMessage(e.target.value)}
                                    />
                                    <button onClick={handlePostStatus}>Post Status</button>
                                </div>
                            </div>

                            <div className="profile-info">
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
                            </div>

                            <button className="edit-button" onClick={() => setEditMode(true)}>
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <div className="profile-content-container">
                            <div className="id-tag">ID: {user.id}</div>

                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="fullname">Full Name</label>
                                <input
                                    id="fullname"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Bio"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="skills">Skills (comma-separated)</label>
                                <input
                                    id="skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Skills (comma-separated)"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">New Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="New Password (leave empty to keep current)"
                                    type="password"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="profile_picture">Profile Picture</label>
                                <input id="profile_picture" type="file" accept="image/*" onChange={handleFileChange} />
                            </div>

                            <div className="form-buttons">
                                <button onClick={handleSubmit}>Save Changes</button>
                                <button onClick={() => setEditMode(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="loading">Loading user info...</p>
            )}
        </div>
    );
};

export default ProfilePage;

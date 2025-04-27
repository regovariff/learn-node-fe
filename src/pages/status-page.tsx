import { useEffect, useState, FC } from 'react';
import { getStatuses, postStatus, deleteStatus, getProfile } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTES } from '../constant/page-routes';
import '../styles/status-page.scss';
import { formatDate } from '../lib/helper';

interface Status {
    id: number;
    user_id: number;
    username: string;
    message: string;
    created_at: string;
}

const StatusPage: FC = () => {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStatuses = async () => {
        setIsLoading(true);
        try {
            const res = await getStatuses();
            setStatuses(res.data.statuses);
        } catch (err) {
            console.error('Failed to fetch statuses', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(PAGE_ROUTES.PUBLIC.LOGIN);
            return;
        }

        try {
            const res = await getProfile(token);
            setCurrentUserId(res.data.user.id);
        } catch (err) {
            console.error('Failed to fetch user profile', err);
            navigate(PAGE_ROUTES.PUBLIC.LOGIN);
        }
    };

    useEffect(() => {
        const initPage = async () => {
            await Promise.all([fetchStatuses(), fetchUserProfile()]);
        };

        initPage();
    }, []);

    const handlePostStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate(PAGE_ROUTES.PUBLIC.LOGIN);
            return;
        }

        if (!statusMessage.trim()) return;

        try {
            await postStatus(token, { message: statusMessage });
            setStatusMessage('');
            await fetchStatuses();
        } catch (err) {
            console.error('Posting status failed:', err);
        }
    };

    const handleDeleteStatus = async (statusId: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await deleteStatus(token, statusId);
            await fetchStatuses();
        } catch (err) {
            console.error('Deleting status failed:', err);
        }
    };

    const goToProfilePage = () => {
        navigate(PAGE_ROUTES.PROTECTED.PROFILE);
    };

    return (
        <div className="statuses-container">
            <h2>Community Feed</h2>
            <button className="status-page-button" onClick={goToProfilePage}>
                Your Profile
            </button>

            {/* Post Status */}
            <div className="status-post-container">
                <textarea
                    placeholder="What's on your mind?"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                />
                <button onClick={handlePostStatus}>Post Status</button>
            </div>

            {/* List of Statuses */}
            <div className="status-list">
                {isLoading ? (
                    <div className="empty-status">Loading statuses...</div>
                ) : statuses.length > 0 ? (
                    statuses.map((status) => (
                        <div key={status.id} className="status-item">
                            <div className="status-header">
                                <div className="username">{status.username}</div>
                            </div>

                            <p className="status-message">{status.message}</p>

                            <div className="status-footer">
                                <span className="timestamp">{formatDate(status.created_at)}</span>

                                {currentUserId === status.user_id && (
                                    <button className="delete-button" onClick={() => handleDeleteStatus(status.id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-status">No statuses yet. Be the first to post!</div>
                )}
            </div>
        </div>
    );
};

export default StatusPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { PAGE_ROUTES } from '../constant/page-routes';
import '../styles/login.scss';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await login(username, password);
            localStorage.setItem('token', res.data.token);
            alert('Logged in!');
            navigate(PAGE_ROUTES.PROTECTED.PROFILE);
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;

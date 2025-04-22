import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import '../styles/login.scss';
import { PAGE_ROUTES } from '../constant/page-routes';

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(username, password);
            alert('Registered successfully!');
            navigate(PAGE_ROUTES.PUBLIC.LOGIN);
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;

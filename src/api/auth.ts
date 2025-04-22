import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const register = (username: string, password: string) =>
    axios.post(`${BASE_URL}/register`, { username, password });

export const login = (username: string, password: string) => axios.post(`${BASE_URL}/login`, { username, password });

export const getProfile = (token: string) =>
    axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const logout = () => axios.post(`${BASE_URL}/logout`);
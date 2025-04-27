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

export const updateProfile = (token: string, formData: FormData) =>
    axios.put(`${BASE_URL}/profile`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

// Status
export const postStatus = (token: string, payload: { message: string }) =>
    axios.post(`${BASE_URL}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const getStatuses = () => axios.get(`${BASE_URL}/status`);

export const deleteStatus = (token: string, statusId: number) =>
    axios.delete(`${BASE_URL}/status/${statusId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

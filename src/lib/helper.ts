export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return Boolean(token);
};

export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

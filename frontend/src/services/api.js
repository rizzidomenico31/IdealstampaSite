const API_BASE = import.meta.env.VITE_API_URL || 'https://nodejs-p9se-production.up.railway.app';
const TOKEN_KEY = 'idealstampa_admin_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * fetch wrapper con:
 *  - base URL applicata automaticamente
 *  - Authorization: Bearer <token> se presente
 *  - parsing JSON e normalizzazione errori
 *  - se riceve 401 con codice TOKEN_EXPIRED/INVALID, emette evento auth:expired
 */
export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = false, ...rest } = {}) {
    const finalHeaders = { ...headers };
    const token = getToken();

    if (auth && token) finalHeaders['Authorization'] = `Bearer ${token}`;

    let finalBody = body;
    if (body && !(body instanceof FormData) && typeof body !== 'string') {
        finalHeaders['Content-Type'] = finalHeaders['Content-Type'] || 'application/json';
        finalBody = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers: finalHeaders,
        body: finalBody,
        ...rest
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
        const err = new Error((data && data.message) || `Errore HTTP ${response.status}`);
        err.status = response.status;
        err.code = data && data.code;
        err.data = data;
        if (auth && response.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:expired', { detail: err }));
        }
        throw err;
    }

    return data;
}

export const adminApi = {
    login: (username, password) =>
        apiFetch('/api/admin/auth/login', { method: 'POST', body: { username, password } }),
    logout: () =>
        apiFetch('/api/admin/auth/logout', { method: 'POST', auth: true }),
    me: () =>
        apiFetch('/api/admin/auth/me', { auth: true }),
    changePassword: (currentPassword, newPassword) =>
        apiFetch('/api/admin/auth/change-password', {
            method: 'POST',
            auth: true,
            body: { currentPassword, newPassword }
        })
};

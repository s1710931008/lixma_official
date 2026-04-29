const ADMIN_TOKEN_KEY = "lixma_admin_token";

export function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminLoggedIn() {
    return Boolean(getAdminToken());
}

export async function adminFetch(url, options = {}) {
    const token = getAdminToken();
    const headers = {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const res = await fetch(url, {
        ...options,
        headers
    });

    if (res.status === 401) {
        clearAdminToken();
        window.location.href = "/admin/login";
    }

    return res;
}

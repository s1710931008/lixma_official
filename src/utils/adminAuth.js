const ADMIN_TOKEN_KEY = "lixma_admin_token";

//取得Token
export function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
}

//存入Token
export function setAdminToken(token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

//清除Token
export function clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
}

//判斷是否登入
export function isAdminLoggedIn() {
    return Boolean(getAdminToken());
}

//帶入 Token 的 fetch
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

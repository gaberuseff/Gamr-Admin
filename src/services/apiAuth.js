import { authStorage } from "../utils/authStorage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

// Check if token is expired or will expire soon (within 60 seconds)
export const isTokenExpired = (expiresAt) => {
    if (!expiresAt) return false;
    const expirationTime = new Date(expiresAt * 1000);
    const currentTime = new Date();
    // Add 60 seconds buffer to refresh before actual expiration
    return expirationTime.getTime() - currentTime.getTime() < 60000;
}

// Refresh access token using refresh token
export const refreshToken = async () => {
    const session = authStorage.getSession();
    if (!session?.refresh_token) {
        throw new Error("No refresh token available");
    }

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh_token: session.refresh_token,
        }),
    });

    if (!res.ok) {
        authStorage.clearSession();
        throw new Error("Failed to refresh token");
    }

    const data = await res.json();
    authStorage.saveSession(data);
    return data;
}

export const login = async ({ email, password }) => {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error_description || "فشل تسجيل الدخول");
    }

    const data = await res.json();
    return data;
}

export const getCurrentUser = async () => {
    const session = authStorage.getSession();
    if (!session) return null;

    // Check if token exists
    if (!session.access_token) {
        authStorage.clearSession();
        return null;
    }

    // Check if token is expired and try to refresh
    if (session.expires_at && isTokenExpired(session.expires_at)) {
        try {
            const newSession = await refreshToken();
            // Use the new token for the request
            const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${newSession.access_token}`,
                },
            });

            if (res.status === 401 || res.status === 403) {
                authStorage.clearSession();
                return null;
            }

            if (!res.ok) throw new Error("فشل في الحصول على بيانات المستخدم");

            const data = await res.json();
            return data;
        } catch (error) {
            // If refresh fails, clear session
            authStorage.clearSession();
            return null;
        }
    }

    // Token is still valid, proceed with normal request
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${session.access_token}`,
        },
    });

    // If unauthorized or forbidden, clear session and return null
    if (res.status === 401 || res.status === 403) {
        authStorage.clearSession();
        return null;
    }

    if (!res.ok) throw new Error("فشل في الحصول على بيانات المستخدم");

    const data = await res.json();
    return data;
}

export const logout = async () => {
    const session = authStorage.getSession();
    if (!session) return null;

    const res = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error("فشل تسجيل الخروج");

    // Logout endpoint returns 204 No Content, so no need to parse JSON
    return;
}

export const updatePassword = async ({ currentPassword, newPassword }) => {
    const session = authStorage.getSession();
    if (!session) return null;

    const userEmail = session.user.email;

    // first ckeck if old password is correct
    const checkPasswordRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
            email: userEmail,
            password: currentPassword,
        }),
    });

    if (!checkPasswordRes.ok) throw new Error("كلمة المرور الحالية غير صحيحة");

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
            email: userEmail,
            password: newPassword,
        }),
    });

    if (!res.ok) throw new Error("فشل تحديث كلمة المرور");

    // Update password endpoint returns 200 OK with user data
    const data = await res.json();
    return data;
}

export const uploadAvatar = async (file) => {
    const session = authStorage.getSession();
    if (!session) throw new Error("No session found");

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/users_avatars/${filePath}`, {
        method: 'POST',
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${session.access_token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل رفع الصورة");
    }

    // Get public URL
    const publicURL = `${SUPABASE_URL}/storage/v1/object/public/users_avatars/${filePath}`;
    return publicURL;
}

export const updateUserData = async (userData) => {
    const session = authStorage.getSession();
    if (!session) throw new Error("No session found");

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
            data: userData, // user_metadata
        }),
    });

    if (!res.ok) throw new Error("فشل تحديث بيانات المستخدم");

    const responseData = await res.json();
    return responseData;
}

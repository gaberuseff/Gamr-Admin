import { isTokenExpired } from "../services/apiAuth";

const AUTH_STORAGE_KEY = "gamr_admin_session";

export const authStorage = {
    // Save session to local storage
    saveSession(session) {
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        } catch (error) {
            console.error("Failed to save session:", error);
        }
    },

    // Get session from local storage
    getSession() {
        try {
            const session = localStorage.getItem(AUTH_STORAGE_KEY);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error("Failed to get session:", error);
            return null;
        }
    },

    // Remove session from local storage
    clearSession() {
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear session:", error);
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;

        // Check if token exists
        if (!session.access_token) return false;

        // Check if token is expired using the centralized function
        if (session.expires_at && isTokenExpired(session.expires_at)) {
            this.clearSession();
            return false;
        }

        return true;
    },

    // Get access token
    getAccessToken() {
        const session = this.getSession();
        return session?.access_token || null;
    },

    // Check if token should be refreshed (within 5 minutes of expiration)
    shouldRefreshToken() {
        const session = this.getSession();
        if (!session?.expires_at) return false;

        const expirationTime = new Date(session.expires_at * 1000);
        const currentTime = new Date();
        const timeUntilExpiry = expirationTime.getTime() - currentTime.getTime();

        // Refresh if less than 5 minutes until expiration
        return timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0;
    }
};

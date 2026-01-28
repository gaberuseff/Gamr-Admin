import supabase from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const createUser = async (userData) => {
    const { email, password, role, name, phone } = userData;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role,
                name,
                phone
            }
        }
    })

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return data;
}

export const getAllUsers = async () => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "order": "created_at.desc"
        }
    })

    const data = await response.json();

    return data;
}

export const manageUser = async ({ userId, action }) => {
    const { authStorage } = await import("../utils/authStorage");
    const session = authStorage.getSession();

    if (!session?.access_token) {
        throw new Error("لا يوجد جلسة نشطة");
    }

    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/manage-user`,
        {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ userId, action }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || "فشل تحديث المستخدم");
    }

    return response.json();
};

export const deleteUser = async (userId) => {
    const { authStorage } = await import("../utils/authStorage");
    const session = authStorage.getSession();

    if (!session?.access_token) {
        throw new Error("لا يوجد جلسة نشطة");
    }

    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/manage-user`,
        {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ userId, action: "delete" }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || "فشل تحديث المستخدم");
    }

    return response.json();
};

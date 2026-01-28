
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export async function getSettings() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?select=*&id=eq.1`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Accept": "application/vnd.pgrst.object+json",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch settings");

    return res.json();
}

export async function updateSettings(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.1`, {
        method: "PATCH",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=representation", // إرجاع البيانات المحدثة
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        console.error('Error updating settings:', error);
        throw new Error(error.message || 'فشل تحديث الإعدادات');
    }

    const updatedData = await res.json();

    // التحقق من أن البيانات تم تحديثها
    if (!updatedData || updatedData.length === 0) {
        throw new Error('حدث خطأ أثناء تحديث الإعدادات');
    }

    return updatedData[0];
}
import { authStorage } from "../utils/authStorage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export async function getOrdersForExport({ startDate, endDate }) {
    let url = `${SUPABASE_URL}/rest/v1/orders?select=id,phone_number,customer_name,total,status,created_at`;

    // Add date range filter
    url += `&created_at=gte.${startDate}&created_at=lte.${endDate}`;

    // Order by created_at descending (newest first)
    url += `&order=created_at.desc`;

    const res = await fetch(url, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
        },
    });

    if (!res.ok) {
        throw new Error("فشل في جلب بيانات الطلبات");
    }

    const data = await res.json();
    return data;
}

export async function getProductsForExport() {
    let url = `${SUPABASE_URL}/rest/v1/products?select=id,name_ar,name_en,sizes,in_stock,created_at&order=id.asc`;

    const res = await fetch(url, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
        },
    });

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    const data = await res.json();
    return data;
}

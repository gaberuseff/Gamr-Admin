import { authStorage } from "../utils/authStorage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const getDashboardStats = async (days = 7) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_dashboard_stats`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
            "Accept": "application/vnd.pgrst.object+json",
        },
        body: JSON.stringify({
            days_interval: Number(days)
        })
    })

    const data = await response.json()
    return data
}

export const getOrdersStatusChart = async (days = 7) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_order_status_distribution`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
        },
        body: JSON.stringify({
            days_interval: Number(days)
        })
    })

    const data = await response.json()
    return data
}

export const getTopSellingProducts = async (days = 7, limit = 5) => {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/top_selling_products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
        },
        body: JSON.stringify({
            days_interval: Number(days),
            limit_count: Number(limit)
        })
    })

    const data = await response.json()
    return data
}
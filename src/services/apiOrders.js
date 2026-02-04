import { authStorage } from "../utils/authStorage";
import { ORDERS_PER_PAGE } from "../utils/constants";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export async function getOrders({ status, sortBy, page = 1, search } = {}) {
    const from = (page - 1) * ORDERS_PER_PAGE;
    const to = from + ORDERS_PER_PAGE - 1;

    let url = `${SUPABASE_URL}/rest/v1/orders?select=id,phone_number,customer_name,total,status,created_at,is_paid,discount_amount`;

    // Add status filter if provided
    if (status && status !== "all") {
        url += `&status=eq.${status}`;
    }

    // Add search filter if provided
    if (search && search.trim()) {
        const searchValue = search.trim();

        // Check if search value is numeric (phone) or alphanumeric (id)
        const isNumeric = /^\d+$/.test(searchValue);

        if (isNumeric) {
            // Search in phone column only (phone numbers are numeric)
            url += `&phone=like.*${searchValue}*`;
        } else {
            // Search in id column only (order IDs contain letters and numbers)
            url += `&id=like.*${searchValue}*`;
        }
    }

    // Add sorting if provided, otherwise default to newest first
    if (sortBy) {
        // sortBy format: "field-direction" (e.g., "totalPrice-desc", "createdAt-asc")
        const [field, direction] = sortBy.split("-");

        // Map frontend field names to database column names
        const fieldMap = {
            totalPrice: "total",
            createdAt: "created_at"
        };

        const dbField = fieldMap[field] || field;
        const order = direction === "desc" ? "desc" : "asc";

        url += `&order=${dbField}.${order}`;
    } else {
        // Default: show newest orders first
        url += `&order=created_at.desc`;
    }

    const res = await fetch(url, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
            "Range": `${from}-${to}`,
            "Prefer": "count=exact"
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch orders");
    }

    const data = await res.json();

    // Get total count from Content-Range header
    const contentRange = res.headers.get("Content-Range");
    const count = contentRange ? parseInt(contentRange.split("/")[1]) : 0;

    return { data, count };
}

export async function getOrder(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
            "Accept": "application/vnd.pgrst.object+json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch order");
    }

    return res.json();
}

export async function updateOrder(id, data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: "PATCH",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update order");
    }

    return res;
}

export async function getOrdersCount({ status, date } = {}) {
    let url = `${SUPABASE_URL}/rest/v1/orders?select=count`;

    // Add status filter if provided
    if (status && status !== "all") {
        url += `&status=eq.${status}`;
    }

    // Add date filter if provided
    if (date && date !== "all") {
        url += `&created_at=lt.${date}`;
    }

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
            "Prefer": "count=exact"
        },
    });

    if (!res.ok) {
        throw new Error("Failed to count orders");
    }

    const count = res.headers.get("content-range")?.split("/")[1] || "0";
    return parseInt(count);
}

export async function deleteOrders({ status, date } = {}) {
    let url = `${SUPABASE_URL}/rest/v1/orders?`;

    // Add status filter if provided
    if (status && status !== "all") {
        url += `status=eq.${status}`;
    }

    // Add date filter if provided
    if (date && date !== "all") {
        url += `&created_at=lt.${date}`;
    }

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${authStorage.getAccessToken()}`,
            "Prefer": "return=representation"
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "فشل حذف الطلبات");
    }

    // Check if any rows were actually deleted
    const deletedData = await res.json();

    if (!deletedData || deletedData.length === 0) {
        throw new Error("لم يتم حذف أي طلبات");
    }

    return { count: deletedData.length, data: deletedData };
}

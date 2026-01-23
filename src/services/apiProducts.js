import { ITEMS_PER_PAGE } from "../utils/constants";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export async function getProducts(page = 1) {
    // Calculate range for pagination
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`,
        {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Range': `${from}-${to}`,
                'Prefer': 'count=exact'
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching products:', error);
        throw new Error(error.message || 'Failed to fetch products');
    }

    const data = await response.json();

    // Get total count from Content-Range header
    const contentRange = response.headers.get('Content-Range');
    const count = contentRange ? parseInt(contentRange.split('/')[1]) : 0;

    return { data, count };
}

export async function createProduct(productData) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/products`,
        {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(productData)
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Error creating product:', error);
        throw new Error(error.message || 'Failed to create product');
    }

    const data = await response.json();
    return data;
}

export async function updateProduct(productId, productData) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`,
        {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(productData)
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Error updating product:', error);
        throw new Error(error.message || 'فشل تحديث المنتج');
    }

    // التحقق من أن المنتج تم تحديثه فعلياً
    const data = await response.json();
    if (!data || data.length === 0) {
        throw new Error('فشل تحديث المنتج');
    }

    return data;
}

export async function deleteProduct(productId) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`,
        {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Error deleting product:', error);

        // Check for foreign key constraint errors
        if (error.code === '23503') {
            throw new Error('لا يمكن حذف المنتج لأنه مرتبط ببيانات أخرى');
        }

        throw new Error(error.message || 'فشل حذف المنتج');
    }

    // Check if any rows were actually deleted
    const deletedData = await response.json();
    if (!deletedData || deletedData.length === 0) {
        throw new Error('المنتج غير موجود أو تم حذفه مسبقاً');
    }

    return deletedData;
}

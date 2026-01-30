import { authStorage } from "../utils/authStorage";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const BUCKET_NAME = 'product-images';

export async function uploadProductImage(file, productName = 'product') {
    // إنشاء اسم فريد للصورة
    const timestamp = Date.now();
    const fileName = `${productName}-${timestamp}-${file.name}`;
    const filePath = `${fileName}`;

    // رفع الصورة
    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${filePath}`,
        {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${authStorage.getAccessToken()}`,
                'Content-Type': file.type,
            },
            body: file
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Error uploading image:', error);
        throw new Error('فشل رفع الصورة');
    }

    // إرجاع الرابط العام للصورة
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
    return publicUrl;
}

export async function uploadMultipleProductImages(files, productName = 'product') {
    const uploadPromises = files.map(file => uploadProductImage(file, productName));
    return await Promise.all(uploadPromises);
}

export async function deleteProductImage(imageUrl) {
    // استخراج المسار من الرابط
    const path = imageUrl.split(`${BUCKET_NAME}/`)[1];

    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${path}`,
        {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${authStorage.getAccessToken()}`,
            }
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Error deleting image:', error);
        throw new Error('فشل حذف الصورة');
    }
}

export async function deleteMultipleProductImages(imageUrls) {
    const deletePromises = imageUrls.map(url => deleteProductImage(url));
    return await Promise.all(deletePromises);
}

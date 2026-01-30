import * as XLSX from 'xlsx';
import { formateCurrency } from './helpers';
import { getTimePeriodLabel, formatDate } from './dateUtils';

/**
 * Export orders data to Excel file
 * @param {Array} orders - Array of order objects
 * @param {string} timePeriod - Time period key
 */
export function exportOrdersToExcel(orders, timePeriod) {
    // Prepare data for Excel
    const excelData = orders.map((order, index) => ({
        '#': index + 1,
        'رقم الطلب': order.id,
        'اسم العميل': order.customer_name,
        'رقم الهاتف': order.phone,
        'الإجمالي': order.total,
        'الحالة': getStatusLabel(order.status),
        'تاريخ الطلب': formatDate(order.created_at)
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 5 },   // #
        { wch: 25 },  // رقم الطلب
        { wch: 20 },  // اسم العميل
        { wch: 15 },  // رقم الهاتف
        { wch: 12 },  // الإجمالي
        { wch: 15 },  // الحالة
        { wch: 20 }   // تاريخ الطلب
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلبات');

    // Generate filename
    const periodLabel = getTimePeriodLabel(timePeriod);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `orders_${timePeriod}_${dateStr}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
}

export function exportProductsToExcel(products, timePeriod) {
    // Prepare data for Excel
    const excelData = products.map((product, index) => {
        // Parse sizes if it's a JSON string
        let sizesText = '';
        if (product.sizes) {
            try {
                const sizesArray = typeof product.sizes === 'string'
                    ? JSON.parse(product.sizes)
                    : product.sizes;

                if (Array.isArray(sizesArray)) {
                    sizesText = sizesArray.map(s => `${s.size} (${s.price} جنيه)`).join(', ');
                }
            } catch (e) {
                sizesText = 'غير محدد';
            }
        }

        return {
            '#': index + 1,
            'رقم المنتج': product.id,
            'الاسم بالعربية': product.name_ar || 'غير محدد',
            'الاسم بالإنجليزية': product.name_en || 'غير محدد',
            'المقاسات والأسعار': sizesText || 'غير محدد',
            'الحالة': product.in_stock ? 'متوفر' : 'غير متوفر',
            'تاريخ الإضافة': formatDate(product.created_at)
        };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 5 },   // #
        { wch: 12 },  // رقم المنتج
        { wch: 25 },  // الاسم بالعربية
        { wch: 25 },  // الاسم بالإنجليزية
        { wch: 40 },  // المقاسات والأسعار
        { wch: 12 },  // الحالة
        { wch: 20 }   // تاريخ الإضافة
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');

    // Generate filename
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `products_${dateStr}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
}

function getStatusLabel(status) {
    const statusLabels = {
        'pending': 'قيد الانتظار',
        'confirmed': 'مؤكد',
        'shipped': 'تم الشحن',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغي'
    };

    return statusLabels[status] || status;
}

export function calculateOrdersSummary(orders) {
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    return {
        totalOrders,
        totalSales,
        statusCounts,
        averageOrder: totalOrders > 0 ? totalSales / totalOrders : 0
    };
}

export function calculateProductsSummary(products) {
    const totalProducts = products.length;
    const inStockCount = products.filter(p => p.in_stock).length;
    const outOfStockCount = totalProducts - inStockCount;

    return {
        totalProducts,
        inStockCount,
        outOfStockCount
    };
}

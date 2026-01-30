import { useState } from 'react';
import toast from 'react-hot-toast';
import { getOrdersForExport, getProductsForExport } from '../../services/apiExport';
import { getDateRangeForPeriod } from '../../utils/dateUtils';
import {
    calculateOrdersSummary,
    calculateProductsSummary,
    exportOrdersToExcel,
    exportProductsToExcel
} from '../../utils/excelExport';

export function useExportData() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataOverview, setDataOverview] = useState(null);
    const [exportData, setExportData] = useState(null);
    const [exportConfig, setExportConfig] = useState(null);

    const fetchDataForExport = async (dataType, timePeriod) => {
        setIsLoading(true);
        setError(null);
        setDataOverview(null);

        try {
            const { startDate, endDate } = getDateRangeForPeriod(timePeriod);

            let data;
            let overview;

            if (dataType === 'orders') {
                // Fetch orders data
                data = await getOrdersForExport({ startDate, endDate });

                // Calculate summary
                const summary = calculateOrdersSummary(data);

                overview = {
                    type: 'orders',
                    count: summary.totalOrders,
                    totalSales: summary.totalSales,
                    averageOrder: summary.averageOrder,
                    statusCounts: summary.statusCounts
                };
            } else if (dataType === 'products') {
                // Fetch products data (without date filter - products are static)
                data = await getProductsForExport();

                // Calculate summary
                const summary = calculateProductsSummary(data);

                overview = {
                    type: 'products',
                    count: summary.totalProducts,
                    inStockCount: summary.inStockCount,
                    outOfStockCount: summary.outOfStockCount
                };
            }

            // Store data and config for export
            setExportData(data);
            setExportConfig({ dataType, timePeriod });
            setDataOverview(overview);

            // Show success message
            toast.success(`تم جلب ${overview.count} ${dataType === 'orders' ? 'طلب' : 'منتج'} بنجاح`);

        } catch (err) {
            console.error('Error fetching export data:', err);
            setError(err.message);
            toast.error(err.message || 'حدث خطأ أثناء جلب البيانات');
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Export data to Excel file
     */
    const exportToExcel = () => {
        if (!exportData || !exportConfig) {
            toast.error('لا توجد بيانات للتصدير');
            return;
        }

        try {
            const { dataType, timePeriod } = exportConfig;

            if (dataType === 'orders') {
                exportOrdersToExcel(exportData, timePeriod);
                toast.success('تم تصدير الطلبات بنجاح');
            } else if (dataType === 'products') {
                exportProductsToExcel(exportData, timePeriod);
                toast.success('تم تصدير المنتجات بنجاح');
            }

            // Reset state after export
            resetState();

        } catch (err) {
            console.error('Error exporting to Excel:', err);
            toast.error('حدث خطأ أثناء تصدير البيانات');
        }
    };

    /**
     * Reset hook state
     */
    const resetState = () => {
        setDataOverview(null);
        setExportData(null);
        setExportConfig(null);
        setError(null);
    };

    return {
        isLoading,
        error,
        dataOverview,
        fetchDataForExport,
        exportToExcel,
        resetState
    };
}

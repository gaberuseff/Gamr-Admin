import { Card, CardBody, Divider } from "@heroui/react";
import { formateCurrency } from "../../utils/helpers";

function OrdersOverview({ overview }) {
    const getStatusLabel = (status) => {
        const labels = {
            'received': 'قيد الانتظار',
            'confirmed': 'مؤكد',
            'shipped': 'تم الشحن',
            'cancelled': 'ملغي'
        };
        return labels[status] || status;
    };

    return (
        <Card shadow="none">
            <CardBody className="gap-4">
                <h3 className="text-xl font-bold text-center">ملخص الطلبات</h3>

                <Divider />

                <div className="grid grid-cols-2 gap-6">
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">عدد الطلبات</p>
                        <p className="text-xl font-bold">{overview.count}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
                        <p className="text-xl font-bold">
                            {formateCurrency(overview.totalSales)}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">متوسط الطلب</p>
                    <p className="text-xl font-bold">
                        {formateCurrency(overview.averageOrder)}
                    </p>
                </div>

                {overview.statusCounts && Object.keys(overview.statusCounts).length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-3 text-right">
                                توزيع الحالات
                            </p>
                            <div className="space-y-2">
                                {Object.entries(overview.statusCounts).map(([status, count]) => (
                                    <div
                                        key={status}
                                        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                                    >
                                        <span className="font-bold text-xl">{count}</span>
                                        <span className="text-sm text-gray-700">{getStatusLabel(status)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}

export default OrdersOverview;

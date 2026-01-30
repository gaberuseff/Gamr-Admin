import { Card } from "@heroui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
    received: "#f59e0b",
    confirmed: "#3b82f6",
    shipped: "#10b981",
    cancelled: "#ef4444",
};

const STATUS_NAMES = {
    received: "مستلم",
    confirmed: "مؤكد",
    shipped: "تم الشحن",
    cancelled: "ملغي",
};

function OrdersChart({ ordersStatusChart }) {
    // تحويل البيانات من قاعدة البيانات إلى الشكل المطلوب للـ chart
    const ordersData = ordersStatusChart.map(item => ({
        name: STATUS_NAMES[item.order_status],
        value: item.orders_count,
        status: item.order_status,
        percentage: item.percentage,
    }));

    const totalOrders = ordersStatusChart[0]?.total_orders || 0;

    // Custom label للمخطط
    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize="14"
                fontWeight="600"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card shadow="none" className="px-6 py-6 bg-white">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-text mb-1">إحصائيات الطلبات</h2>
                <p className="text-sm text-text-secondary">
                    توزيع الطلبات حسب الحالة - الإجمالي: {totalOrders} طلب
                </p>
            </div>

            {/* Chart and Legend Side by Side */}
            {ordersData.length === 0 || totalOrders === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-text-secondary">لا توجد بيانات حتى الآن</p>
                        <p className="text-sm text-text-secondary mt-2">لم يتم تسجيل أي طلبات في الفترة المحددة</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between gap-4">
                        {/* Legend beside chart */}
                        <div className="flex flex-col gap-4">
                            {ordersData.map((item) => (
                                <div key={item.status} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: COLORS[item.status] }}
                                    />
                                    <span className="text-sm font-medium text-text whitespace-nowrap">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={ordersData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={110}
                                        innerRadius={65}
                                        fill="#8884d8"
                                        dataKey="value"
                                        paddingAngle={3}
                                    >
                                        {ordersData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0];
                                                return (
                                                    <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-border">
                                                        <p className="text-sm font-semibold text-text">{data.name}</p>
                                                        <p className="text-sm font-bold" style={{ color: data.payload.fill }}>
                                                            {data.value} طلب ({((data.value / totalOrders) * 100).toFixed(1)}%)
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Statistics Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        {ordersData.map((item) => (
                            <div
                                key={item.status}
                                className="flex items-center justify-between p-3 rounded-lg bg-bg"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[item.status] }}
                                    />
                                    <span className="text-sm font-medium text-text">{item.name}</span>
                                </div>
                                <span className="text-lg font-bold text-text">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
}

export default OrdersChart;

import { Card, Select, SelectItem } from "@heroui/react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16"];

function TopSellingProductsChart({ topSellingProducts, onLimitChange, currentLimit }) {
    const chartData = topSellingProducts?.map((item, index) => ({
        product_id: `#${item.product_id}`,
        order_count: item.order_count,
        color: COLORS[index % COLORS.length],
        fullId: item.product_id,
    })) || [];

    // حساب أعلى قيمة للمبيعات لتحديد domain الـ YAxis
    const maxValue = Math.max(...chartData.map(item => item.order_count), 0);
    const yAxisMax = Math.ceil(maxValue * 1.2); // إضافة 20% مساحة فوق أعلى قيمة

    return (
        <Card shadow="none" className="px-6 py-6 bg-white flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text mb-1">المنتجات الأكثر مبيعاً</h2>
                    <p className="text-sm text-text-secondary">
                        أفضل {currentLimit} {currentLimit === 1 ? 'منتج' : 'منتجات'} من حيث المبيعات
                    </p>
                </div>
                <Select
                    label="عدد المنتجات"
                    placeholder="اختر"
                    selectedKeys={[String(currentLimit)]}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="w-40"
                    size="sm"
                    variant="bordered"
                    classNames={{
                        trigger: "h-10",
                    }}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={String(num)} value={String(num)}>
                            {num} {num === 1 ? 'منتج' : 'منتجات'}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {/* Chart - يأخذ باقي المساحة المتاحة */}
            <div className="h-[400px] lg:h-auto lg:flex-1 min-h-0">
                {chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-text-secondary">لا توجد بيانات حتى الآن</p>
                            <p className="text-sm text-text-secondary mt-2">لم يتم تسجيل أي مبيعات في الفترة المحددة</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis
                                dataKey="product_id"
                                tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
                                axisLine={{ stroke: "#d1d5db" }}
                                tickLine={false}
                                height={40}
                            />
                            <YAxis
                                tick={{ fill: "#6b7280", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, yAxisMax]}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0];
                                        return (
                                            <div className="bg-white px-4 py-3 rounded-xl shadow-xl border-2 border-border">
                                                <p className="text-xs text-text-secondary mb-1">
                                                    المنتج رقم
                                                </p>
                                                <p className="text-lg font-bold text-text mb-2">
                                                    #{data.payload.fullId}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: data.payload.color }}
                                                    />
                                                    <p className="text-sm font-semibold" style={{ color: data.payload.color }}>
                                                        {data.value} عملية بيع
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="order_count"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={60}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
}

export default TopSellingProductsChart;

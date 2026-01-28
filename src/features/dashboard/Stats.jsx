import Stat from "./Stat";

function Stats({ stats }) {
    const { total_sales, average_order, completed_orders_count } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Stat
                title="إجمالي المبيعات للطلبات المكتملة فقط"
                value={total_sales || 0}
                subtitle="الرقم يدل على اجمالي المبيعات خلال فترة معينة"
                variant="dark"
                isNumber={false}
            />
            <Stat
                title="عدد الطلبات المكتملة"
                value={completed_orders_count || 0}
                subtitle=" عدد الطلبات التى تم تسليمها بالفعل خلال فترة معينة"
                isNumber={true}
            />
            <Stat
                title="متوسط الطلب"
                value={average_order || 0}
                subtitle="متوسط قيمة الطلب خلال فترة معينة"
                isNumber={false}
            />
        </div>
    )
}

export default Stats


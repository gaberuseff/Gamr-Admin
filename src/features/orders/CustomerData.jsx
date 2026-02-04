import { Card, CardBody } from "@heroui/react";
import { HiUser, HiPhone, HiLocationMarker, HiMail } from "react-icons/hi";

function CustomerData({ order }) {
    const customerFields = [
        {
            id: 1,
            label: "اسم المستخدم",
            value: order.customer_name,
            icon: HiUser,
            // color: "from-blue-500 to-cyan-500"
        },
        {
            id: 2,
            label: "رقم الهاتف",
            value: order.phone_number,
            icon: HiPhone,
            color: "from-purple-500 to-pink-500"
        },
        {
            id: 3,
            label: "العنوان",
            value: order?.address,
            icon: HiLocationMarker,
            color: "from-orange-500 to-red-500"
        },
        {
            id: 4,
            label: "المحافظة",
            value: order?.gov,
            icon: HiLocationMarker,
            color: "from-orange-500 to-red-500"
        },
        {
            id: 5,
            label: "البريد الالكتروني",
            value: order.email,
            icon: HiMail,
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <Card shadow="none" className="border border-default-200">
            <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-default-700">بيانات العميل</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div
                                key={field.id}
                                className="group relative bg-default-100
                                    rounded-xl p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-11 h-11">
                                        <Icon size={20} className="text-default-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-default-400 mb-1">
                                            {field.label}
                                        </p>
                                        <p className="text-sm font-semibold text-default-700 truncate" title={field.value || "غير متوفر"}>
                                            {field.value || "غير متوفر"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}

export default CustomerData;

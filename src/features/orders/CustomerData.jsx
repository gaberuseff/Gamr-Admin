import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { HiUser, HiPhone, HiLocationMarker, HiMail } from "react-icons/hi";

function CustomerData({ order }) {
    const customerFields = [
        {
            id: 1,
            label: "اسم المستخدم",
            value: order.customer_name,
            icon: HiUser
        },
        {
            id: 2,
            label: "رقم الهاتف",
            value: order.phone,
            icon: HiPhone
        },
        {
            id: 3,
            label: "العنوان",
            value: order.address,
            icon: HiLocationMarker
        },
        {
            id: 4,
            label: "البريد الالكتروني",
            value: order.email,
            icon: HiMail
        }
    ];

    return (
        <Card shadow="none" className="p-4">
            <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold">بيانات العميل</h2>
            </CardHeader>
            <CardBody className="pt-6 border-t border-default-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {customerFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.id} className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-1.5">
                                    <Icon size={14} className="text-default-400 shrink-0" />
                                    <span className="text-small text-default-400 font-medium">
                                        {field.label}
                                    </span>
                                </div>
                                <span className="text-medium font-semibold wrap-break-word">
                                    {field.value || "غير متوفر"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}

export default CustomerData;

import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import { HiShoppingCart } from "react-icons/hi";
import { formateCurrency } from "../../utils/helpers";

function OrderBox({ order }) {
    return (
        <Card shadow="none" className="p-4">
            <CardBody>
                <Accordion>
                    <AccordionItem key="1" aria-label="Accordion 1" title="منتجات الطلب:">
                        <div className="divide-y divide-default-100">
                            {order?.cart?.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                                            <HiShoppingCart size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-medium font-medium">{item.name}</span>
                                            <span className="text-small text-default-400">المقاس: {item.size}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="flex flex-col items-center">
                                            <span className="text-tiny text-default-400">الكمية</span>
                                            <span className="text-small font-semibold">{item.quantity}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-tiny text-default-400">سعر الوحدة</span>
                                            <span className="text-small font-semibold">{item.price}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-tiny text-default-400">المجموع</span>
                                            <span className="text-small font-bold text-primary">{item.total}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>
                </Accordion>

                <div className="pt-6 border-t border-default-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-medium">المجموع الفرعي:</span>
                        <span className="text-medium font-semibold">{formateCurrency(order.sub_total)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-medium">الشحن:</span>
                        <span className="text-medium font-semibold">{formateCurrency(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-large font-bold">المجموع الكلي:</span>
                        <span className="text-large font-bold text-primary">{formateCurrency(order.total)}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default OrderBox

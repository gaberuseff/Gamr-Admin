import { Button } from "@heroui/react";
import OrdersOverview from "./OrdersOverview";
import ProductsOverview from "./ProductsOverview";

function ExportPreview({ dataOverview, onConfirm, onCancel }) {
    return (
        <div className="flex flex-col gap-4">
            {dataOverview.type === 'orders' ? (
                <OrdersOverview overview={dataOverview} />
            ) : (
                <ProductsOverview overview={dataOverview} />
            )}

            <div className="flex gap-2 mt-4">
                <Button
                    color="primary"
                    onPress={onConfirm}
                    className="text-white"
                >
                    تأكيد التصدير
                </Button>
                <Button
                    variant="flat"
                    onPress={onCancel}
                >
                    إلغاء
                </Button>
            </div>
        </div>
    );
}

export default ExportPreview;

import { Card, CardBody, Divider } from "@heroui/react";

function ProductsOverview({ overview }) {
    return (
        <Card shadow="none">
            <CardBody className="gap-4">
                <h3 className="text-xl font-bold text-center">ملخص المنتجات</h3>

                <Divider />

                <div className="grid grid-cols-2 gap-6">
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">عدد المنتجات</p>
                        <p className="text-3xl font-bold">{overview.count}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">المنتجات المتوفرة</p>
                        <p className="text-2xl font-bold text-green-600">
                            {overview.inStockCount}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">المنتجات غير المتوفرة</p>
                    <p className="text-2xl font-bold text-red-600">
                        {overview.outOfStockCount}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}

export default ProductsOverview;

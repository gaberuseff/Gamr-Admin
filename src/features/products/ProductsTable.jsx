import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
    useDraggable,
    User,
} from "@heroui/react";
import { useCallback, useRef, useState } from "react";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

import Center from "../../ui/Center";
import Error from "../../ui/Error";
import { formateCurrency } from "../../utils/helpers";
import useDeleteProduct from "./useDeleteProduct";
import useProducts from "./useProducts";
import EditProduct from "./EditProduct";

export const columns = [
    { name: "المنتج", uid: "product" },
    { name: "السعر", uid: "price" },
    { name: "المخزون", uid: "stock" },
    { name: "الخصم", uid: "discount" },
    { name: "الإجراءات", uid: "actions" },
];

const stockColorMap = {
    true: "success",
    false: "danger",
};

function ProductsTable() {
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const targetRef = useRef(null);
    const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

    const {
        products,
        totalPages,
        isProductsPending,
        productsError,
        currentPage,
        setSearchParams,
    } = useProducts();

    const { deleteProduct, isDeletingProduct } = useDeleteProduct();

    const handleDeleteClick = (productId) => {
        setSelectedProductId(productId);
        onOpen();
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        onEditOpen();
    };

    const handleConfirmDelete = () => {
        if (selectedProductId) {
            deleteProduct(selectedProductId, {
                onSuccess: () => {
                    onOpenChange(false);
                }
            });
        }
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString() });
    };

    const renderCell = useCallback((product, columnKey) => {
        const cellValue = product[columnKey];

        switch (columnKey) {
            case "product":
                return (
                    <User
                        avatarProps={{
                            radius: "sm",
                            src: product.images?.[0] || "/placeholder.svg",
                            className: "w-16 h-16",
                        }}
                        description={product.name_en}
                        name={product.name_ar}
                    >
                        {product.name_en}
                    </User>
                );

            case "price": {
                const prices = product.sizes?.map((size) => size.price) || [];
                if (prices.length === 0) return "غير محدد";
                if (prices.length === 1) return formateCurrency(prices[0]);

                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">
                            {formateCurrency(minPrice)} - {formateCurrency(maxPrice)}
                        </p>
                    </div>
                );
            }

            case "stock":
                return (
                    <Chip
                        className="capitalize"
                        color={stockColorMap[product.in_stock]}
                        size="sm"
                        variant="flat"
                    >
                        {product.in_stock ? "متوفر" : "غير متوفر"}
                    </Chip>
                );

            case "discount":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm">
                            {product.discount ? `${product.discount}%` : "لا يوجد"}
                        </p>
                    </div>
                );

            case "actions":
                return (
                    <div className="relative flex items-center justify-center gap-4">
                        <Tooltip content="تعديل المنتج">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => handleEditClick(product)}
                            >
                                <HiOutlinePencil />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="حذف المنتج">
                            <span
                                className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDeleteClick(product.id)}
                            >
                                <HiOutlineTrash />
                            </span>
                        </Tooltip>
                    </div>
                );

            default:
                return cellValue;
        }
    }, []);

    if (isProductsPending) {
        return (
            <Center>
                <Spinner size="lg" />
            </Center>
        );
    }

    if (productsError) {
        return <Error message={productsError.message} />;
    }

    return (
        <div className="flex flex-col gap-4">
            <Table aria-label="Products Table" shadow="none">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody items={products}>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-12">
                                لا توجد منتجات
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex justify-end">
                <Pagination
                    color="primary"
                    page={currentPage}
                    total={totalPages}
                    onChange={handlePageChange}
                    showControls
                />
            </div>

            {/* Modal حذف المنتج */}
            <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader {...moveProps} className="flex flex-col gap-1">
                                حذف المنتج
                            </ModalHeader>
                            <ModalBody>
                                <p>هل انت متأكد من حذف المنتج؟</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    إلغاء
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleConfirmDelete}
                                    isLoading={isDeletingProduct}
                                >
                                    حذف
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal تعديل المنتج */}
            <EditProduct
                isOpen={isEditOpen}
                onOpenChange={onEditOpenChange}
                product={selectedProduct}
            />
        </div>
    );
}

export default ProductsTable;
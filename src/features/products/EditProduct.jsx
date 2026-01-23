import {
    Button,
    Checkbox,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@heroui/react";

import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import useUpdateProduct from "./useUpdateProduct";
import EditableImageUploader from "./EditableImageUploader";
import { uploadMultipleProductImages, deleteMultipleProductImages } from "../../services/apiStorage";
import toast from "react-hot-toast";

function EditProduct({ isOpen, onOpenChange, product }) {
    const [sizes, setSizes] = useState([{ size: "", price: "" }]);
    const [inStock, setInStock] = useState(true);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const { updateProduct, isUpdatingProduct } = useUpdateProduct();

    // ملء البيانات عند فتح الموديل
    useEffect(() => {
        if (product && isOpen) {
            setSizes(product.sizes || [{ size: "", price: "" }]);
            setInStock(product.in_stock ?? true);
            setNewImages([]);
            setDeletedImages([]);
        }
    }, [product, isOpen]);

    const handleAddSize = () => {
        setSizes([...sizes, { size: "", price: "" }]);
    };

    const handleRemoveSize = (index) => {
        if (sizes.length > 1) {
            setSizes(sizes.filter((_, i) => i !== index));
        }
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = value;
        setSizes(newSizes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        data.sizes = sizes.map(s => ({
            size: s.size,
            price: parseFloat(s.price)
        }));
        data.in_stock = inStock;
        data.discount = parseFloat(data.discount) || 0;

        // حذف الصور المحذوفة من Supabase
        if (deletedImages.length > 0) {
            try {
                await deleteMultipleProductImages(deletedImages);
            } catch (error) {
                console.error('Error deleting images:', error);
                toast.error('فشل حذف بعض الصور');
            }
        }

        // رفع الصور الجديدة
        let uploadedImageUrls = [];
        if (newImages.length > 0) {
            try {
                setIsUploadingImages(true);
                uploadedImageUrls = await uploadMultipleProductImages(newImages, data.name_en);
            } catch (error) {
                console.error('Error uploading images:', error);
                toast.error('فشل رفع الصور');
                setIsUploadingImages(false);
                return;
            } finally {
                setIsUploadingImages(false);
            }
        }

        // دمج الصور: الصور الموجودة (غير المحذوفة) + الصور الجديدة
        const existingProductImages = product.images || [];
        const remainingImages = existingProductImages.filter(img => !deletedImages.includes(img));
        data.images = [...remainingImages, ...uploadedImageUrls];

        updateProduct(
            { productId: product.id, productData: data },
            {
                onSuccess: () => {
                    handleReset();
                    onOpenChange(false);
                }
            }
        );
    };

    const handleReset = () => {
        if (product) {
            setSizes(product.sizes || [{ size: "", price: "" }]);
            setInStock(product.in_stock ?? true);
        }
        setNewImages([]);
        setDeletedImages([]);
    };

    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">تعديل المنتج</ModalHeader>
                        <ModalBody>
                            <Form
                                className="w-full flex flex-col gap-4"
                                onReset={handleReset}
                                onSubmit={handleSubmit}
                            >
                                <div className="flex gap-4 w-full">
                                    <Input
                                        isRequired
                                        errorMessage="الاسم باللغة العربية"
                                        labelPlacement="inside"
                                        name="name_ar"
                                        placeholder="الاسم باللغة العربية"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={product.name_ar}
                                    />

                                    <Input
                                        isRequired
                                        errorMessage="الاسم باللغة الإنجليزية"
                                        labelPlacement="inside"
                                        name="name_en"
                                        placeholder="الاسم باللغة الإنجليزية"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={product.name_en}
                                    />
                                </div>

                                <div className="flex gap-4 w-full">
                                    <Textarea
                                        isRequired
                                        errorMessage="الوصف باللغة العربية"
                                        labelPlacement="inside"
                                        name="description_ar"
                                        placeholder="الوصف باللغة العربية"
                                        autoComplete="off"
                                        defaultValue={product.description_ar}
                                    />

                                    <Textarea
                                        isRequired
                                        errorMessage="الوصف باللغة الإنجليزية"
                                        labelPlacement="inside"
                                        name="description_en"
                                        placeholder="الوصف باللغة الإنجليزية"
                                        autoComplete="off"
                                        defaultValue={product.description_en}
                                    />
                                </div>

                                <div className="flex gap-4 w-full items-center">
                                    <Input
                                        errorMessage="الخصم"
                                        labelPlacement="inside"
                                        name="discount"
                                        placeholder="الخصم"
                                        defaultValue={product.discount || 0}
                                        type="number"
                                        autoComplete="off"
                                    />

                                    <Checkbox
                                        isSelected={inStock}
                                        onValueChange={setInStock}
                                        name="in_stock"
                                    >
                                        فى المخزون؟
                                    </Checkbox>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium">الأحجام والأسعار</label>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            variant="flat"
                                            startContent={<HiOutlinePlus />}
                                            onClick={handleAddSize}
                                            type="button"
                                        >
                                            إضافة حجم
                                        </Button>
                                    </div>

                                    {sizes.map((sizeItem, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Input
                                                isRequired
                                                placeholder="الحجم (مثال: 50ml)"
                                                value={sizeItem.size}
                                                onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                                                className="flex-1"
                                                autoComplete="off"
                                            />
                                            <Input
                                                isRequired
                                                placeholder="السعر"
                                                type="number"
                                                value={sizeItem.price}
                                                onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                                                className="flex-1"
                                                autoComplete="off"
                                            />
                                            {sizes.length > 1 && (
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onClick={() => handleRemoveSize(index)}
                                                    type="button"
                                                >
                                                    <HiOutlineTrash />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* رفع وحذف الصور */}
                                <div className="w-full">
                                    <EditableImageUploader
                                        existingImages={product.images || []}
                                        newImages={newImages}
                                        setNewImages={setNewImages}
                                        deletedImages={deletedImages}
                                        setDeletedImages={setDeletedImages}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        color="primary"
                                        type="submit"
                                        isLoading={isUpdatingProduct || isUploadingImages}
                                    >
                                        {isUploadingImages ? "جاري رفع الصور..." : "حفظ التعديلات"}
                                    </Button>
                                    <Button type="reset" variant="flat">
                                        إعادة تعيين
                                    </Button>
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                إلغاء
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default EditProduct

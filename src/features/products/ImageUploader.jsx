import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { HiOutlinePhotograph, HiOutlineTrash, HiOutlineX } from "react-icons/hi";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ImageUploader({ images, setImages }) {
    const [previews, setPreviews] = useState([]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addImages(files);
    };

    const addImages = (files) => {
        // فلترة الصور فقط
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        // التحقق من الحد الأقصى
        if (images.length + imageFiles.length > MAX_IMAGES) {
            alert(`يمكنك رفع ${MAX_IMAGES} صور كحد أقصى`);
            return;
        }

        // التحقق من حجم الملفات
        const validFiles = imageFiles.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                alert(`الصورة ${file.name} أكبر من 5MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // إضافة الصور
        setImages([...images, ...validFiles]);

        // إنشاء معاينات
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">صور المنتج</label>
                <span className="text-xs text-gray-500">
                    {images.length} / {MAX_IMAGES} صور
                </span>
            </div>

            {/* منطقة رفع الصور */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => document.getElementById('image-input').click()}
            >
                <HiOutlinePhotograph className="mx-auto text-3xl text-gray-400 mb-1" />
                <p className="text-sm text-gray-600 mb-1">اضغط لاختيار الصور أو اسحبها هنا</p>
                <p className="text-xs text-gray-400">حد أقصى {MAX_IMAGES} صور، كل صورة حتى 5MB</p>
                <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* معاينة الصور */}
            {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                            >
                                <HiOutlineX />
                            </Button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {(images[index].size / 1024).toFixed(0)} KB
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;

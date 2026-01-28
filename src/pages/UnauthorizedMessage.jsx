import { HiOutlineShieldExclamation } from "react-icons/hi2";

function UnauthorizedMessage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] p-6">
            <div className="max-w-2xl w-full p-10 text-center">
                {/* Warning Icon */}
                <div className="mb-8 flex justify-center">
                    <HiOutlineShieldExclamation className="w-20 h-20 text-warning" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4">
                    غير مصرح بالدخول
                </h1>

                {/* Divider */}
                <div className="w-16 h-1 bg-warning mx-auto mb-6 rounded-full"></div>

                {/* Description */}
                <p className="text-lg mb-3 text-default-700">
                    عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
                </p>

                <p className="text-base font-semibold mb-6 text-warning">
                    هذه الصفحة متاحة فقط لمستخدمي Admin
                </p>

                {/* Info Message */}
                <p className="text-sm text-default-500 border-t pt-6">
                    يمكنك التنقل إلى الصفحات الأخرى باستخدام القائمة العلوية
                </p>
            </div>
        </div>
    );
}

export default UnauthorizedMessage;

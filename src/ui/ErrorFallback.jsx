import { Button } from '@heroui/react';
import { HiRefresh } from 'react-icons/hi';
import { HiHome, HiMiniExclamationCircle } from 'react-icons/hi2';

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="max-w-2xl w-full p-10 text-center">
                {/* Warning Icon */}
                <div className="mb-8 flex justify-center">
                    <HiMiniExclamationCircle className="w-20 h-20 text-danger" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4">
                    حدث خطأ غير متوقع
                </h1>

                {/* Divider */}
                <div className="w-16 h-1 bg-danger mx-auto mb-6 rounded-full"></div>

                {/* Description */}
                <p className="text-lg mb-3 text-default-700">
                    عذراً، حدث خطأ أثناء تحميل هذه الصفحة.
                </p>

                <p className="text-base font-semibold mb-6 text-warning">
                    نعتذر عن هذا الإزعاج
                </p>

                {/* Info Message */}
                <p className="text-sm text-default-500 border-t pt-6">
                    يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية
                </p>

                {/* Error Details - Development Only */}
                {import.meta.env.DEV && error && (
                    <div className="p-4 bg-danger-50 rounded-lg text-right">
                        <p className="text-xs font-semibold text-danger mb-2">
                            تفاصيل الخطأ (وضع التطوير):
                        </p>
                        <p className="text-xs font-mono text-danger-600">
                            {error.toString()}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <Button
                        color="primary"
                        variant="solid"
                        startContent={<HiRefresh className="w-5 h-5" />}
                        onClick={resetErrorBoundary}
                    >
                        حاول مرة أخرى
                    </Button>
                    <Button
                        color="default"
                        variant="flat"
                        startContent={<HiHome className="w-5 h-5" />}
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        الصفحة الرئيسية
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ErrorFallback;

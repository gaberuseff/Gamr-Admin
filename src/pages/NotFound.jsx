import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { HiHome, HiArrowRight } from "react-icons/hi2";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] bg-bg flex items-center justify-center">
      <div className="text-center px-6 max-w-lg">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-text mb-6">404</h1>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-text mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-text-secondary mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            color="primary"
            className="font-semibold"
            startContent={<HiHome className="w-5 h-5" />}
            onPress={() => navigate("/")}
          >
            العودة للرئيسية
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="border-border font-semibold"
            endContent={<HiArrowRight className="w-5 h-5" />}
            onPress={() => navigate(-1)}
          >
            الرجوع للخلف
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;


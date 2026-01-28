import { Button } from "@heroui/react"
import { HiArrowLeft } from "react-icons/hi"
import Center from "../../ui/Center"

function OrderNotFound() {
    return (
        <Center>
            <div className="text-center space-y-4 max-w-md">
                <div className="text-6xl">📦</div>
                <h2 className="text-2xl font-bold text-text">الطلب غير موجود</h2>
                <p className="text-text-secondary">
                    عذراً، الطلب الذي تبحث عنه غير موجود أو تم حذفه من قاعدة البيانات.
                </p>
                <Button
                    color="primary"
                    onClick={() => navigate("/orders")}
                    endContent={<HiArrowLeft />}
                >
                    العودة إلى قائمة الطلبات
                </Button>
            </div>
        </Center>
    )
}

export default OrderNotFound

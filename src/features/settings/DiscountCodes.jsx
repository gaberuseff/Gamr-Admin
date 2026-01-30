import AddDiscountCode from "./AddDiscountCode"
import DiscountsTable from "./DiscountsTable"

function DiscountCodes() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">أكواد الخصم</h1>
                <AddDiscountCode />
            </div>
            <DiscountsTable />
        </div>
    )
}

export default DiscountCodes

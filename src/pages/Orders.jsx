import OrdersTable from "../features/orders/OrdersTable"
import OrdersTableOperations from "../features/orders/OrdersTableOperations"

function Orders() {
    return (
        <>
            <OrdersTableOperations />
            <OrdersTable />
        </>
    )
}

export default Orders

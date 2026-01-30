import DeleteOrdersBtn from "../features/orders/DeleteOrdersBtn"
import OrdersTable from "../features/orders/OrdersTable"
import OrdersTableOperations from "../features/orders/OrdersTableOperations"

function Orders() {
    return (
        <>
            <OrdersTableOperations />
            <OrdersTable />
            <DeleteOrdersBtn />
        </>
    )
}

export default Orders

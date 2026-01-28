import { createContext, useContext, useState } from "react";

const NewOrdersContext = createContext();

export function NewOrdersProvider({ children }) {
    const [newOrdersCount, setNewOrdersCount] = useState(0);

    const incrementNewOrders = () => {
        setNewOrdersCount((prev) => prev + 1);
    };

    const resetNewOrders = () => {
        setNewOrdersCount(0);
    };

    return (
        <NewOrdersContext.Provider
            value={{
                newOrdersCount,
                incrementNewOrders,
                resetNewOrders,
            }}
        >
            {children}
        </NewOrdersContext.Provider>
    );
}

export function useNewOrders() {
    const context = useContext(NewOrdersContext);
    if (!context) {
        throw new Error("useNewOrders must be used within NewOrdersProvider");
    }
    return context;
}

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes";
import useOrdersRealtime from "./features/orders/useOrdersRealtime";
import { NewOrdersProvider } from "./contexts/NewOrdersContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

function AppContent() {
  // Subscribe to realtime orders notifications
  useOrdersRealtime();

  return (
    <>
      <AppRoutes />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />

      <Toaster position="top-center" toastOptions={{
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
      }} />
    </>
  );
}

function App() {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <NewOrdersProvider>
          <AppContent />
        </NewOrdersProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

export default App;

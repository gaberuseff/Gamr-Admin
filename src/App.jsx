import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes";
import useOrdersRealtime from "./features/orders/useOrdersRealtime";
import { NewOrdersProvider } from "./contexts/NewOrdersContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
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
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.href = '/dashboard'}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
      }}
    >
      <HeroUIProvider>
        <QueryClientProvider client={queryClient}>
          <NewOrdersProvider>
            <AppContent />
          </NewOrdersProvider>
        </QueryClientProvider>
      </HeroUIProvider>
    </ErrorBoundary>
  );
}

export default App;

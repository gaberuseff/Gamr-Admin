import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </HeroUIProvider>
  );
}

export default App;

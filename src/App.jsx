/**
 * App Component
 * Main application component with routing and providers
 */

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes/AppRoutes";
import { useAuthStore, useUIStore } from "./store";
import ToastContainer from "./components/shared/ToastContainer";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const logout = useAuthStore((state) => state.logout);
  const theme = useUIStore((state) => state.theme);
  const initializeTheme = useUIStore((state) => state.initializeTheme);

  // Initialize auth from localStorage on app load
  useEffect(() => {
    initAuth();
    initializeTheme();
  }, [initAuth, initializeTheme]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auticare:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auticare:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle("dark", theme === "dark");
    body.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    localStorage.setItem("auticare-theme", theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;

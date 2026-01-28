import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./features/auth/LoginForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Order from "./pages/Order";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import AdminOnlyRoute from "./ui/AdminOnlyRoute";
import AppLayout from "./ui/AppLayout";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import PublicRoute from "./ui/PublicRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes>
          <AppLayout />
        </ProtectedRoutes>}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<Order />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={
            <AdminOnlyRoute>
              <Users />
            </AdminOnlyRoute>
          } />
        </Route>

        <Route path="login" element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="h-screen flex flex-col theme-surface space-y-6">
      <Header />

      <main className="flex-1 overflow-y-auto py-4 px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

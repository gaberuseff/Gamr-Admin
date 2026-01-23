import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />

      <main className="flex-1 overflow-y-auto p-4 theme-surface">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

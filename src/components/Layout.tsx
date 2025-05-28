import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, useSidebar } from "@/components/sidebar";

export default function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { isCollapsed } = useSidebar();

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 max-w-screen-2xl min-h-dvh overflow-auto ${
          isCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

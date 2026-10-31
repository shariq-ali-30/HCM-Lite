
import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings as SettingsIcon,
  UsersRound,
  X,
} from "lucide-react";

import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pathname } = useLocation();

  // Navigation Items
  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      to: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "users",
      label: "Employees",
      to: "/admin/employees",
      icon: UsersRound,
    },
    {
      key: "leave-requests",
      label: "Leave Requests",
      to: "/admin/leave-requests",
      icon: CalendarDays,
    },
    {
      key: "settings",
      label: "Settings",
      to: "/admin/settings",
      icon: SettingsIcon,
    },
  ];

  // Active Link Based on URL
  const activeLink =
    navItems.find((item) => item.to === pathname)?.key || "";

  // Close Sidebar on Route Change & Escape Key
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  // Reusable Sidebar
  const renderSidebar = (mobile = false) => (
    <aside
      id={mobile ? "admin-mobile-sidebar" : undefined}
      role={mobile ? "dialog" : undefined}
      aria-modal={mobile ? "true" : undefined}
      aria-label={mobile ? "Admin navigation" : undefined}
      aria-hidden={mobile ? !isSidebarOpen : undefined}
      className={
        mobile
          ? `fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] max-w-[85vw] shrink-0 flex-col border-r border-[#DCE7F8] bg-white shadow-2xl xl:hidden transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full pointer-events-none"
            }`
          : "hidden h-full w-[232px] shrink-0 flex-col border-r border-[#DCE7F8] bg-white 2xl:w-[248px] xl:flex"
      }
    >
      {/* Sidebar Header / Brand */}
      <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#E3ECFA] px-4">
        <p className="text-[17px] font-bold text-[#0A205A]">
          Admin Panel
        </p>

        {mobile && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
            tabIndex={!isSidebarOpen ? -1 : 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#45618F] transition-colors hover:bg-[#F2F6FD]"
          >
            <X size={21} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 overflow-y-auto px-3 py-5"
      >
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink === item.key;

            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                tabIndex={mobile && !isSidebarOpen ? -1 : undefined}
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex h-[48px] 2xl:h-[50px] w-full items-center gap-3.5 rounded-r-lg rounded-l-md px-4 text-left text-[14px] 2xl:text-[15px] font-semibold transition-colors ${
                  isActive
                    ? "bg-[#E8F1FF] text-[#0869EF]"
                    : "text-[#294879] hover:bg-[#F4F8FF]"
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-0 top-0 w-[4px] rounded-r-full bg-[#2379F6]" />
                )}

                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-[#2379F6]"
                      : "text-[#5B75A4]"
                  }
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin Profile & Logout */}
      <div className="mt-auto shrink-0 border-t border-[#E3ECFA] px-4 pb-5 pt-5 2xl:px-5">
        <div className="mb-4 flex items-center gap-3 px-1.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9E8FF] text-[18px] 2xl:text-[20px] font-medium text-[#1670EC]">
            A
          </div>

          <div className="min-w-0">
            <p className="text-[14px] 2xl:text-[15px] font-bold leading-5 text-[#0A205A]">
              Admin
            </p>

            <p className="text-[12px] leading-4 text-[#45618F]">
              Administrator
            </p>
          </div>
        </div>

        <button
          type="button"
          tabIndex={mobile && !isSidebarOpen ? -1 : undefined}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#2379F6] text-[13px] font-semibold text-[#0869EF] transition-colors hover:bg-[#F2F7FF]"
        >
          <LogOut size={17} strokeWidth={2.3} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F5F8FE] font-sans text-[#0A205A]">

      {/* Desktop Sidebar */}
      {renderSidebar(false)}

      {/* Mobile Overlay - Always Mounted for Animation */}
      <button
        type="button"
        aria-label="Close sidebar overlay"
        aria-hidden={!isSidebarOpen}
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-[#0A205A]/40 xl:hidden transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Sidebar - Always Mounted for Slide Animation */}
      {renderSidebar(true)}

      {/* Main Dashboard Area */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

        {/* Mobile / Tablet Header */}
        <header className="flex h-[68px] 2xl:h-[72px] shrink-0 items-center gap-3 border-b border-[#E6EEFC] bg-white px-4 sm:px-6 xl:hidden">

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="admin-mobile-sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#294879] transition-colors hover:bg-[#F2F6FD]"
          >
            <Menu size={23} />
          </button>

          <p className="text-[16px] font-bold text-[#0A205A]">
            Admin Panel
          </p>
        </header>

        {/* Main Content */}
        <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-5 sm:px-6 sm:py-6 lg:px-7 2xl:px-9 2xl:py-7 [scrollbar-color:#B8CDED_#F3F7FE] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#F3F7FE] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#F3F7FE] [&::-webkit-scrollbar-thumb]:bg-[#B8CDED] hover:[&::-webkit-scrollbar-thumb]:bg-[#8EAFDF]">

          <div className="relative z-10 min-h-full w-full">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
}

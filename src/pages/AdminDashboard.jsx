import {
  Bell,
  CalendarDays,
  ChevronDown,
  Cog,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UsersRound,
} from "lucide-react";
import Settings from "../components/Settings";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Employees", icon: UsersRound },
  { label: "Leave Requests", icon: CalendarDays },
  { label: "Settings", icon: Cog, active: true },
];

export default function AdminDashboard() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F5F8FE] font-sans text-[#0A205A]">
      {/* Fixed dashboard sidebar */}
      <aside className="hidden h-full w-[232px] 2xl:w-[248px] shrink-0 flex-col border-r border-[#DCE7F8] bg-white xl:flex">
        <div className="flex h-[72px] 2xl:h-[76px] shrink-0 items-center border-b border-[#E6EEFC] px-5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-end justify-center text-[#0759D7]">
              <div className="absolute left-[10px] top-0 flex h-[19px] w-[19px] items-center justify-center rounded-[3px] bg-[#0A347E]">
                <span className="grid grid-cols-2 gap-[3px]">
                  {Array.from({ length: 4 }, (_, index) => (
                    <i
                      key={index}
                      className="h-[3px] w-[3px] rounded-[1px] bg-white"
                    />
                  ))}
                </span>
              </div>
              <UsersRound
                size={31}
                strokeWidth={2.7}
                className="relative z-10 fill-[#2379F6] text-[#0759D7]"
              />
            </div>
            <span className="whitespace-nowrap text-[20px] 2xl:text-[22px] font-bold tracking-tight text-[#08245F]">
              HCM-<span className="text-[#2379F6]">Lite</span>
            </span>
          </div>
        </div>

        <nav aria-label="Main navigation" className="px-3 pt-5 2xl:pt-6">
          <div className="space-y-1.5">
            {navigation.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                aria-current={active ? "page" : undefined}
                className={`relative flex h-[48px] 2xl:h-[50px] w-full items-center gap-3.5 rounded-r-lg rounded-l-md px-4 text-left text-[14px] 2xl:text-[15px] font-semibold transition-colors ${
                  active
                    ? "bg-[#E8F1FF] text-[#0869EF]"
                    : "text-[#294879] hover:bg-[#F4F8FF]"
                }`}
              >
                {active && (
                  <span className="absolute bottom-0 left-0 top-0 w-[4px] rounded-r-full bg-[#2379F6]" />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.7 : 2.3}
                  className={active ? "text-[#2379F6]" : "text-[#5B75A4]"}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

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
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#2379F6] text-[13px] font-semibold text-[#0869EF] transition-colors hover:bg-[#F2F7FF]"
          >
            <LogOut size={17} strokeWidth={2.3} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex sm:hidden h-[68px] 2xl:h-[72px] shrink-0 items-center justify-between border-b border-[#E6EEFC] bg-white px-5 sm:px-6 2xl:px-8"></header>

        <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-6 sm:px-6 lg:px-7 2xl:px-9 2xl:py-7 [scrollbar-color:#B8CDED_#F3F7FE] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#F3F7FE] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#F3F7FE] [&::-webkit-scrollbar-thumb]:bg-[#B8CDED] hover:[&::-webkit-scrollbar-thumb]:bg-[#8EAFDF]">
          <div className="relative z-10 min-h-full w-full">
            <Settings />
          </div>
        </main>
      </div>
    </div>
  );
}

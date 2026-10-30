import {
  Building2,
  CalendarDays,
  Clock3,
  Cog,
  Info,
  Save,
  ShieldCheck,
} from "lucide-react";

const settingNotes = [
  {
    title: "Office Time",
    description: "Set the time when your office starts.",
    icon: Clock3,
  },
  {
    title: "Grace Minutes",
    description: "Extra minutes allowed for check-in.",
    icon: ShieldCheck,
  },
  {
    title: "Leave Quota",
    description: "Annual leaves per employee.",
    icon: CalendarDays,
  },
];

const inputClassName =
  "h-11 w-full rounded-lg 2xl:h-12 border border-[#D2E1FB] bg-white px-4 text-[14px] 2xl:text-[15px] font-medium text-[#17315F] outline-none transition-colors placeholder:text-[#8299C2] focus:border-[#2379F6]";

export default function Settings() {
  return (
    <div className="flex min-h-full w-full flex-col gap-4 pb-2">
      {/* Page title */}
      <div className="relative flex min-h-[76px] 2xl:min-h-[84px] shrink-0 items-center justify-between overflow-hidden px-1">
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-[58px] w-[58px] 2xl:h-16 2xl:w-16 shrink-0 items-center justify-center rounded-[14px] bg-[#DCEAFF]">
            <Cog size={33} strokeWidth={2.6} className="text-[#1672F5]" />
          </div>
          <div>
            <h1 className="text-[27px] 2xl:text-[30px] font-bold leading-tight tracking-tight text-[#091F5B]">
              Settings
            </h1>
            <p className="mt-0.5 text-[14px] 2xl:text-[15px] text-[#45618F]">
              Manage your company settings and rules
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-1 hidden h-[68px] w-[250px] 2xl:h-[76px] 2xl:w-[280px] items-end justify-center gap-1 rounded-t-[120px] bg-[#EAF2FF] px-3 2xl:flex"
        >
          <Cog
            size={48}
            strokeWidth={2.5}
            className="mb-1 fill-[#2379F6] text-[#2379F6]"
          />
          <div className="flex h-[42px] items-end gap-1">
            <div className="flex h-[30px] w-[22px] items-center justify-center rounded-t bg-[#8AB9FA] text-[#DCEBFF]">
              <Building2 size={15} strokeWidth={2.3} />
            </div>
            <div className="flex h-[48px] w-[29px] items-center justify-center rounded-t bg-[#6FA8F7] text-[#E8F2FF]">
              <Building2 size={20} strokeWidth={2.3} />
            </div>
            <div className="flex h-[32px] w-[22px] items-center justify-center rounded-t bg-[#8AB9FA] text-[#DCEBFF]">
              <Building2 size={15} strokeWidth={2.3} />
            </div>
          </div>
          <span className="absolute bottom-0 left-[24%] right-[7%] h-0.5 rounded-full bg-[#A9CCFF]" />
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1400px] shrink-0 rounded-xl border border-[#D9E6FB] bg-white p-5 sm:p-6 lg:p-7 2xl:p-8">
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_320px] 2xl:gap-8">
          {/* Company settings form */}
          <div className="min-w-0">
            <div className="border-b border-[#DCE8FA] pb-3">
              <h2 className="text-[22px] 2xl:text-[24px] font-bold leading-tight tracking-tight text-[#0A205A]">
                Company Settings
              </h2>
              <p className="mt-1 text-[14px] 2xl:text-[15px] text-[#38598D]">
                Update your company details and HR rules
              </p>
            </div>

            <div className="mt-5">
              <div>
                <label
                  htmlFor="company-name"
                  className="mb-1.5 flex items-center gap-2 text-[14px] 2xl:text-[15px] font-semibold text-[#0B205A]"
                >
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F0F5FF]">
                    <Building2
                      size={18}
                      strokeWidth={2.3}
                      className="text-[#4264A0]"
                    />
                  </span>
                  Company Name
                </label>
                <input
                  id="company-name"
                  name="companyName"
                  type="text"
                  defaultValue="HCM-Lite"
                  className={inputClassName}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="office-time"
                    className="mb-1.5 flex items-center gap-2 text-[14px] 2xl:text-[15px] font-semibold text-[#0B205A]"
                  >
                    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F0F5FF]">
                      <Clock3
                        size={18}
                        strokeWidth={2.3}
                        className="text-[#4264A0]"
                      />
                    </span>
                    Office Start Time
                  </label>
                  <div className="relative">
                    <input
                      id="office-time"
                      name="officeTime"
                      type="time"
                      defaultValue="13:00"
                      className={`${inputClassName} pr-9 [&::-webkit-calendar-picker-indicator]:hidden`}
                    />
                    <Clock3
                      size={16}
                      strokeWidth={2.3}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#45649B]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="grace-minutes"
                    className="mb-1.5 flex items-center gap-2 text-[14px] 2xl:text-[15px] font-semibold text-[#0B205A]"
                  >
                    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F0F5FF]">
                      <ShieldCheck
                        size={18}
                        strokeWidth={2.3}
                        className="text-[#4264A0]"
                      />
                    </span>
                    Grace Minutes
                  </label>
                  <input
                    id="grace-minutes"
                    name="graceMinutes"
                    type="number"
                    defaultValue="15"
                    className={inputClassName}
                  />
                </div>
              </div>

              <div className="mt-5 w-full sm:w-[calc(50%_-_10px)]">
                <label
                  htmlFor="leave-quota"
                  className="mb-1.5 flex items-center gap-2 text-[14px] 2xl:text-[15px] font-semibold text-[#0B205A]"
                >
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F0F5FF]">
                    <CalendarDays
                      size={18}
                      strokeWidth={2.3}
                      className="text-[#4264A0]"
                    />
                  </span>
                  Yearly Leave Quota
                </label>
                <input
                  id="leave-quota"
                  name="leaveQuota"
                  type="number"
                  defaultValue="21"
                  className={inputClassName}
                />
              </div>

              <button
                type="button"
                className="mt-5 flex h-11 2xl:h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1672F5] px-4 text-[14px] 2xl:text-[15px] font-semibold text-white transition-colors hover:bg-[#0E64E5] active:bg-[#0B57CB]"
              >
                <Save size={18} strokeWidth={2.4} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Settings help panel */}
          <aside className="h-fit rounded-xl bg-[#F0F5FD] px-5 py-5 sm:px-6 lg:block">
            <div className="flex items-center gap-2.5 border-b border-[#E2EBF9] pb-3">
              <Info
                size={26}
                strokeWidth={2.4}
                className="shrink-0 fill-[#2379F6] text-white"
              />
              <h2 className="text-[15px] 2xl:text-[16px] font-bold text-[#09245F]">
                About These Settings
              </h2>
            </div>

            <div className="space-y-5 pt-5">
              {settingNotes.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon
                    size={26}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-[#315A9E]"
                  />
                  <div className="min-w-0">
                    <h3 className="text-[14px] 2xl:text-[15px] font-bold leading-5 text-[#0A205A]">
                      {title}
                    </h3>
                    <p className="mt-0.5 text-[13px] leading-[19px] text-[#38598D]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

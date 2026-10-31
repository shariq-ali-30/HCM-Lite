
import {
  Building2,
  CalendarDays,
  Clock3,
  Cog,
  Info,
  Save,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { DataContext } from "../context/DataContext";
import { db } from "../firebase/firebase.js";

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
  "h-11 w-full rounded-lg 2xl:h-12 border border-[#D2E1FB] bg-white px-4 text-[14px] 2xl:text-[15px] font-medium text-[#17315F] outline-none transition-colors placeholder:text-[#8299C2] focus:border-[#2379F6] disabled:cursor-not-allowed disabled:bg-[#F3F6FB] disabled:text-[#8299C2]";

export default function Settings() {
  const { companySettings, loading, setCompanySettings } =
    useContext(DataContext);

  // Individual States
  const [companyName, setCompanyName] = useState("");
  const [officeTime, setOfficeTime] = useState("09:00");
  const [graceMinutes, setGraceMinutes] = useState("15");
  const [leaveQuota, setLeaveQuota] = useState("21");

  // Saving State
  const [saving, setSaving] = useState(false);

  // Messages
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // Populate States From Firestore
  useEffect(() => {
    if (!companySettings) return;

    setCompanyName(companySettings.companyName ?? "");
    setOfficeTime(companySettings.officeTime ?? "09:00");
    setGraceMinutes(String(companySettings.graceMinutes ?? 15));
    setLeaveQuota(String(companySettings.leaveQuota ?? 21));
  }, [companySettings]);

  // Auto Hide Success / Error Message
useEffect(() => {
  if (!message.text) return;

  const timer = setTimeout(() => {
    setMessage({
      type: "",
      text: "",
    });
  }, 4000);

  return () => clearTimeout(timer);
}, [message]);

  // Save Settings To Firestore
  const handleSaveSettings = async (e) => {
    e.preventDefault();

    if (loading || saving) return;

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const updatedSettings = {
        companyName: companyName.trim(),
        officeTime,
        graceMinutes: Number(graceMinutes),
        leaveQuota: Number(leaveQuota),
      };

      // Firestore Document Reference
      const settingsRef = doc(db, "company", "settings");

      // Update Firestore Document
      await updateDoc(settingsRef, updatedSettings);

      setMessage({
        type: "success",
        text: "Company settings updated successfully!",
      });
    } catch (error) {
      console.error("Error updating company settings:", error);

      setMessage({
        type: "error",
        text: "Failed to update company settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Disable All Fields While Loading / Saving
  const isDisabled = loading || saving;

  return (
    <div className="flex min-h-full w-full flex-col gap-4 pb-2">

      {/* Page Title */}
      <div className="relative flex min-h-[76px] 2xl:min-h-[84px] shrink-0 items-center justify-between overflow-hidden px-1">

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-[58px] w-[58px] 2xl:h-16 2xl:w-16 shrink-0 items-center justify-center rounded-[14px] bg-[#DCEAFF]">
            <Cog
              size={33}
              strokeWidth={2.6}
              className="text-[#1672F5]"
            />
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
      </div>

      <section className="mx-auto w-full max-w-[1280px] 2xl:max-w-[1400px] shrink-0 rounded-xl border border-[#D9E6FB] bg-white p-5 sm:p-6 lg:p-7 2xl:p-8">

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6 2xl:grid-cols-[minmax(0,1fr)_320px] 2xl:gap-8">

          {/* Company Settings Form */}
          <div className="min-w-0">

            <div className="border-b border-[#DCE8FA] pb-3">
              <h2 className="text-[22px] 2xl:text-[24px] font-bold leading-tight tracking-tight text-[#0A205A]">
                Company Settings
              </h2>

              <p className="mt-1 text-[14px] 2xl:text-[15px] text-[#38598D]">
                Update your company details and HR rules
              </p>
            </div>

            <form onSubmit={handleSaveSettings}>

              <fieldset
                disabled={isDisabled}
                className="mt-5 min-w-0 border-0 p-0"
              >

                {/* Company Name */}
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
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Office Time */}
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
                        required
                        value={officeTime}
                        onChange={(e) => setOfficeTime(e.target.value)}
                        className={`${inputClassName} pr-9 [&::-webkit-calendar-picker-indicator]:hidden`}
                      />

                      <Clock3
                        size={16}
                        strokeWidth={2.3}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#45649B]"
                      />
                    </div>
                  </div>

                  {/* Grace Minutes */}
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
                      min="0"
                      step="1"
                      required
                      value={graceMinutes}
                      onChange={(e) => setGraceMinutes(e.target.value)}
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Yearly Leave Quota */}
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
                    min="0"
                    step="1"
                    required
                    value={leaveQuota}
                    onChange={(e) => setLeaveQuota(e.target.value)}
                    className={inputClassName}
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="mt-5 flex h-11 2xl:h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1672F5] px-4 text-[14px] 2xl:text-[15px] font-semibold text-white transition-colors hover:bg-[#0E64E5] active:bg-[#0B57CB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Loading Settings...
                    </>
                  ) : (
                    <>
                      <Save size={18} strokeWidth={2.4} />
                      Save Changes
                    </>
                  )}
                </button>

              </fieldset>
            </form>

            {/* Success / Error Message */}
            {message.text && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-4 rounded-lg border px-4 py-3 text-[13px] font-medium ${
                  message.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

          </div>

          {/* Settings Help Panel */}
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

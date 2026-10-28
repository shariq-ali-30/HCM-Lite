import { useEffect, useRef, useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  UserRound,
  CircleAlert,
} from "lucide-react";
import { db } from "../firebase/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase.js";

export default function Login() {
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupNeeded, setSetupNeeded] = useState(null);
  const [error, setError] = useState("b");

  const errorTimer = useRef(null);

  const showError = (message) => {
    setError(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    errorTimer.current = setTimeout(() => {
      setError("");
      errorTimer.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (errorTimer.current) {
        clearTimeout(errorTimer.current);
      }
    };
  }, []);

  const handleSetup = async (e) => {
    e.preventDefault();

    if (!companyName.trim()) {
      document.getElementById("companyName")?.focus();
      return;
    }

    if (!adminName.trim()) {
      document.getElementById("adminName")?.focus();
      return;
    }

    if (!email.trim()) {
      document.getElementById("email")?.focus();
      return;
    }

    if (!password.trim()) {
      document.getElementById("password")?.focus();
      return;
    }

    const handleSetup = async (e) => {
      e.preventDefault();

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const user = userCredential.user;

        console.log("User created:", user.uid);
        console.log("Email:", user.email);
      } catch (error) {
        console.error("Signup error:", error.code);

        if (error.code === "auth/email-already-in-use") {
          console.log("Yeh email pehle se registered hai.");
        } else if (error.code === "auth/weak-password") {
          console.log("Password kam az kam 6 characters ka hona chahiye.");
        } else {
          console.log("Account create nahi ho saka.");
        }
      }
    };
  };

  async function checkcompany() {
    try {
      const docRef = doc(db, "company", "settings");
      const docSnap = await getDoc(docRef);

      setSetupNeeded(!docSnap.exists());
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }

  useEffect(() => {
    checkcompany();
  }, []);

  // Full-screen loading
  if (setupNeeded === null) {
    return (
      <div
        className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-[#F3F6F9]"
        role="status"
        aria-label="Loading"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D8E1E8] border-t-[#1F6B68]" />
      </div>
    );
  }

  // Consistent styling for all input fields
  const inputWrapper =
    "relative h-12 w-full rounded-lg border-[1.5px] border-[#D8E1E8] bg-white transition-colors focus-within:border-[#1F6B68]";

  const inputStyle =
    "h-full w-full rounded-lg bg-transparent py-3 pl-11 pr-3.5 text-sm text-[#17324D] outline-none placeholder:text-[#99A8B4]";

  const iconStyle =
    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8295A3]";

  const labelStyle = "mb-2 block text-sm font-medium text-[#31485B]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F9] px-4 py-8">
      {/* HCM Login / Setup Card */}
      <div className="w-full max-w-[400px] rounded-2xl border border-[#E0E7EE] bg-white px-6 py-8 sm:px-8">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-[#17324D]">
            {setupNeeded ? "Set up your company" : "Welcome back"}
          </h1>

          <p className="mt-2 text-sm leading-5 text-[#687A8B]">
            {setupNeeded
              ? "Create your company and admin account."
              : "Sign in to access your HCM workspace."}
          </p>
        </div>

        <form
          onSubmit={setupNeeded ? handleSetup : handleLogin}
          className="space-y-5"
        >
          {/* Company Name */}
          {setupNeeded && (
            <div>
              <label htmlFor="companyName" className={labelStyle}>
                Company name
              </label>

              <div className={inputWrapper}>
                <Building2 size={18} className={iconStyle} />

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Admin Name */}
          {setupNeeded && (
            <div>
              <label htmlFor="adminName" className={labelStyle}>
                Admin name
              </label>

              <div className={inputWrapper}>
                <UserRound size={18} className={iconStyle} />

                <input
                  id="adminName"
                  name="adminName"
                  type="text"
                  placeholder="Enter admin name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelStyle}>
              {setupNeeded ? "Admin email address" : "Email address"}
            </label>

            <div className={inputWrapper}>
              <Mail size={18} className={iconStyle} />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelStyle}>
              {setupNeeded ? "Create password" : "Password"}
            </label>

            <div className={inputWrapper}>
              <LockKeyhole size={18} className={iconStyle} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={setupNeeded ? "new-password" : "current-password"}
                placeholder={
                  setupNeeded ? "Create a password" : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full w-full rounded-lg bg-transparent py-3 pl-11 pr-11 text-sm text-[#17324D] outline-none placeholder:text-[#99A8B4]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#8295A3] transition-colors hover:text-[#1F6B68]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-600"
            >
              <CircleAlert size={18} className="mt-0.5 shrink-0 text-red-600" />

              <p className="min-w-0 break-words leading-5">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1F6B68] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#185653] active:bg-[#124441]"
          >
            {setupNeeded ? "Create company" : "Sign in"}
            <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

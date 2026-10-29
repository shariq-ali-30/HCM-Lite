import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  ArrowRight,
  Building2,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { auth, db } from "../firebase/firebase.js";

export default function Login() {
  const { user } = useContext(AuthContext);

  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupNeeded, setSetupNeeded] = useState(null);
  const [companyCheckError, setCompanyCheckError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const errorTimer = useRef(null);

  const navigate = useNavigate();

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

    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await setDoc(doc(db, "users", user.uid), {
        name: adminName,
        email: email.trim(),
        role: "admin",
      });

      await setDoc(doc(db, "company", "settings"), {
        companyName: companyName,
        startTime: "09:00",
        graceMinutes: 15,
        leaveQuota: 14,
      });

      navigate("/admin");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showError("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        showError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        showError("Password must be at least 6 characters long.");
      } else if (error.code === "auth/operation-not-allowed") {
        showError("Email/password signup is not enabled.");
      } else if (error.code === "auth/network-request-failed") {
        showError("Network error. Please try again.");
      } else {
        showError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      document.getElementById("email")?.focus();
      return;
    }

    if (!password.trim()) {
      document.getElementById("password")?.focus();
      return;
    }

    try {
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {
        if (docSnap.data().role === "admin") {
          navigate("/admin");
        }
        if (docSnap.data().role === "employee") {
          navigate("/employee");
        }
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        showError("Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        showError("Please enter a valid email address.");
      } else if (error.code === "auth/network-request-failed") {
        showError("Network error. Please try again.");
      } else {
        showError("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkcompany = async () => {
    try {
      const docRef = doc(db, "company", "settings");
      const docSnap = await getDoc(docRef);

      setSetupNeeded(!docSnap.exists());
    } catch (error) {
      setCompanyCheckError(true);
    }
  };

  useEffect(() => {
    checkcompany();
  }, []);

  if (user) {
    if (user.role === "admin") {
      return <Navigate to={"/admin"} />;
    }
    if (user.role === "employee") {
      return <Navigate to={"/employee"} />;
    }
  }

  if (setupNeeded === null && companyCheckError) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F9FF] px-4 py-8">
        {/* Decorative background shapes; absolutely positioned so the layout size stays unchanged. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 -top-28 h-64 w-64 rounded-full bg-[#DEEBFF]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[#C6DCFF]"
        />

        <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-[#E2ECFC] bg-white px-6 py-10 text-center shadow-sm sm:px-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <CircleAlert size={30} className="text-red-500" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#081E59]">
            Connection failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#5B7196]">
            We couldn't load your company settings. Please check your internet
            connection and try again.
          </p>

          <button
            type="button"
            onClick={checkcompany}
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2379F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1768E8] active:bg-[#1259CE] focus:outline-none focus:ring-0 focus:shadow-none"
          >
            <RefreshCw size={17} />
            Try again
          </button>

          <p className="mt-4 text-xs text-[#8299C2]">
            Your company data hasn't been changed.
          </p>
        </div>
      </div>
    );
  }

  if (setupNeeded === null) {
    return (
      <div
        className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-hidden bg-[#F5F9FF]"
        role="status"
        aria-label="Loading"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4E3FF] border-t-[#2379F6]" />
      </div>
    );
  }

  const inputWrapper =
    "relative h-12 w-full rounded-lg border-[1.5px] border-[#D2E1FB] bg-white transition-colors focus-within:border-[#2379F6]";

  const inputStyle = `h-full w-full rounded-lg bg-transparent py-3 pl-11 pr-3.5 text-sm text-[#17324D] outline-none placeholder:text-[#8299C2] transition-all focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none ${
    loading ? "cursor-not-allowed bg-gray-100 opacity-60" : "bg-transparent"
  }`;

  const iconStyle = `pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
    loading ? "text-gray-400 opacity-50" : "text-[#536B94]"
  }`;

  const labelStyle = "mb-2 block text-sm font-medium text-[#0B205A]";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F9FF] px-4 py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[125px] -top-[150px] h-[310px] w-[310px] rounded-full bg-[#DEEBFF]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[145px] top-[17%] h-[300px] w-[260px] rounded-full bg-[#DCEAFF]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[90px] -left-[75px] h-[210px] w-[245px] rounded-full bg-[#DCEAFF]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[100px] -right-[90px] h-[250px] w-[250px] rounded-full bg-[#C6DCFF]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[5%] top-[5%] hidden grid-cols-3 gap-3 sm:grid"
      >
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className="h-[10px] w-[10px] rounded-full bg-[#CBDFFF]"
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[5%] left-[8%] hidden grid-cols-3 gap-3 lg:grid"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className="h-[10px] w-[10px] rounded-full bg-[#CBDFFF]"
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[400px] rounded-2xl border border-[#E2ECFC] bg-white px-7 py-8">
        {/* Header */}
        {setupNeeded ? (
          <div className="flex items-start gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#E3EEFF] ml-[-10px]">
              <Building2
                size={26}
                strokeWidth={2.5}
                className="text-[#2379F6]"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#081E59]">
                Set up your company
              </h1>
              <p className="mt-1 text-sm leading-5 text-[#5B7196]">
                Create your company and admin account.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-[#E3EEFF] ml-[-10px]">
              <ShieldCheck
                size={26}
                strokeWidth={2.5}
                className="text-[#2379F6]"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#081E59]">
                Welcome back
              </h1>
              <p className="mt-1 text-sm leading-5 text-[#5B7196]">
                Sign in to continue to your account.
              </p>
            </div>
          </div>
        )}

        <div className="my-6 h-px w-full bg-[#DCE8FA]" />

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
                  disabled={loading}
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputStyle}
                  autoComplete="off"
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
                  disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={setupNeeded ? "new-password" : "current-password"}
                placeholder={
                  setupNeeded ? "Create a password" : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyle}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-[#536B94] transition-colors hover:text-[#2379F6] focus:outline-none focus:ring-0 focus:shadow-none"
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
            disabled={loading}
            type="submit"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2379F6] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1768E8] active:bg-[#1259CE] disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-0 focus:shadow-none"
          >
            {loading ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
              </>
            ) : (
              <>
                {setupNeeded ? "Create company" : "Sign in"}
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

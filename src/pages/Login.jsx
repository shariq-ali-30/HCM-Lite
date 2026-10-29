import { useContext, useEffect, useRef, useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  UserRound,
  CircleAlert,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const { user } = useContext(AuthContext);

  console.log(user)

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
      return <Navigate to={"admin"} />;
    }
    if (user.role === "employee") {
      return <Navigate to={"employee"} />;
    }
  }

  // Company check error UI
  if (setupNeeded === null && companyCheckError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F6F9] px-4 py-8">
        <div className="w-full max-w-[400px] rounded-2xl border border-[#E0E7EE] bg-white px-6 py-10 text-center shadow-sm sm:px-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <CircleAlert size={30} className="text-red-500" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#17324D]">
            Connection failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#687A8B]">
            We couldn't load your company settings. Please check your internet
            connection and try again.
          </p>

          <button
            type="button"
            onClick={checkcompany}
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1F6B68] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#185653] active:bg-[#124441] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6B68] focus-visible:ring-offset-2"
          >
            <RefreshCw size={17} />
            Try again
          </button>

          <p className="mt-4 text-xs text-[#99A8B4]">
            Your company data hasn't been changed.
          </p>
        </div>
      </div>
    );
  }

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

  const inputWrapper =
    "relative h-12 w-full rounded-lg border-[1.5px] border-[#D8E1E8] bg-white transition-colors focus-within:border-[#1F6B68]";

  const inputStyle = `h-full w-full rounded-lg bg-transparent py-3 pl-11 pr-3.5 text-sm text-[#17324D] outline-none placeholder:text-[#99A8B4] transition-all ${
    loading ? "cursor-not-allowed bg-gray-100 opacity-60" : "bg-transparent"
  }`;

  const iconStyle = `pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
    loading ? "text-gray-400 opacity-50" : "text-[#8295A3]"
  }`;

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
              : "Sign in to continue to your account."}
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
            disabled={loading}
            type="submit"
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1F6B68] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#185653] active:bg-[#124441] disabled:cursor-not-allowed disabled:opacity-70"
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

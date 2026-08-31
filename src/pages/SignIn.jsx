import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Building2, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "", name: "", college_name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup({ ...form, role });
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden md:flex relative bg-gradient-to-br from-brand-purple via-brand-violet to-brand-blue flex-col justify-between p-8 lg:p-10 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute left-10 bottom-20 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" /> 500+ College Fests Listed
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Discover India's <br /> Best College Fests
          </h1>
          <p className="text-white/80 max-w-sm">
            From Techfest to Riviera — find every major college fest, mark your interest,
            and never miss out again.
          </p>
        </div>

        <div className="relative flex gap-10 text-white pb-2">
          <div>
            <p className="text-2xl font-bold">50,000+</p>
            <p className="text-white/70 text-sm">students discovering fests</p>
          </div>
          <div>
            <p className="text-2xl font-bold">120+</p>
            <p className="text-white/70 text-sm">colleges listed</p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-bold text-brand-ink mb-1">
            Welcome to CampusHive
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {mode === "login" ? "Sign in to continue" : "Create your account to get started"}
          </p>

          {/* Student / College Rep toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-full transition-colors ${
                role === "student" ? "bg-white text-brand-purple shadow-sm" : "text-gray-500"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole("college_rep")}
              className={`flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-full transition-colors ${
                role === "college_rep" ? "bg-white text-brand-purple shadow-sm" : "text-gray-500"
              }`}
            >
              <Building2 className="w-4 h-4" /> College Rep
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500">Full name</label>
                  <input
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                {role === "college_rep" && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">College name</label>
                    <input
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
                      value={form.college_name}
                      onChange={(e) => setForm({ ...form, college_name: e.target.value })}
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">Email address</label>
              <input
                required
                type="email"
                placeholder="your.email@college.ac.in"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Password</label>
              <div className="relative mt-1">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-purple pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-lg py-2.5 mt-2 transition-colors disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign In" : `Create ${role === "student" ? "Student" : "College Rep"} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === "login" ? (
              <>New to CampusHive?{" "}
                <button onClick={() => setMode("signup")} className="text-brand-purple font-semibold">
                  Create an account
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-brand-purple font-semibold">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

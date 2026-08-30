import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// TODO: this page's login and signup logic already work below —
// still needs the real split-panel design (student/college-rep toggle, etc.)
export default function SignIn() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "", name: "", college_name: "" });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup({ ...form, role });
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  }

  return (
    <div className="p-8 max-w-sm mx-auto">
      <p className="text-xs text-gray-400 mb-2">
        Placeholder page — real split-panel design still needed here
      </p>
      <h1 className="text-2xl font-bold text-brand-purple mb-4">
        {mode === "login" ? "Sign in" : "Create account"}
      </h1>

      <div className="flex gap-2 mb-4 text-sm">
        <button onClick={() => setMode("login")} className={mode === "login" ? "font-bold" : "text-gray-400"}>
          Sign in
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={() => setMode("signup")} className={mode === "signup" ? "font-bold" : "text-gray-400"}>
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <>
            <input
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="flex gap-2 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" checked={role === "student"} onChange={() => setRole("student")} />
                Student
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" checked={role === "college_rep"} onChange={() => setRole("college_rep")} />
                College Rep
              </label>
            </div>
            {role === "college_rep" && (
              <input
                placeholder="College name"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.college_name}
                onChange={(e) => setForm({ ...form, college_name: e.target.value })}
              />
            )}
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brand-purple text-white rounded py-2 font-medium"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

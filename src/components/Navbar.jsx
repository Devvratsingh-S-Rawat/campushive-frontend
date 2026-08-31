import { Link } from "react-router-dom";
import { CalendarDays, Home, Compass, LayoutDashboard, Plus, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-gray-200">
      <Link to="/" className="flex items-center gap-2 text-brand-purple font-bold text-lg sm:text-xl flex-shrink-0">
        <CalendarDays className="w-6 h-6" />
        CampusHive
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
        <Link to="/" className="flex items-center gap-1.5 hover:text-brand-purple">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link to="/explore" className="flex items-center gap-1.5 hover:text-brand-purple">
          <Compass className="w-4 h-4" /> Explore
        </Link>
        {user?.role === "college_rep" && (
          <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-brand-purple">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Redundant with the button already on the Dashboard page itself,
            so on small screens it's dropped rather than squeezed in. */}
        {user?.role === "college_rep" && (
          <Link
            to="/list-fest"
            className="hidden sm:flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" /> List Your Fest
          </Link>
        )}

        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-purple px-2 sm:px-3 py-2"
          >
            <span className="hidden sm:inline">{user.name} · Sign out</span>
            <LogOut className="w-4 h-4 sm:hidden" />
          </button>
        ) : (
          <Link
            to="/signin"
            className="bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-full transition-colors whitespace-nowrap"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

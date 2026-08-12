import React from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400">
          <ShieldCheck size={22} />
          <span>Grievance Redressal</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user && (
            <>
              <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                {user.name} <span className="text-xs text-primary-600">({user.role})</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary flex items-center gap-1 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

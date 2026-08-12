import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus2, ListChecks, Star, ClipboardList, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-600 text-white"
      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
  }`;

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "warden";

  return (
    <aside className="w-60 shrink-0 hidden md:block border-r border-gray-100 dark:border-gray-800 min-h-[calc(100vh-4rem)] p-4 space-y-1">
      {!isAdmin && (
        <>
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/complaints/new" className={linkClass}>
            <FilePlus2 size={18} /> New Complaint
          </NavLink>
          <NavLink to="/complaints" className={linkClass}>
            <ListChecks size={18} /> My Complaints
          </NavLink>
          <NavLink to="/feedback" className={linkClass}>
            <Star size={18} /> Feedback
          </NavLink>
        </>
      )}
      {isAdmin && (
        <>
          <NavLink to="/admin" className={linkClass}>
            <BarChart3 size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/complaints" className={linkClass}>
            <ClipboardList size={18} /> Manage Complaints
          </NavLink>
        </>
      )}
    </aside>
  );
}

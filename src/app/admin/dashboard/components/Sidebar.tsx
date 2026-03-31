"use client";

import { IconDashboard, IconBank, IconStudent, IconLoans, IconLogs } from "./Icons";
import { logout } from "@/actions";
import { useRouter } from "next/navigation";

type Tab = "overview" | "students" | "loans" | "logs" | "registration";

export function Sidebar({ activeTab, navigateTab }: { activeTab: Tab; navigateTab: (tab: Tab) => void }) {
  const router = useRouter();

  return (
    <aside className="w-[260px] bg-[#2A2F3A] text-slate-300 flex flex-col shrink-0 transition-all">
      <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-lg mr-3 shadow-sm">
          $
        </div>
        <span className="text-white font-bold text-lg tracking-wide">
          Mynt Financial
        </span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <button
          onClick={() => navigateTab("overview")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "overview" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <IconDashboard /> Dashboard
        </button>
        <button
          onClick={() => navigateTab("registration")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "registration" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <IconBank /> Banks
        </button>
        <button
          onClick={() => navigateTab("students")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "students" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <IconStudent /> Students
        </button>
        <button
          onClick={() => navigateTab("loans")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "loans" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <IconLoans /> Loans
        </button>
        <button
          onClick={() => navigateTab("logs")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "logs" ? "bg-blue-600 text-white shadow" : "hover:bg-slate-800 hover:text-white"}`}
        >
          <IconLogs /> Logs
        </button>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-white">Admin</span>
            <button
              onClick={async () => {
                const res = await logout();
                if (res?.redirect) router.push(res.redirect);
              }}
              className="text-xs text-slate-400 hover:text-white text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

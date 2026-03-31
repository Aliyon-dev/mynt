"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminDashboardData } from "@/actions";

import { Sidebar } from "./components/Sidebar";
import { OverviewTab } from "./components/OverviewTab";
import { StudentsTab } from "./components/StudentsTab";
import { LoansTab } from "./components/LoansTab";
import { LogsTab } from "./components/LogsTab";
import { BanksTab } from "./components/BanksTab";

type Tab = "overview" | "students" | "loans" | "logs" | "registration";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [bankRegMsg, setBankRegMsg] = useState("");
  const [studentRegMsg, setStudentRegMsg] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await getAdminDashboardData();
        setData(dashboardData);
      } catch (err: any) {
        if (err.message === "Unauthorized") router.push("/");
        setError("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router, refreshTrigger]);

  async function submitFormAction(
    e: React.FormEvent<HTMLFormElement>,
    action: (formData: FormData) => Promise<any>,
    setMessage: (value: string) => void,
  ) {
    e.preventDefault();
    setMessage("");
    const formData = new FormData(e.currentTarget);
    const res = await action(formData);

    if (res?.error) {
      setMessage(`Error: ${res.error}`);
      return;
    }

    setMessage("Saved successfully.");
    e.currentTarget.reset();
    setRefreshTrigger((prev) => prev + 1);
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500 font-medium">
        Loading dashboard...
      </div>
    );
  }

  const navigateTab = (tab: Tab) => setActiveTab(tab);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-800 font-sans">
      <Sidebar activeTab={activeTab} navigateTab={navigateTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="border border-slate-200 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm">
            <div className="w-5 h-5 bg-blue-500 rounded text-xs text-white flex items-center justify-center">
              $
            </div>
            Mynt Financial
          </div>
          <button
            onClick={() => setActiveTab("registration")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            Add Bank/Student
            <span className="bg-blue-700/50 rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">
              +
            </span>
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Admin Overview
            </h1>
            <p className="text-slate-500 mb-8">
              Manage banks, students, and monitor compliance activities.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 font-medium text-sm flex items-center gap-2 border border-red-100">
              {error}
            </div>
          )}

          {activeTab === "overview" && <OverviewTab data={data} navigateTab={navigateTab} />}

          {activeTab === "students" && (
            <StudentsTab 
              data={data}
              studentRegMsg={studentRegMsg}
              setStudentRegMsg={setStudentRegMsg}
              assignMsg={assignMsg}
              setAssignMsg={setAssignMsg}
              submitFormAction={submitFormAction}
            />
          )}

          {activeTab === "loans" && <LoansTab data={data} />}

          {activeTab === "logs" && <LogsTab data={data} />}

          {activeTab === "registration" && (
            <BanksTab 
              data={data}
              bankRegMsg={bankRegMsg}
              setBankRegMsg={setBankRegMsg}
              submitFormAction={submitFormAction}
            />
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

import { IconBank, IconStudent, IconLoans } from "./Icons";
type Tab = "overview" | "students" | "loans" | "logs" | "registration";

export function OverviewTab({ data, navigateTab }: { data: any; navigateTab: (tab: Tab) => void }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Banks Metric */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <IconBank />
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Total Banks
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {data?.banks?.length || 0}
          </div>
          <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
            Registered
          </div>
        </div>

        {/* Students Metric */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <IconStudent />
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Total Students
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {data?.students?.length || 0}
          </div>
          <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
            Enrolled
          </div>
        </div>

        {/* Loans Metric */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <IconLoans />
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Loans Issued
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {data?.loans?.length || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            No changes
          </div>
        </div>

        {/* Violations Metric */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Policy Violations
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {data?.logs?.filter((log: any) => log.status === "Blocked").length || 0}
          </div>
          <div className="text-xs text-red-600 font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
            Needs attention
          </div>
        </div>
      </div>
      
      {/* Quick Insights Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Quick Insights
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage student assignments and monitor bank allocations.
            </p>
          </div>
          <button
            onClick={() => navigateTab("students")}
            className="text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Assign Bank
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded shrink-0 bg-teal-500 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-sm text-slate-700">
              <strong>No loans issued</strong> yet
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded shrink-0 bg-red-400 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-sm text-slate-700">
              <strong>
                {data?.logs?.filter((log: any) => log.status === "Blocked").length || 0} policy violation
              </strong>{" "}
              detected
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded shrink-0 bg-indigo-400 flex items-center justify-center text-white">
              <IconStudent />
            </div>
            <div className="text-sm text-slate-700">
              <strong>{data?.students?.length || 0} students</strong> in system
            </div>
          </div>
        </div>
      </div>

      {/* Student Allocations List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Student Allocations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage student assignments and view online bank allocations.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider border-b border-slate-200">
                <th className="px-6 py-4 uppercase">Student</th>
                <th className="px-6 py-4 uppercase">Assigned Bank</th>
                <th className="px-6 py-4 uppercase">Total Loans</th>
                <th className="px-6 py-4 uppercase text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.students?.map((student: any) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold tracking-tight text-xs">
                      {student.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {student.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {student.bankIdRelation?.name || (
                      <span className="text-slate-400 italic">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {data?.loans?.filter(
                      (l: any) => l.studentId === student.id,
                    ).length || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${student.bankId ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${student.bankId ? "bg-emerald-500" : "bg-amber-500"}`}
                      ></span>
                      {student.bankId ? "Active" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.students || data.students.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

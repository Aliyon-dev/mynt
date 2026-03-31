"use client";

import { addStudent, assignStudentBank } from "@/actions";
import { useState } from "react";

export function StudentsTab({
  data,
  studentRegMsg,
  setStudentRegMsg,
  assignMsg,
  setAssignMsg,
  submitFormAction,
}: {
  data: any;
  studentRegMsg: string;
  setStudentRegMsg: (v: string) => void;
  assignMsg: string;
  setAssignMsg: (v: string) => void;
  submitFormAction: (
    e: React.FormEvent<HTMLFormElement>,
    action: any,
    setMessage: any,
  ) => Promise<void>;
}) {
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [selectedStudentForAssign, setSelectedStudentForAssign] = useState("");
  const [selectedBankForAssign, setSelectedBankForAssign] = useState("");
  const [filterBank, setFilterBank] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = data?.students?.filter((student: any) => {
    // Filter by bank
    if (filterBank) {
      if (filterBank === "unassigned" && student.bankIdRelation?.name)
        return false;
      if (
        filterBank !== "unassigned" &&
        student.bankIdRelation?.id !== filterBank
      )
        return false;
    }
    // Filter by search term
    if (
      searchTerm &&
      !student.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getBankBadgeColor = (bankName: string) => {
    if (!bankName || bankName === "Unassigned")
      return "bg-gray-100 text-gray-600";
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-emerald-100 text-emerald-700",
      "bg-purple-100 text-purple-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
      "bg-cyan-100 text-cyan-700",
    ];
    const hash = bankName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForAssign || !selectedBankForAssign) {
      setAssignMsg("Please select both a student and a bank");
      return;
    }

    const formData = new FormData();
    formData.append("studentId", selectedStudentForAssign);
    formData.append("bankId", selectedBankForAssign);

    await submitFormAction(e as any, assignStudentBank, setAssignMsg);

    if (!assignMsg?.startsWith("Error")) {
      setSelectedStudentForAssign("");
      setSelectedBankForAssign("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Student Roster Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Student Roster
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                View and manage student accounts
              </p>
            </div>
            <div className="px-3 py-1 bg-gray-100 rounded-md">
              <span className="text-xs font-medium text-gray-600">
                {data?.students?.length || 0} Total
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64 relative">
              <select
                value={filterBank}
                onChange={(e) => setFilterBank(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Students</option>
                <option value="unassigned">Unassigned Only</option>
                {data?.banks?.map((bank: any) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {(filterBank || searchTerm) && (
              <button
                onClick={() => {
                  setFilterBank("");
                  setSearchTerm("");
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredStudents?.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No students found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {filterBank || searchTerm
                    ? "Try adjusting your filters"
                    : "Register your first student to get started"}
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Affiliation
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents?.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {s.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {s.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {s.id?.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBankBadgeColor(s.bankIdRelation?.name)}`}
                      >
                        {s.bankIdRelation?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => {
                          setSelectedStudentForAssign(s.id);
                          document
                            .getElementById("assign-form")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Assign Bank
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Two Column Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Register Student Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Register New Student
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Create a new student account
            </p>
          </div>

          <div className="p-6">
            {studentRegMsg && (
              <div
                className={`mb-6 p-3 rounded-md text-sm ${
                  studentRegMsg.startsWith("Error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {studentRegMsg}
              </div>
            )}

            <form
              onSubmit={(e) =>
                submitFormAction(e, addStudent, setStudentRegMsg)
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showStudentPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showStudentPassword ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Bank Assignment
                </label>
                <select
                  name="bankId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a bank</option>
                  {data?.banks?.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Register Student
              </button>
            </form>
          </div>
        </div>

        {/* Assign Bank to Student Form - Improved UX */}
        <div
          id="assign-form"
          className="bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Assign Bank to Student
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Update a student's bank affiliation
            </p>
          </div>

          <div className="p-6">
            {assignMsg && (
              <div
                className={`mb-6 p-3 rounded-md text-sm ${
                  assignMsg.startsWith("Error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {assignMsg}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              {/* Student Selection with Quick Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Student
                </label>
                <div className="relative">
                  <select
                    value={selectedStudentForAssign}
                    onChange={(e) =>
                      setSelectedStudentForAssign(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Choose a student</option>
                    {data?.students?.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.username}{" "}
                        {s.bankIdRelation?.name
                          ? `(Current: ${s.bankIdRelation.name})`
                          : "(Unassigned)"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Show current assignment info */}
                {selectedStudentForAssign && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-600">
                      Current:{" "}
                      {data?.students?.find(
                        (s: any) => s.id === selectedStudentForAssign,
                      )?.bankIdRelation?.name || "No bank assigned"}
                    </p>
                  </div>
                )}
              </div>

              {/* Bank Selection with Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select New Bank
                </label>
                <div className="relative">
                  <select
                    value={selectedBankForAssign}
                    onChange={(e) => setSelectedBankForAssign(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Choose a bank</option>
                    {data?.banks?.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  disabled={!selectedStudentForAssign || !selectedBankForAssign}
                >
                  Assign Student
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentForAssign("");
                    setSelectedBankForAssign("");
                    setAssignMsg("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-blue-500 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-blue-700">
                    Assigning a student to a bank will grant them access to that
                    bank's services and loan programs. Students can only be
                    assigned to one bank at a time.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

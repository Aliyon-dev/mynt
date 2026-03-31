"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addLoan,
  getBankDashboardData,
  processTransaction,
  testChineseWallAccess,
  logout,
} from "@/actions";

export default function BankDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"loan" | "allowance">("loan");
  const [txMessage, setTxMessage] = useState({ text: "", type: "" });

  const [loanMessage, setLoanMessage] = useState({ text: "", type: "" });
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDescription, setLoanDescription] = useState("");

  const [testStudentId, setTestStudentId] = useState("");
  const [testMessage, setTestMessage] = useState({ text: "", type: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"loans" | "transactions">("loans");

  const loadData = useCallback(async () => {
    try {
      const dashboardData = await getBankDashboardData();
      setData(dashboardData);
    } catch (err: any) {
      if (err.message === "Unauthorized") router.push("/");
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleTransaction(e: React.FormEvent) {
    e.preventDefault();
    setTxMessage({ text: "Processing...", type: "info" });

    if (!selectedStudent || !amount) {
      setTxMessage({ text: "Please fill all fields", type: "error" });
      setTimeout(() => setTxMessage({ text: "", type: "" }), 3000);
      return;
    }

    const res = await processTransaction({
      studentId: selectedStudent,
      amount: parseFloat(amount),
      type,
    });

    if (res?.error) {
      setTxMessage({ text: res.error, type: "error" });
      setTimeout(() => setTxMessage({ text: "", type: "" }), 3000);
      return;
    }

    setTxMessage({
      text: `Successfully processed ${type === "loan" ? "loan disbursement" : "allowance payment"} of $${amount}`,
      type: "success",
    });
    setAmount("");
    loadData();
    setTimeout(() => setTxMessage({ text: "", type: "" }), 3000);
  }

  async function handleAddLoan(e: React.FormEvent) {
    e.preventDefault();
    setLoanMessage({ text: "Saving loan...", type: "info" });

    if (!selectedStudent || !loanAmount) {
      setLoanMessage({ text: "Select a student and amount", type: "error" });
      setTimeout(() => setLoanMessage({ text: "", type: "" }), 3000);
      return;
    }

    const res = await addLoan({
      studentId: selectedStudent,
      amount: parseFloat(loanAmount),
      description: loanDescription,
      status: "Pending",
    });

    if (res?.error) {
      setLoanMessage({ text: res.error, type: "error" });
      setTimeout(() => setLoanMessage({ text: "", type: "" }), 3000);
      return;
    }

    setLoanMessage({
      text: "Loan added and visible to student",
      type: "success",
    });
    setLoanAmount("");
    setLoanDescription("");
    loadData();
    setTimeout(() => setLoanMessage({ text: "", type: "" }), 3000);
  }

  async function handleSimulateWall(e: React.FormEvent) {
    e.preventDefault();
    setTestMessage({ text: "Testing access controls...", type: "info" });

    const res = await testChineseWallAccess(testStudentId);

    if (res?.error) {
      setTestMessage({ text: res.error, type: "error" });
      setTimeout(() => setTestMessage({ text: "", type: "" }), 3000);
      return;
    }

    setTestMessage({ text: `Access granted to ${res.data}`, type: "success" });
    setTimeout(() => setTestMessage({ text: "", type: "" }), 3000);
  }

  const filteredStudents = data?.students?.filter((student: any) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">
                Mynt Financial
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {data?.bank?.name}
                </span>
              </div>
              <button
                onClick={async () => {
                  const res = await logout();
                  if (res?.redirect) router.push(res.redirect);
                }}
                className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bank Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage student accounts, process transactions, and enforce
            compliance boundaries
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Assigned Students
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {data?.students?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Recent Loans
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {data?.recentLoans?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Transactions
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {data?.recentTransactions?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Student Search and Table */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Students Under This Bank
              </h2>
              <div className="relative sm:w-64">
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Loan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents?.map((student: any) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {student.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {student.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {student.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.loans?.[0]?.status ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(student.loans[0].status)}`}
                        >
                          {student.loans[0].status}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No loans</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedStudent(student.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents?.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Loan Card */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Loan
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Issue a loan to an assigned student
              </p>
            </div>

            <div className="p-6">
              {loanMessage.text && (
                <div
                  className={`mb-6 p-3 rounded-md text-sm ${
                    loanMessage.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : loanMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {loanMessage.text}
                </div>
              )}

              <form onSubmit={handleAddLoan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">Choose a student</option>
                    {data?.students?.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={loanDescription}
                    onChange={(e) => setLoanDescription(e.target.value)}
                    placeholder="e.g., Tuition support"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Create Loan
                </button>
              </form>
            </div>
          </div>

          {/* Process Transaction Card */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Process Transaction
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Disburse loans or process allowances
              </p>
            </div>

            <div className="p-6">
              {txMessage.text && (
                <div
                  className={`mb-6 p-3 rounded-md text-sm ${
                    txMessage.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : txMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {txMessage.text}
                </div>
              )}

              <form onSubmit={handleTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">Choose a student</option>
                    {data?.students?.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as "loan" | "allowance")
                      }
                    >
                      <option value="loan">Loan Disbursement</option>
                      <option value="allowance">Allowance Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Process Transaction
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Compliance Testing Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Chinese Wall Test
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Validate access control boundaries
              </p>
            </div>

            <div className="p-6">
              {testMessage.text && (
                <div
                  className={`mb-6 p-3 rounded-md text-sm ${
                    testMessage.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {testMessage.text}
                </div>
              )}

              <form onSubmit={handleSimulateWall} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    value={testStudentId}
                    onChange={(e) => setTestStudentId(e.target.value)}
                    placeholder="Enter student identifier"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Verify Chinese Wall restrictions and access controls
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Run Compliance Test
                </button>
              </form>
            </div>
          </div>

          {/* Recent Loans List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Loans
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Latest loan applications
              </p>
            </div>

            <div className="p-6">
              {data?.recentLoans?.length > 0 ? (
                <div className="space-y-3">
                  {data?.recentLoans?.map((loan: any) => (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {loan.student.username}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ${loan.amount.toFixed(2)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(loan.status)}`}
                      >
                        {loan.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent loans</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminDashboardData, logout, addBank, addStudent } from "@/actions";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Tabs: 'logs', 'students', 'transactions', 'registration'
  const [activeTab, setActiveTab] = useState("logs");

  // Registration States
  const [bankRegLoading, setBankRegLoading] = useState(false);
  const [bankRegMsg, setBankRegMsg] = useState("");
  const [studentRegLoading, setStudentRegLoading] = useState(false);
  const [studentRegMsg, setStudentRegMsg] = useState("");

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

  async function handleAddBank(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBankRegLoading(true);
    setBankRegMsg("");
    const formData = new FormData(e.currentTarget);
    const res = await addBank(formData);
    if (res?.error) {
      setBankRegMsg(`Error: ${res.error}`);
    } else {
      setBankRegMsg("Bank added successfully.");
      e.currentTarget.reset();
      setRefreshTrigger((prev) => prev + 1);
    }
    setBankRegLoading(false);
  }

  async function handleAddStudent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStudentRegLoading(true);
    setStudentRegMsg("");
    const formData = new FormData(e.currentTarget);
    const res = await addStudent(formData);
    if (res?.error) {
      setStudentRegMsg(`Error: ${res.error}`);
    } else {
      setStudentRegMsg("Student added successfully.");
      e.currentTarget.reset();
      setRefreshTrigger((prev) => prev + 1);
    }
    setStudentRegLoading(false);
  }

  if (loading && !data)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div>
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">$</div>
            Mynt Financial
          </div>
          <div className="flex items-center gap-4">
            <div
              className="badge"
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                color: "#6d28d9",
                borderColor: "rgba(139, 92, 246, 0.3)",
              }}
            >
              Admin Session
            </div>
            <span style={{ fontWeight: 600 }}>University Admin</span>
            <button
              onClick={async () => {
                const res = await logout();
                if (res?.redirect) router.push(res.redirect);
              }}
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content container mt-8">
        <h1 className="text-gradient mb-8" style={{ fontSize: "2.5rem" }}>
          System Administration
        </h1>

        {error && <div className="badge badge-error mb-6">{error}</div>}

        <div className="glass-card mb-8">
          <div
            className="flex"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <button
              className={`btn ${activeTab === "logs" ? "text-gradient" : ""}`}
              style={{
                background: "transparent",
                borderRadius: 0,
                borderBottom:
                  activeTab === "logs"
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                padding: "1rem 2rem",
                color: activeTab !== "logs" ? "#64748b" : "#0f172a",
              }}
              onClick={() => setActiveTab("logs")}
            >
              Access Logs (Audit)
            </button>
            <button
              className={`btn ${activeTab === "students" ? "text-gradient" : ""}`}
              style={{
                background: "transparent",
                borderRadius: 0,
                borderBottom:
                  activeTab === "students"
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                padding: "1rem 2rem",
                color: activeTab !== "students" ? "#64748b" : "#0f172a",
              }}
              onClick={() => setActiveTab("students")}
            >
              All Students
            </button>
            <button
              className={`btn ${activeTab === "transactions" ? "text-gradient" : ""}`}
              style={{
                background: "transparent",
                borderRadius: 0,
                borderBottom:
                  activeTab === "transactions"
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                padding: "1rem 2rem",
                color: activeTab !== "transactions" ? "#64748b" : "#0f172a",
              }}
              onClick={() => setActiveTab("transactions")}
            >
              All Transactions
            </button>
            <button
              className={`btn ${activeTab === "registration" ? "text-gradient" : ""}`}
              style={{
                background: "transparent",
                borderRadius: 0,
                borderBottom:
                  activeTab === "registration"
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                padding: "1rem 2rem",
                color: activeTab !== "registration" ? "#64748b" : "#0f172a",
              }}
              onClick={() => setActiveTab("registration")}
            >
              Registration
            </button>
          </div>

          <div style={{ padding: "2rem" }}>
            {/* LOGS TAB */}
            {activeTab === "logs" && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontSize: "1.25rem" }}>
                    Security Access Audit Logs
                  </h2>
                  <div
                    className="badge"
                    style={{ background: "rgba(0,0,0,0.05)" }}
                  >
                    Total: {data?.logs?.length || 0}
                  </div>
                </div>

                {data?.logs?.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No access recorded yet.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>User (Bank/Admin)</th>
                          <th>Action Attempted</th>
                          <th>Target ID (Student)</th>
                          <th>Policy Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.logs?.map((log: any) => (
                          <tr key={log.id}>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td style={{ fontWeight: 500 }}>
                              {log.user.username}
                            </td>
                            <td>{log.action}</td>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.85rem",
                              }}
                            >
                              {log.targetId.substring(0, 8)}...
                            </td>
                            <td>
                              <span
                                className={`badge ${log.status === "Allowed" ? "badge-success" : "badge-error"}`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === "students" && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontSize: "1.25rem" }}>Registered Students</h2>
                  <div
                    className="badge"
                    style={{ background: "rgba(0,0,0,0.05)" }}
                  >
                    Total: {data?.students?.length || 0}
                  </div>
                </div>

                {data?.students?.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No students recorded.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student Username</th>
                          <th>UUID</th>
                          <th>Assigned Bank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.students?.map((student: any) => (
                          <tr key={student.id}>
                            <td style={{ fontWeight: 500 }}>
                              {student.username}
                            </td>
                            <td
                              style={{
                                fontFamily: "monospace",
                                fontSize: "0.85rem",
                              }}
                            >
                              {student.id}
                            </td>
                            <td>
                              <span className="badge badge-success">
                                {student.bankIdRelation?.name || "Unassigned"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TRANSACTIONS TAB */}
            {activeTab === "transactions" && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontSize: "1.25rem" }}>
                    Global Transaction Ledger
                  </h2>
                  <div
                    className="badge"
                    style={{ background: "rgba(0,0,0,0.05)" }}
                  >
                    Total: {data?.transactions?.length || 0}
                  </div>
                </div>

                {data?.transactions?.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No transactions recorded.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Student</th>
                          <th>Processing Bank</th>
                          <th>Type</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.transactions?.map((tx: any) => (
                          <tr key={tx.id}>
                            <td>{new Date(tx.date).toLocaleDateString()}</td>
                            <td style={{ fontWeight: 500 }}>
                              {tx.student.username}
                            </td>
                            <td>{tx.bank.name}</td>
                            <td style={{ textTransform: "capitalize" }}>
                              {tx.type}
                            </td>
                            <td
                              style={{ color: "#34d399", fontWeight: "bold" }}
                            >
                              ${tx.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* REGISTRATION TAB */}
            {activeTab === "registration" && (
              <div className="animate-fade-in flex gap-8">
                {/* Bank Form */}
                <div className="glass-card flex-1 p-6" style={{ padding: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Register New Bank</h2>
                  {bankRegMsg && (
                    <div className={`badge mb-4 ${bankRegMsg.startsWith('Error') ? 'badge-error' : 'badge-success'}`}>
                      {bankRegMsg}
                    </div>
                  )}
                  <form onSubmit={handleAddBank}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="bankName">Bank Name</label>
                      <input id="bankName" name="bankName" type="text" className="form-input" required placeholder="e.g. Absa Bank" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="username">Admin Username</label>
                      <input id="username" name="username" type="text" className="form-input" required placeholder="absa_admin" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="password">Admin Password</label>
                      <input id="password" name="password" type="password" className="form-input" required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" style={{ width: "100%" }} disabled={bankRegLoading}>
                      {bankRegLoading ? "Creating..." : "Create Bank"}
                    </button>
                  </form>
                </div>

                {/* Student Form */}
                <div className="glass-card flex-1 p-6" style={{ padding: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Register New Student</h2>
                  {studentRegMsg && (
                    <div className={`badge mb-4 ${studentRegMsg.startsWith('Error') ? 'badge-error' : 'badge-success'}`}>
                      {studentRegMsg}
                    </div>
                  )}
                  <form onSubmit={handleAddStudent}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="studentUsername">Student Username</label>
                      <input id="studentUsername" name="username" type="text" className="form-input" required placeholder="student123" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="studentPassword">Password</label>
                      <input id="studentPassword" name="password" type="password" className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="bankId">Assigned Bank</label>
                      <select id="bankId" name="bankId" className="form-select" required>
                        <option value="">Select a Bank...</option>
                        {data?.banks?.map((bank: any) => (
                          <option key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" style={{ width: "100%" }} disabled={studentRegLoading}>
                      {studentRegLoading ? "Creating..." : "Create Student"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

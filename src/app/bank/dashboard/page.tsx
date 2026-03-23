"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
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

  // Transaction processing state
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"loan" | "allowance">("loan");
  const [txMessage, setTxMessage] = useState({ text: "", type: "" });

  // Chinese Wall Simulation state
  const [testStudentId, setTestStudentId] = useState("");
  const [testMessage, setTestMessage] = useState({ text: "", type: "" });

  async function loadData() {
    try {
      const dashboardData = await getBankDashboardData();
      setData(dashboardData);
    } catch (err: any) {
      if (err.message === "Unauthorized") router.push("/");
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleTransaction(e: React.FormEvent) {
    e.preventDefault();
    setTxMessage({ text: "Processing...", type: "info" });

    if (!selectedStudent || !amount) {
      setTxMessage({ text: "Please fill all fields", type: "error" });
      return;
    }

    try {
      const res = await processTransaction({
        studentId: selectedStudent,
        amount: parseFloat(amount),
        type,
      });

      if (res?.error) {
        setTxMessage({ text: res.error, type: "error" });
      } else {
        setTxMessage({
          text: `Successfully processed ${type} of $${amount}`,
          type: "success",
        });
        setAmount("");
        loadData(); // Refresh transaction list
      }
    } catch (err) {
      setTxMessage({ text: "Transaction failed", type: "error" });
    }
  }

  async function handleSimulateWall(e: React.FormEvent) {
    e.preventDefault();
    setTestMessage({ text: "Testing access...", type: "info" });

    if (!testStudentId) {
      setTestMessage({
        text: "Please enter a Student ID to test",
        type: "error",
      });
      return;
    }

    try {
      const res = await testChineseWallAccess(testStudentId);
      if (res?.error) {
        setTestMessage({ text: res.error, type: "error" });
      } else {
        setTestMessage({
          text: `SUCCESS: Accessed data for Student: ${res.data}`,
          type: "success",
        });
      }
    } catch (err) {
      setTestMessage({
        text: "Test failed due to an unexpected error",
        type: "error",
      });
    }
  }

  if (loading)
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
            <div className="badge badge-success">Bank Session</div>
            <span style={{ fontWeight: 600 }}>{data?.bank?.name} Bank</span>
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
          Bank Dashboard
        </h1>

        {error && <div className="badge badge-error mb-6">{error}</div>}

        <div
          className="flex gap-6 flex-col lg:flex-row"
          style={{ flexDirection: "row" }}
        >
          {/* Left Column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              className="glass-card animate-fade-in"
              style={{ padding: "2rem" }}
            >
              <h2
                className="mb-6 border-b pb-2"
                style={{ borderColor: "var(--glass-border)" }}
              >
                Your Assigned Students
              </h2>
              {data?.students.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>
                  No students assigned to this bank.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {data?.students.map((student: any) => (
                    <div
                      key={student.id}
                      className="glass-panel flex justify-between items-center"
                      style={{ padding: "1rem" }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                          {student.username}
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                          ID: {student.id}
                        </div>
                      </div>
                      <div className="badge badge-success">Assigned</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="glass-card animate-fade-in"
              style={{ padding: "2rem", animationDelay: "0.1s" }}
            >
              <h2
                className="mb-6 border-b pb-2"
                style={{ borderColor: "var(--glass-border)" }}
              >
                Process Transaction
              </h2>

              {txMessage.text && (
                <div
                  className={`badge mb-4 ${txMessage.type === "error" ? "badge-error" : txMessage.type === "success" ? "badge-success" : "badge-warning"}`}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    whiteSpace: "normal",
                    textAlign: "center",
                  }}
                >
                  {txMessage.text}
                </div>
              )}

              <form onSubmit={handleTransaction}>
                <div className="form-group">
                  <label className="form-label">Select Student</label>
                  <select
                    className="form-select"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a student --</option>
                    {data?.students.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.username} ({student.id.substring(0, 8)}...)
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="flex gap-4 mb-6"
                  style={{ flexDirection: "row" }}
                >
                  <div
                    className="form-group"
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                    >
                      <option value="loan">Student Loan</option>
                      <option value="allowance">Monthly Allowance</option>
                    </select>
                  </div>
                  <div
                    className="form-group"
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <label className="form-label">Amount ($)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      className="form-input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 500.00"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  Process Secure Transaction
                </button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              className="glass-card animate-fade-in"
              style={{
                padding: "2rem",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                animationDelay: "0.2s",
              }}
            >
              <h2
                className="mb-2"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span style={{ color: "#ef4444" }}>⚠️</span>
                Test Chinese Wall Constraint
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                }}
              >
                Attempt to access a student's data using their explicit ID. If
                they are assigned to another bank, the Chinese Wall policy will
                block the request and log an access violation.
              </p>

              {testMessage.text && (
                <div
                  className={`badge mb-4 ${testMessage.type === "error" ? "badge-error" : testMessage.type === "success" ? "badge-success" : "badge-warning"}`}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    whiteSpace: "normal",
                    textAlign: "center",
                  }}
                >
                  {testMessage.text}
                </div>
              )}

              <form onSubmit={handleSimulateWall}>
                <div className="form-group">
                  <label className="form-label">Student ID (UUID)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={testStudentId}
                    onChange={(e) => setTestStudentId(e.target.value)}
                    placeholder="Enter Student ID to attempt access..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{
                    width: "100%",
                    color: "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                  }}
                >
                  Force Access Attempt
                </button>
              </form>
            </div>

            <div
              className="glass-card animate-fade-in"
              style={{ padding: "2rem", animationDelay: "0.3s" }}
            >
              <h2
                className="mb-6 border-b pb-2"
                style={{ borderColor: "var(--glass-border)" }}
              >
                Recent Transactions
              </h2>

              {data?.recentTransactions.length === 0 ? (
                <p style={{ color: "#64748b" }}>No transactions recorded.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {data?.recentTransactions.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="glass-panel"
                      style={{
                        padding: "1rem",
                        background: "rgba(0,0,0,0.02)",
                      }}
                    >
                      <div className="flex justify-between mb-2">
                        <span style={{ fontWeight: 600 }}>
                          {tx.student.username}
                        </span>
                        <span style={{ color: "#34d399", fontWeight: "bold" }}>
                          ${tx.amount.toFixed(2)}
                        </span>
                      </div>
                      <div
                        className="flex justify-between"
                        style={{ fontSize: "0.8rem", color: "#64748b" }}
                      >
                        <span style={{ textTransform: "capitalize" }}>
                          {tx.type}
                        </span>
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

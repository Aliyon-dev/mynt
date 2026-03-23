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
      return;
    }

    const res = await processTransaction({
      studentId: selectedStudent,
      amount: parseFloat(amount),
      type,
    });

    if (res?.error) {
      setTxMessage({ text: res.error, type: "error" });
      return;
    }

    setTxMessage({ text: `Successfully processed ${type} of $${amount}`, type: "success" });
    setAmount("");
    loadData();
  }

  async function handleAddLoan(e: React.FormEvent) {
    e.preventDefault();
    setLoanMessage({ text: "Saving loan...", type: "info" });

    if (!selectedStudent || !loanAmount) {
      setLoanMessage({ text: "Select a student and amount", type: "error" });
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
      return;
    }

    setLoanMessage({ text: "Loan added and visible to student", type: "success" });
    setLoanAmount("");
    setLoanDescription("");
    loadData();
  }

  async function handleSimulateWall(e: React.FormEvent) {
    e.preventDefault();
    const res = await testChineseWallAccess(testStudentId);

    if (res?.error) {
      setTestMessage({ text: res.error, type: "error" });
      return;
    }

    setTestMessage({ text: `SUCCESS: Accessed ${res.data}`, type: "success" });
  }

  if (loading) return <div className="page-shell centered">Loading...</div>;

  return (
    <div className="page-shell">
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">$</div>
            Mynt Financial
          </div>
          <div className="session-area">
            <span className="badge badge-success">Bank</span>
            <strong>{data?.bank?.name}</strong>
            <button
              onClick={async () => {
                const res = await logout();
                if (res?.redirect) router.push(res.redirect);
              }}
              className="btn btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <h1 className="heading-xl">Bank Operations Dashboard</h1>
        <p className="subtitle">View your assigned students, issue loans, and validate Chinese Wall boundaries.</p>

        {error && <div className="badge badge-error block-message">{error}</div>}

        <section className="dashboard-grid top-metrics">
          <div className="metric-card"><p>Assigned Students</p><h3>{data?.students?.length || 0}</h3></div>
          <div className="metric-card"><p>Recent Loans</p><h3>{data?.recentLoans?.length || 0}</h3></div>
          <div className="metric-card"><p>Transactions</p><h3>{data?.recentTransactions?.length || 0}</h3></div>
        </section>

        <section className="dashboard-grid two-col">
          <div className="glass-card">
            <h2>Students under this bank</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>ID</th>
                    <th>Latest Loan</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students?.map((student: any) => (
                    <tr key={student.id}>
                      <td>{student.username}</td>
                      <td className="mono-cell">{student.id.slice(0, 10)}...</td>
                      <td>{student.loans?.[0]?.status || "No loans"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card">
            <h2>Create Loan</h2>
            {loanMessage.text && (
              <div className={`badge block-message ${loanMessage.type === "error" ? "badge-error" : loanMessage.type === "success" ? "badge-success" : "badge-warning"}`}>
                {loanMessage.text}
              </div>
            )}
            <form onSubmit={handleAddLoan}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <select className="form-select" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                  <option value="">Choose student</option>
                  {data?.students?.map((student: any) => (
                    <option key={student.id} value={student.id}>{student.username}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Loan Amount</label>
                <input type="number" min="1" step="0.01" className="form-input" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={loanDescription} onChange={(e) => setLoanDescription(e.target.value)} placeholder="Tuition support" />
              </div>
              <button className="btn btn-primary full-width" type="submit">Add Loan</button>
            </form>
          </div>
        </section>

        <section className="dashboard-grid two-col">
          <div className="glass-card">
            <h2>Process Transaction</h2>
            {txMessage.text && (
              <div className={`badge block-message ${txMessage.type === "error" ? "badge-error" : txMessage.type === "success" ? "badge-success" : "badge-warning"}`}>
                {txMessage.text}
              </div>
            )}
            <form onSubmit={handleTransaction}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <select className="form-select" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
                  <option value="">Choose student</option>
                  {data?.students?.map((student: any) => (
                    <option key={student.id} value={student.id}>{student.username}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value as "loan" | "allowance")}>
                    <option value="loan">Loan Transfer</option>
                    <option value="allowance">Allowance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount</label>
                  <input type="number" min="1" step="0.01" className="form-input" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary full-width">Process Transaction</button>
            </form>
          </div>

          <div className="glass-card danger-card">
            <h2>Chinese Wall Test</h2>
            {testMessage.text && (
              <div className={`badge block-message ${testMessage.type === "error" ? "badge-error" : "badge-success"}`}>
                {testMessage.text}
              </div>
            )}
            <form onSubmit={handleSimulateWall}>
              <div className="form-group">
                <label className="form-label">Student ID to force-check</label>
                <input className="form-input" value={testStudentId} onChange={(e) => setTestStudentId(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-secondary full-width">Run Wall Test</button>
            </form>
            <h3 className="panel-heading">Recent loans</h3>
            <ul className="clean-list">
              {data?.recentLoans?.map((loan: any) => (
                <li key={loan.id}>{loan.student.username} — ${loan.amount.toFixed(2)} ({loan.status})</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

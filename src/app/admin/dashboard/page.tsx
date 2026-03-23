"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAdminDashboardData,
  logout,
  addBank,
  addStudent,
  assignStudentBank,
} from "@/actions";

const tabs = ["overview", "students", "loans", "logs", "registration"] as const;
type Tab = (typeof tabs)[number];

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
    return <div className="page-shell centered">Loading...</div>;
  }

  return (
    <div className="page-shell">
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">$</div>
            Mynt Financial
          </div>
          <div className="session-area">
            <span className="badge badge-info">Admin</span>
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
        <h1 className="heading-xl">Chinese Wall Control Center</h1>
        <p className="subtitle">Manage banks, students, assignments, and security audit trails.</p>

        {error && <div className="badge badge-error block-message">{error}</div>}

        <section className="dashboard-grid top-metrics">
          <div className="metric-card">
            <p>Total Banks</p>
            <h3>{data?.banks?.length || 0}</h3>
          </div>
          <div className="metric-card">
            <p>Total Students</p>
            <h3>{data?.students?.length || 0}</h3>
          </div>
          <div className="metric-card">
            <p>Loans Issued</p>
            <h3>{data?.loans?.length || 0}</h3>
          </div>
          <div className="metric-card">
            <p>Policy Violations</p>
            <h3>{data?.logs?.filter((log: any) => log.status === "Blocked").length || 0}</h3>
          </div>
        </section>

        <div className="tab-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <section className="glass-card">
            <h2>Assignments at a glance</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Assigned Bank</th>
                    <th>Total Loans</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students?.map((student: any) => (
                    <tr key={student.id}>
                      <td>{student.username}</td>
                      <td>{student.bankIdRelation?.name || "Unassigned"}</td>
                      <td>{data?.loans?.filter((loan: any) => loan.studentId === student.id).length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "students" && (
          <section className="dashboard-grid two-col">
            <div className="glass-card">
              <h2>Students</h2>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                      <th>Bank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.students?.map((student: any) => (
                      <tr key={student.id}>
                        <td>{student.username}</td>
                        <td className="mono-cell">{student.id.slice(0, 10)}...</td>
                        <td>{student.bankIdRelation?.name || "Unassigned"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card">
              <h2>Assign Student to Bank</h2>
              {assignMsg && (
                <div className={`badge block-message ${assignMsg.startsWith("Error") ? "badge-error" : "badge-success"}`}>
                  {assignMsg}
                </div>
              )}
              <form onSubmit={(e) => submitFormAction(e, assignStudentBank, setAssignMsg)}>
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select name="studentId" className="form-select" required>
                    <option value="">Choose student</option>
                    {data?.students?.map((student: any) => (
                      <option key={student.id} value={student.id}>
                        {student.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Bank</label>
                  <select name="bankId" className="form-select" required>
                    <option value="">Choose bank</option>
                    {data?.banks?.map((bank: any) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary full-width">
                  Assign
                </button>
              </form>
            </div>
          </section>
        )}

        {activeTab === "loans" && (
          <section className="glass-card">
            <h2>All loans in system</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Created</th>
                    <th>Student</th>
                    <th>Bank</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.loans?.map((loan: any) => (
                    <tr key={loan.id}>
                      <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                      <td>{loan.student.username}</td>
                      <td>{loan.bank.name}</td>
                      <td>${loan.amount.toFixed(2)}</td>
                      <td>{loan.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "logs" && (
          <section className="glass-card">
            <h2>Chinese Wall audit logs</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.logs?.map((log: any) => (
                    <tr key={log.id}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.user.username}</td>
                      <td>{log.action}</td>
                      <td>
                        <span className={`badge ${log.status === "Allowed" ? "badge-success" : "badge-error"}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "registration" && (
          <section className="dashboard-grid two-col">
            <div className="glass-card">
              <h2>Create bank</h2>
              {bankRegMsg && (
                <div className={`badge block-message ${bankRegMsg.startsWith("Error") ? "badge-error" : "badge-success"}`}>
                  {bankRegMsg}
                </div>
              )}
              <form onSubmit={(e) => submitFormAction(e, addBank, setBankRegMsg)}>
                <div className="form-group">
                  <label className="form-label">Bank name</label>
                  <input name="bankName" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Bank admin username</label>
                  <input name="username" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-input" required />
                </div>
                <button type="submit" className="btn btn-primary full-width">
                  Create bank
                </button>
              </form>
            </div>

            <div className="glass-card">
              <h2>Create student</h2>
              {studentRegMsg && (
                <div className={`badge block-message ${studentRegMsg.startsWith("Error") ? "badge-error" : "badge-success"}`}>
                  {studentRegMsg}
                </div>
              )}
              <form onSubmit={(e) => submitFormAction(e, addStudent, setStudentRegMsg)}>
                <div className="form-group">
                  <label className="form-label">Student username</label>
                  <input name="username" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input type="password" name="password" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign bank</label>
                  <select name="bankId" className="form-select" required>
                    <option value="">Choose bank</option>
                    {data?.banks?.map((bank: any) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary full-width">
                  Create student
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

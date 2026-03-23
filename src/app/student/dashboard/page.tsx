"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions";
import { getStudentDashboardData } from "@/actions/student";

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await getStudentDashboardData();
        setData(dashboardData);
      } catch (err: any) {
        if (err.message === "Unauthorized") router.push("/");
        setError("Failed to load student dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

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
            <span className="badge badge-success">Student</span>
            <strong>{data?.username}</strong>
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
        <h1 className="heading-xl">Student Loan Portal</h1>
        <p className="subtitle">Track your assigned bank and loan status in real time.</p>

        {error && <div className="badge badge-error block-message">{error}</div>}

        <section className="dashboard-grid top-metrics">
          <div className="metric-card"><p>Assigned Bank</p><h3>{data?.bankIdRelation?.name || "Pending"}</h3></div>
          <div className="metric-card"><p>Total Loans</p><h3>{data?.loans?.length || 0}</h3></div>
          <div className="metric-card"><p>Approved Loans</p><h3>{data?.loans?.filter((loan: any) => loan.status === "Approved").length || 0}</h3></div>
        </section>

        <section className="dashboard-grid two-col">
          <div className="glass-card">
            <h2>Loan status</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Bank</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.loans?.length ? (
                    data.loans.map((loan: any) => (
                      <tr key={loan.id}>
                        <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                        <td>{loan.bank.name}</td>
                        <td>${loan.amount.toFixed(2)}</td>
                        <td>{loan.status}</td>
                        <td>{loan.description || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5}>No loans yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card">
            <h2>Transaction history</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Bank</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.transactions?.length ? (
                    data.transactions.map((tx: any) => (
                      <tr key={tx.id}>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td>{tx.type}</td>
                        <td>{tx.bank.name}</td>
                        <td>${tx.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4}>No transactions recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

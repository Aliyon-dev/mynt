"use client";

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
            <div className="badge badge-success">Student Session</div>
            <span style={{ fontWeight: 600 }}>{data?.username}</span>
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
          Student Portal
        </h1>

        {error && <div className="badge badge-error mb-6">{error}</div>}

        <div className="glass-card mb-8">
          <h2 className="mb-2 border-b pb-2" style={{ borderColor: "var(--glass-border)", fontSize: "1.25rem" }}>
            Your Assigned Bank
          </h2>
          <p style={{ color: "#64748b", marginBottom: "2rem", maxWidth: "600px", fontSize: "0.9rem" }}>
            Per the university Chinese Wall policy, your financial records are
            maintained exclusively by this bank and are completely isolated from
            other banks.
          </p>

          <div
            className="glass-panel"
            style={{ display: "inline-block", padding: "1.5rem 2rem" }}
          >
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {data?.bankIdRelation?.name || "Unassigned"} Bank
            </span>
          </div>
        </div>

        <div className="glass-card mb-8">
          <h2 className="mb-6 border-b pb-2" style={{ borderColor: "var(--glass-border)", fontSize: "1.25rem" }}>
            Your Transaction History
          </h2>

          {data?.transactions?.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No transactions recorded.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
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
                  {data?.transactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.date).toLocaleDateString()}</td>
                      <td style={{ textTransform: "capitalize" }}>{tx.type}</td>
                      <td>{tx.bank.name}</td>
                      <td style={{ color: "#34d399", fontWeight: "bold" }}>
                        ${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

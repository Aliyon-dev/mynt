"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.redirect) {
        router.push(result.redirect);
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card animate-fade-in">
        <div className="text-center mb-8">
          <div className="logo" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
            <div className="logo-icon">$</div>
            <span style={{ fontSize: "1.5rem" }}>Mynt Financial</span>
          </div>
          <h1 className="text-gradient">Secure Portal Access</h1>
          <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
            Login to access your dashboard
          </p>
        </div>

        {error && <div className="badge badge-error mb-6" style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: "2.5rem", color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.6" }}>
          Demo Credentials:<br />
          Admin: absa_admin | password123<br />
          Bank: absa | password123<br />
          Student: student1 | password123
        </div>
      </div>
    </div>
  );
}

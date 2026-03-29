import { useEffect, useState } from "react";
import axios from "axios";

export default function ScanLogs({ token }) {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    axios.get("/api/scan-logs", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setLogs(data.logs))
      .catch(err => setError(err.response?.data?.error || "Failed"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error)   return <div className="error-msg">{error}</div>;

  return (
    <div className="logs-wrap">
      <h2 className="section-title">Scan History</h2>
      <p className="hint-text">{logs.length} scans recorded</p>
      {logs.length === 0 ? <div className="dashboard-empty"><p>No scans yet</p></div> : (
        <div className="logs-table-wrap">
          <table className="logs-table">
            <thead><tr><th>Product</th><th>User</th><th>Role</th><th>Time</th></tr></thead>
            <tbody>
              {logs.map((log,i) => (
                <tr key={i}>
                  <td><code>{log.productId}</code></td>
                  <td>{log.userId?.name}<br/><small>{log.userId?.email}</small></td>
                  <td><span className={`role-badge role-${log.role}`}>{log.role}</span></td>
                  <td>{new Date(log.scannedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

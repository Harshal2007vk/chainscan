import { useState, useEffect } from "react";
import Login     from "./components/Login";
import Scanner   from "./components/Scanner";
import Dashboard from "./components/Dashboard";
import ScanLogs  from "./components/ScanLogs";
import "./App.css";

export default function App() {
  const [user,   setUser]   = useState(null);
  const [token,  setToken]  = useState(null);
  const [result, setResult] = useState(null);
  const [page,   setPage]   = useState("scan");

  useEffect(() => {
    const u = localStorage.getItem("qr_user");
    const t = localStorage.getItem("qr_token");
    if (u && t) { setUser(JSON.parse(u)); setToken(t); }
  }, []);

  const handleLogin = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem("qr_user", JSON.stringify(u));
    localStorage.setItem("qr_token", t);
  };

  const handleLogout = () => {
    setUser(null); setToken(null); setResult(null);
    localStorage.removeItem("qr_user");
    localStorage.removeItem("qr_token");
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="app">
      <header className="header">
        <span className="logo">⬡ ChainScan</span>
        <nav className="nav">
          <button className={page==="scan"?"nav-btn active":"nav-btn"}
            onClick={()=>{ setPage("scan"); setResult(null); }}>Scan QR</button>
          {user.role === "supplier" &&
            <button className={page==="logs"?"nav-btn active":"nav-btn"}
              onClick={()=>setPage("logs")}>Scan Logs</button>}
        </nav>
        <div className="header-right">
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
          <span className="user-name">{user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main">
        {page === "scan" && (
          <div className="scan-layout">
            <div><Scanner token={token} onResult={setResult} /></div>
            <div><Dashboard role={user.role} result={result} /></div>
          </div>
        )}
        {page === "logs" && user.role === "supplier" && <ScanLogs token={token} />}
      </main>
    </div>
  );
}

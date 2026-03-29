import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [mode, setMode]     = useState("login");
  const [form, setForm]     = useState({ name:"", email:"", password:"", role:"customer" });
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError(""); setLoad(true);
    try {
      const url  = mode==="login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode==="login" ? { email: form.email, password: form.password } : form;
      const { data } = await axios.post(url, body);
      onLogin(data.user, data.token);
    } catch(err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally { setLoad(false); }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">⬡</div>
        <h1 className="login-title">ChainScan</h1>
        <p className="login-sub">Multi-role QR Blockchain System</p>

        <div className="tab-row">
          <button className={mode==="login"?"tab active":"tab"} onClick={()=>setMode("login")}>Login</button>
          <button className={mode==="register"?"tab active":"tab"} onClick={()=>setMode("register")}>Register</button>
        </div>

        {mode==="register" && <input className="input" name="name" placeholder="Full name" value={form.name} onChange={handle}/>}
        <input className="input" name="email" placeholder="Email" type="email" value={form.email} onChange={handle}/>
        <input className="input" name="password" placeholder="Password" type="password" value={form.password} onChange={handle}/>
        {mode==="register" && (
          <select className="input" name="role" value={form.role} onChange={handle}>
            <option value="customer">Customer</option>
            <option value="wholesaler">Wholesaler</option>
            <option value="supplier">Supplier</option>
          </select>
        )}

        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : mode==="login" ? "Login" : "Create account"}
        </button>

        <div className="demo-hint">
          <p>Demo accounts:</p>
          <code>supplier@demo.com / demo1234</code><br/>
          <code>wholesaler@demo.com / demo1234</code><br/>
          <code>customer@demo.com / demo1234</code>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import axios from "axios";

export default function Scanner({ token, onResult }) {
  const videoRef  = useRef(null);
  const readerRef = useRef(null);
  const [mode,    setMode]   = useState("camera");
  const [manual,  setManual] = useState("");
  const [status,  setStatus] = useState("idle");
  const [err,     setErr]    = useState("");
  const [genId,   setGenId]  = useState("");
  const [genQR,   setGenQR]  = useState(null);

  const fetchProduct = useCallback(async (productId) => {
    setStatus("loading"); setErr("");
    try {
      const { data } = await axios.get(`/api/scan/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onResult(data); setStatus("success");
    } catch(e) {
      setErr(e.response?.data?.error || "Scan failed"); setStatus("error");
    }
  }, [token, onResult]);

  useEffect(() => {
    if (mode !== "camera") return;
    setStatus("scanning");
    const reader = new BrowserQRCodeReader();
    readerRef.current = reader;
    reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
      if (result) { fetchProduct(result.getText()); }
    }).catch(e => { setErr("Camera error: " + e.message); setStatus("error"); });
    return () => { try { readerRef.current?.reset?.(); } catch(_){} };
  }, [mode, fetchProduct]);

  const reset = () => { setStatus(mode==="camera"?"scanning":"idle"); setErr(""); onResult(null); setGenQR(null); };

  const handleGenerate = async () => {
    if (!genId) return;
    try {
      const { data } = await axios.post("/api/generate-qr", { productId: genId },
        { headers: { Authorization: `Bearer ${token}` } });
      setGenQR(data.qr);
    } catch(e) { setErr(e.response?.data?.error || "Generate failed"); }
  };

  return (
    <div className="scanner-card">
      <h2 className="section-title">QR Scanner</h2>
      <div className="mode-tabs">
        {["camera","manual","generate"].map(m => (
          <button key={m} className={mode===m?"mode-tab active":"mode-tab"}
            onClick={()=>{ setMode(m); reset(); }}>
            {m==="camera"?"📷 Camera": m==="manual"?"⌨ Manual":"⬡ Generate"}
          </button>
        ))}
      </div>

      {mode === "camera" && (
        <div className="camera-wrap">
          <div className="scan-frame">
            <video ref={videoRef} className="video-feed" muted playsInline />
            {status==="scanning" && <div className="scan-line-wrap"><div className="scan-line"/></div>}
            <div className="corner tl"/><div className="corner tr"/>
            <div className="corner bl"/><div className="corner br"/>
          </div>
          {status==="scanning" && <p className="status-text pulse">Scanning for QR code...</p>}
          {status==="loading"  && <p className="status-text">Verifying on blockchain...</p>}
          {status==="success"  && <div className="status-success"><span>✓ Verified</span><button className="btn-small" onClick={reset}>Scan again</button></div>}
          {status==="error"    && <div className="status-error"><span>{err}</span><button className="btn-small" onClick={reset}>Retry</button></div>}
        </div>
      )}

      {mode === "manual" && (
        <div className="manual-wrap">
          <p className="hint-text">Enter product ID</p>
          <input className="input" placeholder="e.g. PROD-001"
            value={manual} onChange={e=>setManual(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==="Enter" && fetchProduct(manual)}/>
          <button className="btn-primary" onClick={()=>fetchProduct(manual)} disabled={!manual}>
            {status==="loading"?"Verifying...":"Verify Product"}
          </button>
          <div className="demo-ids">
            <p>Demo IDs:</p>
            {["PROD-001","PROD-002"].map(id=>(
              <button key={id} className="chip" onClick={()=>{ setManual(id); fetchProduct(id); }}>{id}</button>
            ))}
          </div>
          {status==="error" && <p className="error-msg">{err}</p>}
        </div>
      )}

      {mode === "generate" && (
        <div className="manual-wrap">
          <p className="hint-text">Generate QR for a product (supplier only)</p>
          <input className="input" placeholder="Product ID e.g. PROD-001"
            value={genId} onChange={e=>setGenId(e.target.value.toUpperCase())}/>
          <button className="btn-primary" onClick={handleGenerate} disabled={!genId}>Generate QR</button>
          {genQR && (
            <div className="qr-output">
              <img src={genQR} alt="QR" className="qr-img"/>
              <a href={genQR} download={`${genId}-QR.png`} className="btn-small">⬇ Download</a>
            </div>
          )}
          {err && <p className="error-msg">{err}</p>}
        </div>
      )}
    </div>
  );
}

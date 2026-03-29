export default function Dashboard({ role, result }) {
  if (!result) return (
    <div className="dashboard-empty">
      <div className="empty-icon">⬡</div>
      <p>Scan a QR code to see product details</p>
      <p className="empty-sub">Role: <span className={`role-badge role-${role}`}>{role}</span></p>
    </div>
  );

  const { data, productId } = result;

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <h2 className="product-name">{data.name}</h2>
          <span className="product-id">#{productId}</span>
        </div>
        {data.verified && (
          <div className="verified-badge"><span>✓</span><span>Blockchain Verified</span></div>
        )}
      </div>
      <div className="role-label">Viewing as: <span className={`role-badge role-${role}`}>{role}</span></div>
      <div className="data-grid">
        {data.origin        && <Row label="Origin"       value={data.origin}/>}
        {data.expiryDate    && <Row label="Expiry"       value={data.expiryDate} accent={expiringSoon(data.expiryDate)}/>}
        {data.temperature   && <Row label="Storage"      value={data.temperature}/>}
        {data.authenticity  && <Row label="Authenticity" value={data.authenticity} green/>}
        {data.batchId       && <Row label="Batch ID"     value={data.batchId}/>}
        {data.shipment      && <Row label="Shipment"     value={data.shipment}/>}
        {data.bulkPrice     && <Row label="Bulk Price"   value={`₹${data.bulkPrice}`}/>}
        {data.scanCount !== undefined && <Row label="Total Scans" value={data.scanCount}/>}
        {data.cost !== undefined && <Row label="Cost Price" value={`₹${data.cost}`}/>}
        {data.manufacturedDate && <Row label="Manufactured" value={data.manufacturedDate}/>}
      </div>
    </div>
  );
}

function Row({ label, value, accent, green }) {
  return (
    <div className="data-row">
      <span className="data-label">{label}</span>
      <span className={`data-value ${accent?"accent":""} ${green?"green":""}`}>{value}</span>
    </div>
  );
}

function expiringSoon(d) {
  const diff = new Date(d) - new Date();
  return diff > 0 && diff < 7*24*60*60*1000;
}

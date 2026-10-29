import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import itemService from "../services/itemService";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date(value));
}

export default function ItemDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(location.state?.notice || "");

  async function loadItem() {
    setLoading(true);
    setError("");
    try {
      const result = await itemService.getItem(id);
      setItem(result.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItem(); }, [id]);

  async function changeStatus() {
    setSaving(true);
    setActionError("");
    try {
      const result = await itemService.updateStatus(id, item.status === "Open" ? "Resolved" : "Open");
      setItem(result.data);
      setNotice(result.message);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem() {
    if (!window.confirm("Delete this report? This action cannot be undone.")) return;
    setSaving(true);
    setActionError("");
    try {
      await itemService.deleteItem(id);
      navigate("/", { replace: true, state: { notice: "Report deleted successfully." } });
    } catch (requestError) {
      setActionError(requestError.message);
      setSaving(false);
    }
  }

  if (loading) return <Loading message="Loading item details..." />;
  if (error) return <section className="content-state"><ErrorMessage message={error} onRetry={loadItem} /><Link className="back-link" to="/">Back to reports</Link></section>;

  return (
    <section className="details-page">
      <Link className="back-link" to="/"><span aria-hidden="true">←</span> Back to all reports</Link>
      {notice && <div className="notice-banner" role="status"><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice("")}>×</button></div>}
      {actionError && <ErrorMessage compact message={actionError} />}
      <article className="details-card">
        <div className="details-topline">
          <div className="details-badges"><span className={`type-badge ${item.type.toLowerCase()}`}>{item.type}</span><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span></div>
          <span className="detail-category">{item.category}</span>
        </div>
        <h1>{item.title}</h1>
        <p className="details-description">{item.description}</p>
        <div className="detail-facts">
          <div className="detail-fact"><span className="fact-icon">⌖</span><div><span>Location</span><strong>{item.location}</strong></div></div>
          <div className="detail-fact"><span className="fact-icon">◷</span><div><span>Date {item.type === "Lost" ? "lost" : "found"}</span><strong>{formatDate(item.date)}</strong></div></div>
          <div className="detail-fact"><span className="fact-icon">◉</span><div><span>Reported by</span><strong>{item.contactName}</strong></div></div>
          <div className="detail-fact"><span className="fact-icon">@</span><div><span>Contact email</span><a href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a></div></div>
        </div>
        <div className="details-actions">
          <button className="button button-primary" onClick={changeStatus} disabled={saving}>{saving ? "Please wait..." : item.status === "Open" ? "Mark as resolved" : "Reopen report"}</button>
          <Link className="button button-secondary" to={`/items/${id}/edit`}>Edit report</Link>
          <button className="button button-danger" onClick={deleteItem} disabled={saving}>Delete</button>
        </div>
        <p className="contact-disclaimer">Contact details are publicly visible on this academic demo. Do not share sensitive personal information.</p>
      </article>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ItemForm from "../components/ItemForm";
import Loading from "../components/Loading";
import itemService from "../services/itemService";

export default function EditItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <Loading message="Loading report..." />;
  if (error) return <section className="content-state"><ErrorMessage message={error} onRetry={loadItem} /><Link className="back-link" to="/">Back to reports</Link></section>;

  return (
    <section className="form-page">
      <Link className="back-link" to={`/items/${id}`}><span aria-hidden="true">←</span> Back to item</Link>
      <div className="page-heading"><span className="eyebrow">UPDATE YOUR REPORT</span><h1>Edit item</h1><p>Make changes to the report details below.</p></div>
      <ItemForm initialItem={item} isEditing />
      <p className="privacy-note">Your contact name and email are visible to other users.</p>
    </section>
  );
}

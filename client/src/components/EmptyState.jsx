import { Link } from "react-router-dom";

export default function EmptyState({ filtered }) {
  return (
    <section className="empty-state">
      <div className="empty-illustration" aria-hidden="true">⌕</div>
      <h2>{filtered ? "No matching items" : "Nothing reported yet"}</h2>
      <p>{filtered ? "Try adjusting your search or filters to find what you need." : "Be the first to report a lost or found item on campus."}</p>
      {filtered ? <Link className="button button-secondary" to="/">Back to all items</Link> : <Link className="button button-primary" to="/report">Report an item</Link>}
    </section>
  );
}

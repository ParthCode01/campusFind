import { Link } from "react-router-dom";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function ItemCard({ item }) {
  return (
    <Link className="item-card" to={`/items/${item._id}`}>
      <div className="item-card-top">
        <span className={`type-badge ${item.type.toLowerCase()}`}>{item.type}</span>
        <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
      <h3>{item.title}</h3>
      <p className="item-description">{item.description}</p>
      <div className="item-meta">
        <span><span aria-hidden="true">◇</span> {item.category}</span>
        <span><span aria-hidden="true">⌖</span> {item.location}</span>
      </div>
      <div className="item-card-bottom">
        <span>{formatDate(item.date)}</span>
        <span className="view-details">View details <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

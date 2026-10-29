import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">PAGE NOT FOUND</span>
      <h1>Looks like this page wandered off.</h1>
      <p>The link may be outdated, or the page may have moved.</p>
      <Link className="button button-primary" to="/">Return to CampusFind</Link>
    </section>
  );
}

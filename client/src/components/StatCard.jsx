export default function StatCard({ label, value, tone, icon }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-topline">
        <span className="stat-label">{label}</span>
        <span className="stat-icon" aria-hidden="true">{icon}</span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-caption">Across the campus community</span>
    </article>
  );
}

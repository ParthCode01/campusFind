const categories = [
  "Electronics",
  "Documents / ID Cards",
  "Bags",
  "Accessories",
  "Books / Stationery",
  "Keys",
  "Other",
];

export default function SearchFilters({ filters, onChange, onClear, hasFilters }) {
  return (
    <section className="filter-panel" aria-label="Search and filter items">
      <label className="search-field">
        <span className="sr-only">Search item titles and descriptions</span>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Search item titles and descriptions..."
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
        />
      </label>
      <div className="filter-controls">
        <label className="select-field">
          <span>Type</span>
          <select value={filters.type} onChange={(event) => onChange("type", event.target.value)}>
            <option value="">All types</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </label>
        <label className="select-field category-filter">
          <span>Category</span>
          <select value={filters.category} onChange={(event) => onChange("category", event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="select-field">
          <span>Status</span>
          <select value={filters.status} onChange={(event) => onChange("status", event.target.value)}>
            <option value="">All statuses</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </label>
        <button className="clear-button" type="button" onClick={onClear} disabled={!hasFilters}>Clear filters</button>
      </div>
    </section>
  );
}

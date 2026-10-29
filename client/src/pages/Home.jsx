import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import ItemCard from "../components/ItemCard";
import Loading from "../components/Loading";
import SearchFilters from "../components/SearchFilters";
import StatCard from "../components/StatCard";
import itemService from "../services/itemService";

const initialFilters = { search: "", type: "", category: "", status: "" };

export default function Home() {
  const location = useLocation();
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");
  const [notice, setNotice] = useState(location.state?.notice || "");
  const [itemsRefresh, setItemsRefresh] = useState(0);

  async function loadStats() {
    setStatsLoading(true);
    setStatsError("");
    try {
      const result = await itemService.getItems();
      setAllItems(result.data);
    } catch (requestError) {
      setStatsError(requestError.message);
    } finally {
      setStatsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    itemService.getItems(query)
      .then((result) => { if (active) setItems(result.data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filters, itemsRefresh]);

  useEffect(() => {
    loadStats();
  }, []);

  const stats = useMemo(() => ({
    total: allItems.length,
    lost: allItems.filter((item) => item.type === "Lost" && item.status === "Open").length,
    found: allItems.filter((item) => item.type === "Found" && item.status === "Open").length,
    resolved: allItems.filter((item) => item.status === "Resolved").length,
  }), [allItems]);

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  const hasFilters = Object.values(filters).some(Boolean);
  const showNotice = Boolean(notice);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS, CONNECTED</span>
          <h1>Lost something?<br /><span>Found something?</span></h1>
          <p>CampusFind brings our community together to reunite lost items with the people who are missing them.</p>
          <a className="hero-link" href="#recent-reports">Explore recent reports <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-card"><span className="hero-card-icon">⌕</span><span className="hero-card-line long" /><span className="hero-card-line" /><span className="hero-card-tag">FOUND IT!</span></div>
          <span className="hero-spark spark-one">✦</span><span className="hero-spark spark-two">✦</span><span className="hero-floating-dot" />
        </div>
      </section>

      {showNotice && <div className="notice-banner" role="status"><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice("")}>×</button></div>}

      <section className="stats-grid" aria-label="CampusFind statistics">
        {statsError && <div className="stats-error"><ErrorMessage compact message={statsError} onRetry={loadStats} /></div>}
        <StatCard label="Total reports" value={statsLoading ? "—" : stats.total} tone="blue" icon="▦" />
        <StatCard label="Open lost" value={statsLoading ? "—" : stats.lost} tone="orange" icon="⌕" />
        <StatCard label="Open found" value={statsLoading ? "—" : stats.found} tone="green" icon="✓" />
        <StatCard label="Resolved" value={statsLoading ? "—" : stats.resolved} tone="purple" icon="↗" />
      </section>

      <section className="reports-section" id="recent-reports">
        <div className="section-heading">
          <div><span className="eyebrow">CAMPUS COMMUNITY</span><h2>Recent reports</h2><p>Browse items reported by students around campus.</p></div>
          <span className="report-count">{loading ? "Loading..." : `${items.length} ${items.length === 1 ? "report" : "reports"}`}</span>
        </div>
        <SearchFilters filters={filters} onChange={handleFilterChange} onClear={clearFilters} hasFilters={hasFilters} />
        {loading ? <Loading message="Finding campus reports..." /> : error ? <ErrorMessage message={error} onRetry={() => setItemsRefresh((current) => current + 1)} /> :
          items.length === 0 ? <EmptyState filtered={hasFilters} /> :
            <div className="items-grid">{items.map((item) => <ItemCard key={item._id} item={item} />)}</div>}
      </section>
    </>
  );
}

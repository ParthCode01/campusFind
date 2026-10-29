import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <NavLink className="brand" to="/" aria-label="CampusFind home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Campus<span className="brand-accent">Find</span></span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/report" className={({ isActive }) => isActive ? "button button-primary nav-report active" : "button button-primary nav-report"}>
            <span aria-hidden="true">+</span> Report an item
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

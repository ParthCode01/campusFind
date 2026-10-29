import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import EditItem from "./pages/EditItem";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import NotFound from "./pages/NotFound";
import ReportItem from "./pages/ReportItem";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>CampusFind</span>
        <span>Made for a more connected campus.</span>
      </footer>
    </>
  );
}

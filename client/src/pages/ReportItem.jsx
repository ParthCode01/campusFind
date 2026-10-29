import { Link } from "react-router-dom";
import ItemForm from "../components/ItemForm";

export default function ReportItem() {
  return (
    <section className="form-page">
      <Link className="back-link" to="/"><span aria-hidden="true">←</span> Back to reports</Link>
      <div className="page-heading"><span className="eyebrow">HELP YOUR COMMUNITY</span><h1>Report an item</h1><p>Share a few details and help reunite an item with its owner.</p></div>
      <ItemForm />
      <p className="privacy-note">Your contact name and email will be visible to other users so they can reach you about the item.</p>
    </section>
  );
}

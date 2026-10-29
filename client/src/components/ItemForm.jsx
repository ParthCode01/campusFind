import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import itemService from "../services/itemService";

const categories = [
  "Electronics",
  "Documents / ID Cards",
  "Bags",
  "Accessories",
  "Books / Stationery",
  "Keys",
  "Other",
];

const fields = {
  title: "",
  description: "",
  category: "",
  type: "Lost",
  location: "",
  date: "",
  contactName: "",
  contactEmail: "",
};

function toDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function validate(values) {
  const errors = {};
  for (const field of Object.keys(fields)) {
    if (!String(values[field] || "").trim()) errors[field] = "This field is required.";
  }
  if (values.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email address.";
  }
  if (values.date && Number.isNaN(Date.parse(values.date))) errors.date = "Enter a valid date.";
  return errors;
}

export default function ItemForm({ initialItem, isEditing = false }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() => ({
    ...fields,
    ...initialItem,
    date: toDateInput(initialItem?.date),
  }));
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setApiError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setApiError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.keys(fields).map((field) => [field, typeof values[field] === "string" ? values[field].trim() : values[field]])
      );
      const result = isEditing
        ? await itemService.updateItem(initialItem._id, payload)
        : await itemService.createItem(payload);
      if (isEditing) {
        navigate(`/items/${result.data._id}`, { replace: true, state: { notice: result.message } });
      } else {
        setValues(fields);
        setSuccess("Your report has been submitted. Taking you back to the dashboard...");
        window.setTimeout(() => navigate("/", { replace: true, state: { notice: result.message } }), 900);
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <div className="form-intro">
        <p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
      </div>
      {apiError && <div className="form-alert error-form" role="alert">{apiError}</div>}
      {success && <div className="form-alert success-form" role="status">{success}</div>}
      <div className="form-grid">
        <label className={`form-field form-span-2${errors.title ? " has-error" : ""}`}>
          <span>Item title <b>*</b></span>
          <input name="title" value={values.title} onChange={handleChange} placeholder="e.g. Blue student ID card" required />
          {errors.title && <small>{errors.title}</small>}
        </label>
        <label className={`form-field form-span-2${errors.description ? " has-error" : ""}`}>
          <span>Description <b>*</b></span>
          <textarea name="description" value={values.description} onChange={handleChange} placeholder="Add details that could help identify the item..." rows="4" required />
          {errors.description && <small>{errors.description}</small>}
        </label>
        <label className={`form-field${errors.category ? " has-error" : ""}`}>
          <span>Category <b>*</b></span>
          <select name="category" value={values.category} onChange={handleChange} required>
            <option value="" disabled>Select a category</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          {errors.category && <small>{errors.category}</small>}
        </label>
        <label className={`form-field${errors.type ? " has-error" : ""}`}>
          <span>Report type <b>*</b></span>
          <select name="type" value={values.type} onChange={handleChange} required>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          {errors.type && <small>{errors.type}</small>}
        </label>
        <label className={`form-field${errors.location ? " has-error" : ""}`}>
          <span>Location <b>*</b></span>
          <input name="location" value={values.location} onChange={handleChange} placeholder="e.g. Main library, floor 2" required />
          {errors.location && <small>{errors.location}</small>}
        </label>
        <label className={`form-field${errors.date ? " has-error" : ""}`}>
          <span>Date <b>*</b></span>
          <input type="date" name="date" value={values.date} onChange={handleChange} required />
          {errors.date && <small>{errors.date}</small>}
        </label>
        <label className={`form-field${errors.contactName ? " has-error" : ""}`}>
          <span>Contact name <b>*</b></span>
          <input name="contactName" value={values.contactName} onChange={handleChange} placeholder="Your name" required />
          {errors.contactName && <small>{errors.contactName}</small>}
        </label>
        <label className={`form-field${errors.contactEmail ? " has-error" : ""}`}>
          <span>Contact email <b>*</b></span>
          <input type="email" name="contactEmail" value={values.contactEmail} onChange={handleChange} placeholder="you@university.edu" required />
          {errors.contactEmail && <small>{errors.contactEmail}</small>}
        </label>
      </div>
      <div className="form-actions">
        <Link className="button button-secondary" to={isEditing && initialItem?._id ? `/items/${initialItem._id}` : "/"}>Cancel</Link>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : isEditing ? "Save changes" : "Submit report"}
        </button>
      </div>
    </form>
  );
}

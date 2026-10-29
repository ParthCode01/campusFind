export default function Loading({ message = "Loading items..." }) {
  return <div className="loading-state" role="status"><span className="spinner" />{message}</div>;
}

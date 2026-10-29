import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Unable to reach the CampusFind API.";
}

async function request(promise) {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

const itemService = {
  getItems: (filters = {}) => request(api.get("/items", { params: filters })),
  getItem: (id) => request(api.get(`/items/${id}`)),
  createItem: (item) => request(api.post("/items", item)),
  updateItem: (id, item) => request(api.put(`/items/${id}`, item)),
  deleteItem: (id) => request(api.delete(`/items/${id}`)),
  updateStatus: (id, status) => request(api.patch(`/items/${id}/status`, { status })),
};

export default itemService;

import axios from "axios";

// Points at the live backend by default — nobody needs to run it locally.
// Override in .env with VITE_API_URL if you ever need to point at a local instance.
const API_URL = import.meta.env.VITE_API_URL || "https://campushive-x3r5.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
});

// Every request automatically gets the logged-in user's token attached,
// if there is one — nobody building a page needs to think about this.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("campushive_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token's expired or invalid, the backend returns 401 — this clears
// the stale token so the app doesn't get stuck thinking someone's logged in
// when they're not. It does not redirect; the page itself should react to
// user being null (see AuthContext) and show a signed-out state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("campushive_token");
      localStorage.removeItem("campushive_user");
    }
    return Promise.reject(error);
  }
);


import { getToken } from "./authService";

export default async function sendRequest(url, method = "GET", payload = null, token = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // if using cookies
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

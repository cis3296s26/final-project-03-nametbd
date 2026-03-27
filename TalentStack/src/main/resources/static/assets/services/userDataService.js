import { apiFetch } from "./apiClient.js";

//after a get/updateProfile() call from frontend, call apiFetch to apiClient

export function getProfile() {
  return apiFetch("/api/profile", { method: "GET" });
}

export function updateProfile(payload) {
  return apiFetch("/api/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

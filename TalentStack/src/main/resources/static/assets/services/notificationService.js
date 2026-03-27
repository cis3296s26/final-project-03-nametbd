import { apiFetch } from "./apiClient.js";

//after a fetch notifications call, call the api client

export function fetchNotifications() {
  return apiFetch("/api/notifications", { method: "GET" });
}

export function dismissNotification(notificationId) {
  return apiFetch(`/api/notifications/${notificationId}/dismiss`, { method: "POST" });
}
import { apiFetch } from "./apiClient.js";

//Based on the specific function from apiclient, call the backend and attach the payload
//notifications not implemented

export function signup(payload) {
  return apiFetch("/api/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return apiFetch("/api/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiFetch("/api/logout", {
    method: "POST",
  });
}

export function me() {
  return apiFetch("/api/me", { method: "GET" });
}
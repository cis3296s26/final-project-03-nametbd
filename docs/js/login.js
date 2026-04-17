import { apiRequest } from "./api.js";

document.querySelector("#login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  try {
    await apiRequest("/api/login", {
        method: "POST",
        body: { email, password }
    });

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
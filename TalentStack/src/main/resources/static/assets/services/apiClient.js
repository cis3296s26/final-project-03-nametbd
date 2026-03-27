const API_BASE = "";

//Call the authservice with the specific request and pass back requests to the frontend

 export async function apiFetch(path, options = {}) {
   const res = await fetch(`${API_BASE}${path}`, {
     ...options,
     headers: {
       "Content-Type": "application/json",
       ...(options.headers || {}),
     },
     credentials: "include",
   });

   const isJson = res.headers.get("content-type")?.includes("application/json");
   const body = isJson ? await res.json().catch(() => null) : null;

   if (!res.ok) {
     const msg = body?.error || body?.message || `Request failed: ${res.status}`;
     const err = new Error(msg);
     err.status = res.status;
     err.body = body;
     throw err;
   }

   return body;
 }
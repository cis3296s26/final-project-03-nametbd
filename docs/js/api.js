const API_BASE = "";

async function apiRequest(path, options = {}) {
    const response = await fetch('${API_BASE}${path}', {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    let data = null;
    const contentType = resoponse.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await response.json();
    }

    if (!response.ok) {
        const message = data?.error || `Request failed: ${response.status}`;
        throw new Error(message);
    }

    return data;
}

export { apiRequest }
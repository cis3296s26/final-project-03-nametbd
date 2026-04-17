(function () {
    const API_BASE = "http://100.82.242.119:8080";

    async function request(path, options = {}) {
        const response = await fetch(`${API_BASE}${path}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            credentials: 'include',
            body: options.body
        });

        let data = null;
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            data = await response.json();
        }

        if (!response.ok) {
            throw new Error(data?.error || `Request failed: ${response.status}`);
        }

        return data;
    }

    window.ApiClient = {
        request
    };
})();
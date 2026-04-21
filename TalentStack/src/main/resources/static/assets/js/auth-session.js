//Session-aware API client. This file centralizes fetch requests, cookie-based auth, JSON parsing, 401 handling, and page redirects for protected routes.

(function () {
        
    //Redirect targets and route allowlist used by the auth/session guard.
    const LOGIN_ROUTE = '/assets/pages/login.html';
    const DASHBOARD_ROUTE = '/assets/pages/dashboard.html';
    const PUBLIC_PATHS = new Set([
            '/assets/pages/login.html',
            '/assets/pages/register.html'
    ]);

    //Unified fetch wrapper: adds default headers, includes cookies, parses JSON, and throws friendly errors.
    async function request(url, options = {}) {
        const headers = {
            ...(options.headers || {})
        };

        const isFormData = options.body instanceof FormData;

        if (!isFormData && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            //tells browser to include cookies with request for session authentication
            credentials: 'include',
            ...options,
            headers
        });

        //read content-type header. if not present use an empty string
        const contentType = response.headers.get('content-type') || '';
        //check if the response contains json
        const hasJsonBody = contentType.includes('application/json');
        //if the response is json, parse it with response.json otherwise payload is null
        const payload = hasJsonBody ? await response.json() : null;

        //check if the http response was unsuccessful
        if (!response.ok) {
            //if the status is a 401 error, send a session expired message
            const fallback = response.status === 401
            ? 'Your session has expired. Please log in again.'
            : 'Request failed.';
            //if the status is returned with an error in the payload json body, return the error
            const message = payload?.error || payload?.message || fallback;
            const error = new Error(message);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }
        //return the payload if there is no error
        return payload;
    }

    //Send the browser back to the login page.
    function redirectToLogin() {
        window.location.href = LOGIN_ROUTE;
    }

    //Probe the profile endpoint to confirm the user still has a valid authenticated session.
    async function ensureAuthenticated() {
        try {
            await request('/api/profile', { method: 'GET' });
            return true;
        } catch (error) {
            if (error.status === 401) {
                redirectToLogin();
                return false;
            }
            throw error;
        }
    }

    //Route signed-in users to the dashboard and signed-out users to login.
    async function redirectToDefaultPage() {
        try {
            await request('/api/profile', { method: 'GET' });
            window.location.href = DASHBOARD_ROUTE;
        } catch (error) {
            if (error.status === 401) {
                window.location.href = LOGIN_ROUTE;
                return;
            }
            throw error;
        }
    }

    //Publish the shared client so feature-specific API wrappers can reuse it.
    window.ApiClient = {
        request,
        redirectToLogin,
        ensureAuthenticated,
        redirectToDefaultPage
    };

    //On every protected page load, verify the session unless the path is explicitly public.
    document.addEventListener('DOMContentLoaded', async () => {
        const path = window.location.pathname;
        if (PUBLIC_PATHS.has(path)) {
            return;
        }

        try {
            await ensureAuthenticated();
        } catch (error) {
            if (error.status !== 401) {
                throw error;
            }
        }
    });
})();

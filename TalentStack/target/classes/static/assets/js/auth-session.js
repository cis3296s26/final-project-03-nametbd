(function () {
    //store path for login to redirect here if the session is expired
    const LOGIN_ROUTE = '/assets/pages/login.html';
    const DASHBOARD_ROUTE = '/assets/pages/dashboard.html';
    const PUBLIC_PATHS = new Set([
            '/assets/pages/login.html',
            '/assets/pages/register.html'
        ]);


    //main reusable wrapper function. accepts a url and optional option object
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

function redirectToLogin() {
    window.location.href = LOGIN_ROUTE;
}

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

    //attach the two above functions to the shared client object for the apis to use
    window.ApiClient = {
        request,
        redirectToLogin,
        ensureAuthenticated,
        redirectToDefaultPage
    };
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

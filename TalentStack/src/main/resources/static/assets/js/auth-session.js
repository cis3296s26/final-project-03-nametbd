(function () {
    //store path for login to redirect here if the session is expired
    const LOGIN_ROUTE = '/login';

    //main reusable wrapper function. accepts a url and optional option object
    async function request(url, options = {}) {
        const response = await fetch(url, {
            //tells browser to include cookies with request for session authentication
            credentials: 'include',
            headers: {
                //request body is json
                'Content-Type': 'application/json',
                //merge in extra headers from the caller
                ...(options.headers || {})
            },
            ...options
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
            const message = payload?.error || fallback;
            const error = new Error(message);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }
        //return the payload if there is no error
        return payload;
    }

    //check if the current user has a valid session
    async function ensureAuthenticated() {
        try {
            //try getting the backend endpoint and if it succeeds then the user is logged in and validated
            await request('/api/me', { method: 'GET' });
            return true;
        } catch (error) {
        //if the error is 401 redirect the browser to the login page and flag as not authenticated
        if (error.status === 401) {
            window.location.href = LOGIN_ROUTE;
            return false;
        }
        //if the error is not a 401 rethrow the error so it can be handled
        throw error;
    }
}
    //attach the two above functions to the shared client object for the apis to use
    window.ApiClient = {
        request,
        ensureAuthenticated
    };
})();
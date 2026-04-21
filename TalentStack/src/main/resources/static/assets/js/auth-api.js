//Authentication API wrapper. This file exposes a small shared interface for login, registration, logout, and password changes.

(function () {
    //Authentication API wrapper. Each function below delegates to ApiClient.request() so request formatting, cookies, and shared error handling stay centralized in one place.
    const LOGIN_ENDPOINT = '/api/login';
    const REGISTER_ENDPOINT = '/api/signup';
    const LOGOUT_ENDPOINT = '/api/logout';
    const CHANGE_PASSWORD_ENDPOINT = '/api/password';

    //Return the shared API client after validating that it was loaded first.
    function client() {
        if (!window.ApiClient || typeof window.ApiClient.request !== 'function') {
            throw new Error('ApiClient is not available.');
        }
        return window.ApiClient;
    }

    //POST credentials to the login endpoint.
    async function login(email, password) {
        return client().request(LOGIN_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
    }

    //POST new account data to the signup endpoint.
    async function register(firstName, lastName, email, password) {
        return client().request(REGISTER_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })
        });
    }

    //POST to the logout endpoint so the backend can clear the current session.
    async function logout() {
        return client().request(LOGOUT_ENDPOINT, {
            method: 'POST'
        });
    }

    //POST the current and replacement password to the password-change endpoint.
    async function changePassword(oldPassword, newPassword) {
        return client().request(CHANGE_PASSWORD_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        });
    }

    //Expose a small public API for other page scripts to call.
    window.AuthApi = {
        login,
        register,
        logout,
        changePassword
    };
})();

(function () {
    const LOGIN_ENDPOINT = '/api/login';
    const REGISTER_ENDPOINT = '/api/signup';
    const LOGOUT_ENDPOINT = '/api/logout';
    const CHANGE_PASSWORD_ENDPOINT = '/api/password';

    function client() {
        if (!window.ApiClient || typeof window.ApiClient.request !== 'function') {
            throw new Error('ApiClient is not available.');
        }
        return window.ApiClient;
    }

    async function login(email, password) {
        return client().request(LOGIN_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
    }

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

    async function logout() {
            return client().request(LOGOUT_ENDPOINT, {
                method: 'POST'
            });
    }

    async function changePassword(oldPassword, newPassword) {
        return client().request(CHANGE_PASSWORD_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                oldPassword,
                newPassword
            })
        });
    }

    window.AuthApi = {
        login,
        register,
        logout,
        changePassword
    };
})();

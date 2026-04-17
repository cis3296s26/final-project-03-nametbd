(function () {
    const LOGIN_ENDPOINT = '/api/login';
    const REGISTER_ENDPOINT = '/api/signup';

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

    window.AuthApi = {
        login,
        register
    };
})();
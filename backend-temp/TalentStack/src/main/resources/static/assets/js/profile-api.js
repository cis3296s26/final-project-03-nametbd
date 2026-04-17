(function () {
    ///store path for profile to redirect here for all profile reads/writes
    const PROFILE_ENDPOINT = '/api/profile';

    function client() {
        //validate that client request exists and is a function if not throw an error
        if (!window.ApiClient || typeof window.ApiClient.request !== 'function') {
            throw new Error('ApiClient is not available.');
        }
        //return client that validates through auth-session first
        return window.ApiClient;
    }

    //helper function for endpoint of backend call so that the parsed payload becomes return from getprofile call
    async function getProfile() {
        return client().request(PROFILE_ENDPOINT, { method: 'GET' });
    }

    //helper function for endpoint of backend call so that the parsed payload becomes return from updateprofile call
    async function updateProfile(profile) {
        return client().request(PROFILE_ENDPOINT, {
            method: 'PUT',
            body: JSON.stringify(profile)
        });
    }
    window.ProfileApi = {
        getProfile,
        updateProfile
    };
})();

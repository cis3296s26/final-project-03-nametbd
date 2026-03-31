(function () {
    ///store path for profile to redirect here for all profile reads/writes
    const PROFILE_ENDPOINT = '/api/profile';

    function client() {
        //validate that client request exists and is a function if not throw an error
        if (!window.ApiClient || typeof window.ApiClient.request !== 'function') {
            throw new Error(
                'ApiClient is not available.'
            );
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
    //make prior two functions globally availible
    window.ProfileApi = {
        getProfile,
        updateProfile
    };
})();

async function loadProfile() {
    //get the dom element with id profilestatus for user facing status messages
    const status = document.getElementById('profileStatus');
    try {
        //check ensureauthenticated exists for the client and runs first
        if (window.ApiClient?.ensureAuthenticated) {
            await window.ApiClient.ensureAuthenticated();
        }

        //shows loading profile, calls getprofile and saves values to profile object
        status.textContent = 'Loading profile...';
        const profile = await window.ProfileApi.getProfile();

        //write values from the returned profile object into the input values or empty string to make sure there is no undefined
        document.getElementById('profileEmail').value = profile.email || '';
        document.getElementById('profileFirstName').value = profile.firstName || '';
        document.getElementById('profileLastName').value = profile.lastName || '';

        //if profilecreatedat exists convert it to a localdate/time string otherwise use unavailible
        const createdAtText = profile.createdAt
            ? new Date(profile.createdAt).toLocaleString()
            : 'Unavailable';
        //write createdat value to into input value
        document.getElementById('profileCreatedAt').textContent = createdAtText;

        //change status to profile loaded
        status.textContent = 'Profile loaded.';
    } catch (error) {
        status.textContent = error.message;
    }
}

async function saveProfile() {
    //save profile status from loadprofile to status object
    const status = document.getElementById('profileStatus');

    //build the payload object by reading the form fields and trimming the whitespace
    const payload = {
        email: document.getElementById('profileEmail').value.trim(),
        firstName: document.getElementById('profileFirstName').value.trim(),
        lastName: document.getElementById('profileLastName').value.trim()
    };

    try {
        //show saving profile
        status.textContent = 'Saving profile...';
        //call updateprofile with formatted payload
        await window.ProfileApi.updateProfile(payload);
        //success message
        status.textContent = 'Profile updated successfully.';
    } catch (error) {
        status.textContent = error.message;
    }
}

//attach functions to window so pages can trigger them directly
window.loadProfile = loadProfile;
window.saveProfile = saveProfile;

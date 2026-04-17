(function () {
    function client() {
        //validate that client request exists and is a function if not throw an error
        if (!window.ApiClient || typeof window.ApiClient.request !== 'function') {
            throw new Error('ApiClient is not loaded.');
        }
        //return client that validates through auth-session first
        return window.ApiClient;
    }

    //helper function for endpoint of backend call so that the parsed payload becomes return from getpreferences call
    async function getPreferences() {
        return client().request('/api/jobs/preferences', { method: 'GET' });
    }

    //helper function for endpoint of backend call so that the parsed payload becomes return from savepreferences call
    async function savePreferences(preferences) {
        return client().request('/api/jobs/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }

    //helper function for endpoint of backend call so that the parsed payload becomes return from getdashboardcalls call
    //also starts building search parameters
    async function getDashboardJobs(page = 1, pageSize = 20) {
        const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
        return client().request(`/api/jobs/dashboard?${params.toString()}`, { method: 'GET' });
    }

    //helper function for endpoint of backend call so that the parsed payload becomes return from searchjobs call
    async function searchJobs(payload) {
        return client().request('/api/jobs/search', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    async function getSavedJobs() {
            return client().request('/api/jobs/saved', { method: 'GET' });
        }

        async function saveJob(job) {
            return client().request('/api/jobs/saved', {
                method: 'POST',
                body: JSON.stringify(job)
            });
        }

        async function updateSavedJobStatus(savedJobId, applicationStatus) {
            return client().request(`/api/jobs/saved/${savedJobId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ applicationStatus })
            });
        }

    //make prior functions globally availible
    window.JobsApi = {
        getPreferences,
        savePreferences,
        getDashboardJobs,
        searchJobs,
        getSavedJobs,
        saveJob,
        updateSavedJobStatus
    };
})();
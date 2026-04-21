(function () {
        // DOM getters for the search status, result list, and total count elements.
        const statusEl = () => document.getElementById('jobsSearchStatus');
        const listEl = () => document.getElementById('jobsSearchResults');
        const countEl = () => document.getElementById('jobsSearchCount');

        // Read a trimmed text value from an input by id.
        function value(id) {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        }

    // Read an integer input value and return null instead of NaN for blank/invalid input.
    function intValue(id) {
        const raw = value(id);
        if (!raw) return null;
        const parsed = Number.parseInt(raw, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

// Convert the search form into the preference payload expected by the backend.
function collectPreferencesFromForm() {
    return {
        keyWords: value('jobKeyWords') || null,
        location: value('jobLocation') || null,
        distance: intValue('jobDistance'),
        salaryMin: intValue('jobSalaryMin'),
        salaryMax: intValue('jobSalaryMax'),
        contractType: value('jobContractType') || null,
        maxDaysOld: intValue('jobMaxDaysOld')
    };
}

// Replace the visible result list with the latest set of jobs.
function renderSearchResults(jobs) {
    const list = listEl();
    if (!list) return;

    list.innerHTML = '';
    if (!jobs || jobs.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'No jobs found for this search.';
        list.appendChild(empty);
        return;
    }

jobs.forEach((job) => {
        const item = document.createElement('li');
        const title = document.createElement('a');
        title.href = job.redirectUrl || '#';
        title.target = '_blank';
        title.rel = 'noopener noreferrer';
        title.textContent = `${job.title || 'Untitled role'} — ${job.company || 'Unknown company'}`;

        const details = document.createElement('div');
        details.textContent = [job.location, job.contractType, job.created].filter(Boolean).join(' | ');

        item.appendChild(title);
        item.appendChild(details);
        if (window.SavedJobs) {
            window.SavedJobs.addSaveButton(item, job, 'SEARCH');
        }
    list.appendChild(item);
});
}

// Execute a search request and then update the count/list/status UI.
async function searchAndRender(preferences, statusMessage) {
    const status = statusEl();
    if (status) status.textContent = statusMessage;

    const payload = {
        preferences,
        page: 1,
        pageSize: 20
    };

const response = await window.JobsApi.searchJobs(payload);
if (countEl()) countEl().textContent = String(response.count || 0);
renderSearchResults(response.jobs || []);
if (status) status.textContent = 'Search complete.';
}

// Pre-fill the form using previously saved preferences from the backend.
async function hydratePreferences() {
    try {
        const preferences = await window.JobsApi.getPreferences();
        const map = [
            ['jobKeyWords', preferences.keyWords],
            ['jobLocation', preferences.location],
            ['jobDistance', preferences.distance],
            ['jobSalaryMin', preferences.salaryMin],
            ['jobSalaryMax', preferences.salaryMax],
            ['jobContractType', preferences.contractType],
            ['jobMaxDaysOld', preferences.maxDaysOld]
        ];

    map.forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el && val !== null && val !== undefined) {
                el.value = String(val);
            }
    });
} catch (error) {
if (statusEl()) statusEl().textContent = error.message;
}
}

// Handle the search form submission.
async function onSearchSubmit(event) {
    event.preventDefault();

    try {

        const preferences = collectPreferencesFromForm();
        await searchAndRender(preferences, 'Searching jobs...');

    } catch (error) {
    if (statusEl()) statusEl().textContent = error.message;
}
}

// Persist the current filters so they become the user's default search preferences.
async function onSavePreferencesClick() {
    try {
        const preferences = collectPreferencesFromForm();

        await window.JobsApi.savePreferences(preferences);

        if (statusEl()) {
            statusEl().textContent = 'Preferences saved successfully.';
        }
} catch (error) {
if (statusEl()) {
    statusEl().textContent = error.message;
}
}
}
document.addEventListener('DOMContentLoaded', async () => {
        if (!document.getElementById('jobsSearchForm')) {
            return;
        }

    const saveBtn = document.getElementById('savePreferencesBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', onSavePreferencesClick);
    }

try {
    await window.ApiClient.ensureAuthenticated();
    await hydratePreferences();
    await searchAndRender(collectPreferencesFromForm(), 'Loading jobs...');
    if (window.SavedJobs) {
        await window.SavedJobs.loadAndRenderSavedJobs();
    }
} catch (error) {
if (statusEl()) statusEl().textContent = error.message;
}

const form = document.getElementById('jobsSearchForm');
if (form) {
    form.addEventListener('submit', onSearchSubmit);
}
});
})();

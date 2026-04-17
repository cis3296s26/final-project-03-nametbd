(function () {
    const statusEl = () => document.getElementById('dashboardJobsStatus');
    const listEl = () => document.getElementById('dashboardJobsList');
    const countEl = () => document.getElementById('dashboardJobsCount');

    function renderJobs(jobs) {
        const list = listEl();
        if (!list) return;
        list.innerHTML = '';
        if (!jobs || jobs.length === 0) {
            const empty = document.createElement('li');
            empty.textContent = 'No jobs found for your saved preferences.';
            list.appendChild(empty);
            return;
        }

        jobs.forEach((job) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = job.redirectUrl || '#';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = `${job.title || 'Untitled role'} — ${job.company || 'Unknown company'}`;

            const meta = document.createElement('div');
            meta.textContent = [job.location, job.contractType, job.salaryMin && job.salaryMax ? `$${job.salaryMin}-$${job.salaryMax}` : null]
                .filter(Boolean)
                .join(' | ');

            item.appendChild(link);
            item.appendChild(meta);
            if (window.SavedJobs) {
                window.SavedJobs.addSaveButton(item, job, 'RECOMMENDED');
            }
            list.appendChild(item);
        });
    }

    async function loadDashboardJobs() {
        const status = statusEl();
        try {
            if (status) status.textContent = 'Loading dashboard jobs...';

            await window.ApiClient.ensureAuthenticated();

            const response = await window.JobsApi.getDashboardJobs(1, 20);

            if (countEl()) countEl().textContent = String(response.count || 0);

            renderJobs(response.jobs || []);

            if (window.SavedJobs) {
                await window.SavedJobs.loadAndRenderSavedJobs();
            }
            if (status) status.textContent = 'Dashboard jobs loaded.';
            } catch (error) {
            if (status) status.textContent = error.message;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!window.JobsApi || !window.ApiClient) {
            return;
        }

        if (document.getElementById('dashboardJobsList')) {
            loadDashboardJobs();
        }
    });

    window.loadDashboardJobs = loadDashboardJobs;
})();
(function () {
    const statuses = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

    function savedStatusEl() {
        return document.getElementById('savedJobsStatus');
    }

    function savedListEl() {
        return document.getElementById('savedJobsList');
    }

    function setSavedStatus(message) {
        const el = savedStatusEl();
        if (el) {
            el.textContent = message;
        }
    }

    async function saveJobFromListing(job, source) {
        if (!window.JobsApi || typeof window.JobsApi.saveJob !== 'function') {
            throw new Error('JobsApi is not loaded.');
        }

        const payload = {
            id: job.id || null,
            title: job.title || 'Untitled role',
            company: job.company || null,
            location: job.location || null,
            redirectUrl: job.redirectUrl || null,
            source: source,
            applicationStatus: 'SAVED'
        };

        const saved = await window.JobsApi.saveJob(payload);
        setSavedStatus(`Saved: ${saved.title}`);
        return saved;
    }

    async function loadAndRenderSavedJobs() {
        const list = savedListEl();
        if (!list) {
            return;
        }

        setSavedStatus('Loading saved jobs...');

        const savedJobs = await window.JobsApi.getSavedJobs();
        list.innerHTML = '';

        if (!savedJobs || savedJobs.length === 0) {
            const empty = document.createElement('li');
            empty.textContent = 'No saved jobs yet.';
            list.appendChild(empty);
            setSavedStatus('');
            return;
        }

        savedJobs.forEach((job) => {
            const item = document.createElement('li');

            const heading = document.createElement('div');
            heading.textContent = `${job.title || 'Untitled role'} — ${job.company || 'Unknown company'}`;

            const meta = document.createElement('div');
            meta.textContent = [job.location, job.source].filter(Boolean).join(' | ');

            const statusWrap = document.createElement('label');
            statusWrap.textContent = 'Status: ';

            const select = document.createElement('select');
            statuses.forEach((status) => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (status === job.applicationStatus) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            select.addEventListener('change', async () => {
                try {
                    setSavedStatus('Updating status...');
                    await window.JobsApi.updateSavedJobStatus(job.savedJobId, select.value);
                    setSavedStatus(`Updated status for: ${job.title}`);
                } catch (error) {
                    setSavedStatus(error.message);
                }
            });

            statusWrap.appendChild(select);
            item.appendChild(heading);
            item.appendChild(meta);
            item.appendChild(statusWrap);
            list.appendChild(item);
        });

        setSavedStatus('');
    }

    function addSaveButton(container, job, source) {
        const actionBar = document.createElement('div');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'primary-btn';
        button.textContent = 'Save Job';

        button.addEventListener('click', async () => {
            button.disabled = true;
            try {
                await saveJobFromListing(job, source);
                button.textContent = 'Saved';
                await loadAndRenderSavedJobs();
            } catch (error) {
                setSavedStatus(error.message);
                button.disabled = false;
            }
        });

        actionBar.appendChild(button);
        container.appendChild(actionBar);
    }

    window.SavedJobs = {
        addSaveButton,
        loadAndRenderSavedJobs,
        saveJobFromListing
    };
})();

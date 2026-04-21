(function () {
    const statuses = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

    function savedStatusEl() {
        return document.getElementById('savedJobsStatus');
    }

    function savedListEl() {
        return document.getElementById('savedJobsList');
    }

    function isDashboardSavedJobsView() {
        return Boolean(document.getElementById('dashboardJobsList'));
    }

    function setSavedStatus(message) {
        const el = savedStatusEl();
        if (el) {
            el.textContent = message;
        }
    }

    function formatSalary(job) {
        if (job.salaryMin && job.salaryMax) {
            return `$${job.salaryMin} - $${job.salaryMax}`;
        }

        if (job.salaryMin) {
            return `From $${job.salaryMin}`;
        }

        if (job.salaryMax) {
            return `Up to $${job.salaryMax}`;
        }

        return 'Not listed';
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
            source,
            applicationStatus: 'SAVED'
        };

        const saved = await window.JobsApi.saveJob(payload);
        setSavedStatus(`Saved: ${saved.title}`);
        return saved;
    }

    function createDashboardSavedJobCard(job) {
        const item = document.createElement('article');
        item.className = 'job-card';

        const header = document.createElement('div');
        header.className = 'job-card-header';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'job-card-title-wrap';

        const titleLink = document.createElement('a');
        titleLink.href = job.redirectUrl || '#';
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.className = 'job-card-title';
        titleLink.textContent = job.title || 'Untitled role';

        const company = document.createElement('div');
        company.className = 'job-card-company';
        company.textContent = job.company || 'Unknown company';

        titleWrap.appendChild(titleLink);
        titleWrap.appendChild(company);
        header.appendChild(titleWrap);

        const meta = document.createElement('div');
        meta.className = 'job-card-meta';
        [
            ['Location', job.location || 'Remote / Not listed'],
            ['Job Type', job.source || 'Saved'],
            ['Salary', formatSalary(job)]
        ].forEach(([label, value]) => {
            const metaItem = document.createElement('div');
            metaItem.className = 'job-card-meta-item';
            metaItem.innerHTML = `<span class="job-card-meta-label">${label}</span><span class="job-card-meta-value">${value}</span>`;
            meta.appendChild(metaItem);
        });

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
                document.dispatchEvent(new CustomEvent('savedJobsUpdated'));
            } catch (error) {
                setSavedStatus(error.message);
            }
        });

        statusWrap.appendChild(select);

        const interviewWrap = document.createElement('div');
        interviewWrap.className = 'interview-wrap';

        const interviewInput = document.createElement('input');
        interviewInput.type = 'datetime-local';
        interviewInput.value = job.interviewAt ? new Date(job.interviewAt).toISOString().slice(0, 16) : '';

        const interviewButton = document.createElement('button');
        interviewButton.type = 'button';
        interviewButton.className = 'primary-btn';
        interviewButton.textContent = 'Save Interview';
        interviewButton.addEventListener('click', async () => {
            if (!interviewInput.value) {
                setSavedStatus('Select an interview date/time first.');
                return;
            }
            try {
                setSavedStatus('Saving interview date...');
                await window.JobsApi.updateInterviewDate(job.savedJobId, interviewInput.value);
                setSavedStatus(`Interview date saved for: ${job.title}`);
                document.dispatchEvent(new CustomEvent('savedJobsUpdated'));
            } catch (error) {
                setSavedStatus(error.message);
            }
        });

        interviewWrap.appendChild(interviewInput);
        interviewWrap.appendChild(interviewButton);

        const actions = document.createElement('div');
        actions.className = 'job-card-actions';

        const applyButton = document.createElement('a');
        applyButton.href = job.redirectUrl || '#';
        applyButton.target = '_blank';
        applyButton.rel = 'noopener noreferrer';
        applyButton.className = 'secondary-btn';
        applyButton.textContent = 'Apply';
        actions.appendChild(applyButton);

        const controls = document.createElement('div');
        controls.className = 'job-card-controls';

        const statusRow = document.createElement('div');
        statusRow.className = 'job-card-controls-row';
        statusRow.appendChild(statusWrap);

        const interviewRow = document.createElement('div');
        interviewRow.className = 'job-card-controls-row';
        interviewRow.appendChild(interviewWrap);

        controls.appendChild(actions);
        controls.appendChild(statusRow);
        controls.appendChild(interviewRow);

        item.appendChild(header);
        item.appendChild(meta);
        item.appendChild(controls);
        return item;
    }

    function createDefaultSavedJobItem(job) {
        const item = document.createElement('li');

        const heading = document.createElement('div');
        heading.textContent = `${job.title || 'Untitled role'} - ${job.company || 'Unknown company'}`;

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
                document.dispatchEvent(new CustomEvent('savedJobsUpdated'));
            } catch (error) {
                setSavedStatus(error.message);
            }
        });

        const interviewWrap = document.createElement('div');
        interviewWrap.className = 'interview-wrap';

        const interviewInput = document.createElement('input');
        interviewInput.type = 'datetime-local';
        interviewInput.value = job.interviewAt ? new Date(job.interviewAt).toISOString().slice(0, 16) : '';

        const interviewButton = document.createElement('button');
        interviewButton.type = 'button';
        interviewButton.className = 'primary-btn';
        interviewButton.textContent = 'Save Interview';
        interviewButton.addEventListener('click', async () => {
            if (!interviewInput.value) {
                setSavedStatus('Select an interview date/time first.');
                return;
            }
            try {
                setSavedStatus('Saving interview date...');
                await window.JobsApi.updateInterviewDate(job.savedJobId, interviewInput.value);
                setSavedStatus(`Interview date saved for: ${job.title}`);
                document.dispatchEvent(new CustomEvent('savedJobsUpdated'));
            } catch (error) {
                setSavedStatus(error.message);
            }
        });

        interviewWrap.appendChild(interviewInput);
        interviewWrap.appendChild(interviewButton);

        statusWrap.appendChild(select);
        item.appendChild(heading);
        item.appendChild(meta);
        item.appendChild(statusWrap);
        item.appendChild(interviewWrap);
        return item;
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
            const empty = document.createElement(isDashboardSavedJobsView() ? 'div' : 'li');
            if (isDashboardSavedJobsView()) {
                empty.className = 'job-card-empty';
            }
            empty.textContent = 'No saved jobs yet.';
            list.appendChild(empty);
            setSavedStatus('');
            return;
        }

        savedJobs.forEach((job) => {
            list.appendChild(
                isDashboardSavedJobsView()
                    ? createDashboardSavedJobCard(job)
                    : createDefaultSavedJobItem(job)
            );
        });

        setSavedStatus('');
    }

    function addSaveButton(container, job, source) {
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

        container.appendChild(button);
    }

    window.SavedJobs = {
        addSaveButton,
        loadAndRenderSavedJobs,
        saveJobFromListing
    };
}());

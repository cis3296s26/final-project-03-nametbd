(function () {
    const statusEl = () => document.getElementById('dashboardJobsStatus');
    const listEl = () => document.getElementById('dashboardJobsList');
    const countEl = () => document.getElementById('dashboardJobsCount');
    const prevBtnEl = () => document.getElementById('dashboardPrevBtn');
    const nextBtnEl = () => document.getElementById('dashboardNextBtn');
    const pageLabelEl = () => document.getElementById('dashboardPageLabel');
    const profileNameEl = () => document.getElementById('dashboardProfileName');
    const profileTaglineEl = () => document.getElementById('dashboardProfileTagline');
    const profileAvatarEl = () => document.getElementById('dashboardProfileAvatar');
    const applicationsCountEl = () => document.getElementById('dashboardApplicationsCount');
    const interviewsCountEl = () => document.getElementById('dashboardInterviewsCount');

    let currentPage = 1;
    const pageSize = 10;
    let totalJobsCount = 0;

    function getFullName(profile) {
        return `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Your Profile';
    }

    function getInitials(profile) {
        const fullName = getFullName(profile);
        return fullName
            .split(' ')
            .filter(Boolean)
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'TS';
    }

    function setDashboardAvatar(profile) {
        const avatar = profileAvatarEl();
        if (!avatar) return;

        avatar.innerHTML = '';
        avatar.style.backgroundSize = '';
        avatar.style.backgroundPosition = '';
        avatar.style.backgroundImage = '';
        avatar.textContent = '';

        if (profile?.profilePhotoBase64) {
            avatar.style.backgroundImage = `url(data:image/jpeg;base64,${profile.profilePhotoBase64})`;
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            return;
        }

        avatar.textContent = getInitials(profile);
        avatar.style.display = 'grid';
        avatar.style.placeItems = 'center';
        avatar.style.fontWeight = '700';
    }

    function getApplicationMetrics(savedJobs) {
        const jobs = Array.isArray(savedJobs) ? savedJobs : [];
        const applications = jobs.filter((job) => job.applicationStatus && job.applicationStatus !== 'SAVED').length;
        const interviews = jobs.filter((job) => job.applicationStatus === 'INTERVIEW' || Boolean(job.interviewAt)).length;

        return { applications, interviews };
    }

    async function loadDashboardProfileCard() {
        if (!window.ProfileApi || !window.JobsApi) {
            return;
        }

        const [profile, savedJobs] = await Promise.all([
            window.ProfileApi.getProfile(),
            window.JobsApi.getSavedJobs()
        ]);

        const metrics = getApplicationMetrics(savedJobs);

        if (profileNameEl()) {
            profileNameEl().textContent = getFullName(profile);
        }

        if (profileTaglineEl()) {
            profileTaglineEl().textContent = profile?.tagline || 'Add a tagline to personalize your dashboard.';
        }

        if (applicationsCountEl()) {
            applicationsCountEl().textContent = String(metrics.applications);
        }

        if (interviewsCountEl()) {
            interviewsCountEl().textContent = String(metrics.interviews);
        }

        setDashboardAvatar(profile);
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

    function renderPagination() {
        const totalPages = Math.max(1, Math.ceil(totalJobsCount / pageSize));
        if (pageLabelEl()) {
            pageLabelEl().textContent = `Page ${currentPage} of ${totalPages}`;
        }
        if (prevBtnEl()) {
            prevBtnEl().disabled = currentPage <= 1;
        }
        if (nextBtnEl()) {
            nextBtnEl().disabled = currentPage >= totalPages;
        }
    }

    function renderJobs(jobs) {
        const list = listEl();
        if (!list) return;

        list.innerHTML = '';
        if (!jobs || jobs.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'job-card-empty';
            empty.textContent = 'No jobs found for your saved preferences.';
            list.appendChild(empty);
            renderPagination();
            return;
        }

        jobs.forEach((job) => {
            const item = document.createElement('article');
            item.className = 'job-card';

            const header = document.createElement('div');
            header.className = 'job-card-header';

            const titleWrap = document.createElement('div');
            titleWrap.className = 'job-card-title-wrap';

            const link = document.createElement('a');
            link.href = job.redirectUrl || '#';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'job-card-title';
            link.textContent = job.title || 'Untitled role';

            const company = document.createElement('div');
            company.className = 'job-card-company';
            company.textContent = job.company || 'Unknown company';

            titleWrap.appendChild(link);
            titleWrap.appendChild(company);
            header.appendChild(titleWrap);

            const meta = document.createElement('div');
            meta.className = 'job-card-meta';

            [
                ['Location', job.location || 'Remote / Not listed'],
                ['Job Type', job.contractType || 'Not listed'],
                ['Salary', formatSalary(job)]
            ].forEach(([label, value]) => {
                const metaItem = document.createElement('div');
                metaItem.className = 'job-card-meta-item';
                metaItem.innerHTML = `<span class="job-card-meta-label">${label}</span><span class="job-card-meta-value">${value}</span>`;
                meta.appendChild(metaItem);
            });

            const actions = document.createElement('div');
            actions.className = 'job-card-actions';

            const applyButton = document.createElement('a');
            applyButton.href = job.redirectUrl || '#';
            applyButton.target = '_blank';
            applyButton.rel = 'noopener noreferrer';
            applyButton.className = 'secondary-btn';
            applyButton.textContent = 'Apply';
            actions.appendChild(applyButton);

            item.appendChild(header);
            item.appendChild(meta);
            if (window.SavedJobs) {
                window.SavedJobs.addSaveButton(actions, job, 'RECOMMENDED');
            }
            item.appendChild(actions);
            list.appendChild(item);
        });

        renderPagination();
    }

    async function loadDashboardJobs(page = currentPage) {
        const status = statusEl();
        try {
            if (status) status.textContent = 'Loading dashboard jobs...';

            await window.ApiClient.ensureAuthenticated();
            currentPage = page;
            const [response] = await Promise.all([
                window.JobsApi.getDashboardJobs(currentPage, pageSize),
                loadDashboardProfileCard()
            ]);

            totalJobsCount = Number(response.count || 0);
            if (countEl()) {
                countEl().textContent = String(totalJobsCount);
            }

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

        document.addEventListener('savedJobsUpdated', () => {
            loadDashboardProfileCard().catch((error) => {
                const status = statusEl();
                if (status) {
                    status.textContent = error.message;
                }
            });
        });

        if (document.getElementById('dashboardJobsList')) {
            prevBtnEl()?.addEventListener('click', () => {
                if (currentPage > 1) {
                    loadDashboardJobs(currentPage - 1);
                }
            });

            nextBtnEl()?.addEventListener('click', () => {
                const totalPages = Math.max(1, Math.ceil(totalJobsCount / pageSize));
                if (currentPage < totalPages) {
                    loadDashboardJobs(currentPage + 1);
                }
            });

            loadDashboardJobs();
            return;
        }

        if (document.getElementById('savedJobsList') && window.SavedJobs) {
            window.SavedJobs.loadAndRenderSavedJobs().catch((error) => {
                const savedStatus = document.getElementById('savedJobsStatus');
                if (savedStatus) {
                    savedStatus.textContent = error.message;
                }
            });
        }
    });

    window.loadDashboardJobs = loadDashboardJobs;
}());

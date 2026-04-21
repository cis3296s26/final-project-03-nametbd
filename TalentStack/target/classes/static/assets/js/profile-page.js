document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('displayName')) return;

    const status = document.getElementById('profileStatus');
    let currentProfile = null;
    let currentModal = null;
    let skillDraft = [];

    function setStatus(message, isError = false) {
        if (!status) return;
        status.textContent = message;
        status.style.color = isError ? '#b00020' : '';
    }

    function getInitials(name) {
        if (!name) return 'TS';
        return name
            .split(' ')
            .filter(Boolean)
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }

    function parseSkills(skillsValue) {
        if (!skillsValue || typeof skillsValue !== 'string') return [];
        return skillsValue
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setText(id, value, fallback = 'Not Set') {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = value ?? fallback;
    }

    function setStat(id, value, fallback = '0') {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = value ?? fallback;
    }

    function renderSkills(skillsValue) {
        const skillsGrid = document.getElementById('skillsGrid');
        if (!skillsGrid) return;

        const tags = parseSkills(skillsValue);
        if (!tags.length) {
            skillsGrid.innerHTML = '<span class="skill-tag">No skills added</span>';
            return;
        }

        skillsGrid.innerHTML = tags
            .map((tag) => `<span class="skill-tag">${escapeHtml(tag)}</span>`)
            .join('');
    }

    function renderProfileStrength(profileStrength) {
        const bar = document.getElementById('completionBar');
        const pct = document.getElementById('completionPct');
        const tip = document.getElementById('completionTip');

        const safeStrength = Math.max(0, Math.min(Number(profileStrength) || 0, 100));

        if (bar) {
            bar.style.width = `${safeStrength}%`;
        }

        if (pct) {
            pct.textContent = `${safeStrength}%`;
        }

        if (tip) {
            if (safeStrength >= 85) {
                tip.textContent = 'Strong profile';
            } else if (safeStrength >= 60) {
                tip.textContent = 'Add more details to improve visibility';
            } else {
                tip.textContent = 'Complete your profile to improve matches';
            }
        }
    }

    function renderReadiness() {
        const readiness = [
            { label: 'Behavioral (STAR)', score: 4, max: 5 },
            { label: 'Data Structures', score: 3, max: 5 },
            { label: 'System Design', score: 2, max: 5 },
            { label: 'Communication', score: 5, max: 5 },
            { label: 'Problem Solving', score: 3, max: 5 }
        ];

        const readinessElement = document.getElementById('readinessList');
        if (!readinessElement) return;

        readinessElement.innerHTML = readiness.map((item) => {
            const dots = Array.from({ length: item.max }, (_, index) => (
                `<div class="dot ${index < item.score ? 'filled' : ''}"></div>`
            )).join('');

            const percentage = Math.round((item.score / item.max) * 100);
            return `<div class="readiness-row">
                <span class="readiness-label">${item.label}</span>
                <div class="readiness-score">
                    <div class="score-dots">${dots}</div>
                    <span class="score-val">${percentage}%</span>
                </div>
            </div>`;
        }).join('');
    }

    function setAvatarFromBase64(base64Value, fullName) {
        const avatarImage = document.getElementById('avatarImage');
        const avatarFallback = document.getElementById('avatarFallback');
        if (!avatarImage || !avatarFallback) return;

        if (base64Value) {
            avatarImage.onerror = () => {
                avatarImage.removeAttribute('src');
                avatarImage.classList.remove('is-visible');
                avatarFallback.textContent = getInitials(fullName);
                avatarFallback.style.display = 'grid';
            };
            avatarImage.src = `data:image/jpeg;base64,${base64Value}`;
            avatarImage.classList.add('is-visible');
            avatarFallback.textContent = '';
            avatarFallback.style.display = 'none';
            return;
        }

        avatarImage.onerror = null;
        avatarImage.removeAttribute('src');
        avatarImage.classList.remove('is-visible');
        avatarFallback.textContent = getInitials(fullName);
        avatarFallback.style.display = 'grid';
    }

    function handleResume(eventOrInput) {
        const input = eventOrInput?.target || eventOrInput;
        const file = input?.files && input.files[0];
        if (!file) return;

        const fileName = document.getElementById('fileName');
        const fileMeta = document.getElementById('fileMeta');
        const resumeDrop = document.getElementById('resumeDrop');
        const resumeFile = document.getElementById('resumeFile');

        if (fileName) fileName.textContent = file.name;
        if (fileMeta) fileMeta.textContent = `Uploaded just now - ${(file.size / 1024).toFixed(0)} KB`;
        if (resumeDrop) resumeDrop.style.display = 'none';
        if (resumeFile) resumeFile.style.display = 'flex';
    }

    function removeResume() {
        const resumeInput = document.getElementById('resumeInput');
        const resumeDrop = document.getElementById('resumeDrop');
        const resumeFile = document.getElementById('resumeFile');

        if (resumeInput) resumeInput.value = '';
        if (resumeDrop) resumeDrop.style.display = 'block';
        if (resumeFile) resumeFile.style.display = 'none';
    }

    function getFullName(profile) {
        return `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Not Set';
    }

    function renderProfile(profile) {
        const fullName = getFullName(profile);

        setText('displayEmail', profile.email);
        setText('displayName', fullName);
        setText('displayHeadline', profile.tagline || 'No tagline added', 'No tagline added');
        setText('displayLocation', profile.location || 'Not Set');
        setText('displayAge', profile.age != null ? String(profile.age) : 'Not Set');
        setText('aboutText', profile.about || 'No bio added yet.', 'No bio added yet.');

        renderSkills(profile.skills);
        renderProfileStrength(profile.profileStrength ?? 0);

        const displayCreatedAt = document.getElementById('displayCreatedAt');
        if (displayCreatedAt) {
            displayCreatedAt.textContent = profile.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : 'Unavailable';
        }

        setAvatarFromBase64(profile.profilePhotoBase64, fullName);
    }

    async function renderViewerMetrics() {
        if (!window.JobsApi || typeof window.JobsApi.getSavedJobs !== 'function') {
            return;
        }

        const savedJobs = await window.JobsApi.getSavedJobs();
        const jobs = Array.isArray(savedJobs) ? savedJobs : [];
        const applications = jobs.filter((job) => job.applicationStatus && job.applicationStatus !== 'SAVED').length;
        const interviews = jobs.filter((job) => job.applicationStatus === 'INTERVIEW' || Boolean(job.interviewAt)).length;

        setStat('applicationsCount', applications, '0');
        setStat('interviewsCount', interviews, '0');
    }

    function getProfilePayload(overrides = {}) {
        if (!currentProfile) {
            throw new Error('Profile is not loaded yet.');
        }

        return {
            email: currentProfile.email || '',
            firstName: currentProfile.firstName || '',
            lastName: currentProfile.lastName || '',
            age: currentProfile.age ?? 0,
            location: currentProfile.location || '',
            profileStrength: currentProfile.profileStrength ?? 0,
            about: currentProfile.about || '',
            skills: currentProfile.skills || '',
            tagline: currentProfile.tagline || '',
            applicationsNum: currentProfile.applicationsNum ?? 0,
            interviewsNum: currentProfile.interviewsNum ?? 0,
            ...overrides
        };
    }

    function renderSkillDraft() {
        const list = document.getElementById('skillsModalList');
        if (!list) return;

        if (!skillDraft.length) {
            list.innerHTML = '<span class="skill-tag">No skills added</span>';
            return;
        }

        list.innerHTML = skillDraft.map((skill) => `
            <span class="skill-tag skill-tag-editable">
                <span>${escapeHtml(skill)}</span>
                <button type="button" class="skill-tag-remove" data-skill="${escapeHtml(skill)}" aria-label="Remove ${escapeHtml(skill)}">x</button>
            </span>
        `).join('');

        list.querySelectorAll('.skill-tag-remove').forEach((button) => {
            button.addEventListener('click', () => {
                skillDraft = skillDraft.filter((skill) => skill !== button.dataset.skill);
                renderSkillDraft();
            });
        });
    }

    const modals = {
        about: {
            title: 'Edit Profile',
            html: () => `
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">First Name</label>
                        <input class="form-input" id="f_firstName" value="${escapeHtml(currentProfile?.firstName || '')}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last Name</label>
                        <input class="form-input" id="f_lastName" value="${escapeHtml(currentProfile?.lastName || '')}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tagline</label>
                        <input class="form-input" id="f_tagline" value="${escapeHtml(currentProfile?.tagline || '')}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age</label>
                        <input class="form-input" id="f_age" type="number" min="0" value="${currentProfile?.age ?? ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input class="form-input" id="f_location" value="${escapeHtml(currentProfile?.location || '')}">
                </div>
                <div class="form-group">
                    <label class="form-label">About</label>
                    <textarea class="form-textarea" id="f_about">${escapeHtml(currentProfile?.about || '')}</textarea>
                </div>`,
            bind: () => {},
            save: async () => {
                const firstName = (document.getElementById('f_firstName')?.value || '').trim();
                const lastName = (document.getElementById('f_lastName')?.value || '').trim();
                const tagline = (document.getElementById('f_tagline')?.value || '').trim();
                const location = (document.getElementById('f_location')?.value || '').trim();
                const about = (document.getElementById('f_about')?.value || '').trim();
                const ageValue = (document.getElementById('f_age')?.value || '').trim();

                if (!firstName || !lastName) {
                    throw new Error('First name and last name are required.');
                }

                if (ageValue && Number(ageValue) < 0) {
                    throw new Error('Age must be 0 or greater.');
                }

                const updated = await window.ProfileApi.updateProfile(getProfilePayload({
                    firstName,
                    lastName,
                    tagline,
                    location,
                    about,
                    age: ageValue ? Number(ageValue) : 0
                }));

                currentProfile = updated;
                renderProfile(updated);
            }
        },
        skills: {
            title: 'Edit Skills',
            html: () => `
                <div class="skills-editor">
                    <div class="skills-input-row">
                        <input class="form-input" id="f_skillWord" placeholder="Add one skill">
                        <button type="button" class="btn-primary" id="addSkillBtn">Add</button>
                    </div>
                    <p class="skills-editor-help">Enter one single-word skill at a time.</p>
                    <div class="skills-modal-list" id="skillsModalList"></div>
                </div>`,
            bind: () => {
                skillDraft = parseSkills(currentProfile?.skills || '');
                renderSkillDraft();

                const input = document.getElementById('f_skillWord');
                const addButton = document.getElementById('addSkillBtn');

                const addSkill = () => {
                    const rawValue = (input?.value || '').trim();
                    if (!rawValue) {
                        return;
                    }

                    if (/\s/.test(rawValue)) {
                        setStatus('Enter one single-word skill at a time.', true);
                        return;
                    }

                    if (!skillDraft.includes(rawValue)) {
                        skillDraft = [...skillDraft, rawValue];
                        renderSkillDraft();
                    }

                    if (input) {
                        input.value = '';
                        input.focus();
                    }
                    setStatus('');
                };

                addButton?.addEventListener('click', addSkill);
                input?.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        addSkill();
                    }
                });
            },
            save: async () => {
                const updated = await window.ProfileApi.updateProfile(getProfilePayload({
                    skills: skillDraft.join(', ')
                }));

                currentProfile = updated;
                renderProfile(updated);
            }
        }
    };

    function openModal(key) {
        const modal = modals[key];
        if (!modal) return;

        currentModal = key;

        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        const overlay = document.getElementById('modalOverlay');

        if (title) title.textContent = modal.title;
        if (body) body.innerHTML = modal.html();
        if (modal.bind) modal.bind();
        if (overlay) overlay.classList.add('open');
    }

    function closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.classList.remove('open');
        currentModal = null;
    }

    function closeModalOutside(event) {
        if (event.target === document.getElementById('modalOverlay')) {
            closeModal();
        }
    }

    async function saveModal() {
        if (!currentModal || !modals[currentModal] || !modals[currentModal].save) {
            closeModal();
            return;
        }

        try {
            setStatus('Saving profile...');
            await modals[currentModal].save();
            setStatus('Profile updated.');
            closeModal();
        } catch (error) {
            setStatus(error.message || 'Unable to save profile.', true);
        }
    }

    try {
        await window.ApiClient.ensureAuthenticated();
        const profile = await window.ProfileApi.getProfile();
        currentProfile = profile;
        renderProfile(profile);
        await renderViewerMetrics();
        setStatus('Profile loaded.');
    } catch (error) {
        setStatus(error.message || 'Unable to load profile.', true);
    }

    renderReadiness();

    window.handleResume = handleResume;
    window.removeResume = removeResume;
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.closeModalOutside = closeModalOutside;
    window.saveModal = saveModal;

    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
        openModal('about');
    });

    document.getElementById('editAboutBtn')?.addEventListener('click', () => {
        openModal('about');
    });

    document.getElementById('editSkillsBtn')?.addEventListener('click', () => {
        openModal('skills');
    });

    document.getElementById('closeModalBtn')?.addEventListener('click', () => {
        closeModal();
    });

    document.getElementById('cancelModalBtn')?.addEventListener('click', () => {
        closeModal();
    });

    document.getElementById('saveModalBtn')?.addEventListener('click', async () => {
        await saveModal();
    });

    document.getElementById('modalOverlay')?.addEventListener('click', (event) => {
        closeModalOutside(event);
    });

    document.getElementById('resumeDrop')?.addEventListener('click', () => {
        document.getElementById('resumeInput')?.click();
    });

    document.getElementById('removeResumeBtn')?.addEventListener('click', () => {
        removeResume();
    });

    document.getElementById('resumeInput')?.addEventListener('change', (event) => {
        handleResume(event);
    });

    document.getElementById('practiceNowBtn')?.addEventListener('click', () => {
        window.alert('Opening Interview Prep...');
    });

    const avatarEditButton = document.getElementById('avatarEditBtn');
    if (avatarEditButton) {
        const photoInput = document.createElement('input');
        photoInput.type = 'file';
        photoInput.accept = 'image/*';
        photoInput.style.display = 'none';
        document.body.appendChild(photoInput);

        avatarEditButton.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', async () => {
            const file = photoInput.files && photoInput.files[0];
            if (!file) return;
            try {
                setStatus('Uploading profile photo...');
                const updated = await window.ProfileApi.uploadProfilePhoto(file);
                currentProfile = { ...currentProfile, ...updated };
                renderProfile(currentProfile);
                setStatus('Profile photo updated.');
            } catch (error) {
                setStatus(error.message || 'Unable to upload profile photo.', true);
            } finally {
                photoInput.value = '';
            }
        });
    }

    document.addEventListener('savedJobsUpdated', () => {
        renderViewerMetrics().catch((error) => {
            setStatus(error.message || 'Unable to refresh application counts.', true);
        });
    });
});

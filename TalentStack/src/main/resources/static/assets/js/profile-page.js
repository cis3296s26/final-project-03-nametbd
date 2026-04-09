document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('displayName')) return;

    const status = document.getElementById('profileStatus');
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

    function handleResume(input) {
        const file = input.files && input.files[0];
        if (!file) return;

        const fileName = document.getElementById('fileName');
        const fileMeta = document.getElementById('fileMeta');
        const resumeDrop = document.getElementById('resumeDrop');
        const resumeFile = document.getElementById('resumeFile');

        if (fileName) fileName.textContent = file.name;
        if (fileMeta) fileMeta.textContent = `Uploaded just now · ${(file.size / 1024).toFixed(0)} KB`;
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

    const modals = {
        about: {
            title: 'Edit About',
            html: () => `
                <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input class="form-input" id="f_name" value="${document.getElementById('displayName')?.textContent || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Headline</label>
                    <input class="form-input" id="f_headline" value="${document.getElementById('displayHeadline')?.textContent || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input class="form-input" id="f_location" value="${document.getElementById('displayLocation')?.textContent || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">About / Bio</label>
                    <textarea class="form-textarea" id="f_about">${document.getElementById('aboutText')?.textContent.trim() || ''}</textarea>
                </div>`,
            save: () => {
                const name = document.getElementById('f_name')?.value || '';
                const headline = document.getElementById('f_headline')?.value || '';
                const location = document.getElementById('f_location')?.value || '';
                const about = document.getElementById('f_about')?.value || '';

                const displayName = document.getElementById('displayName');
                const displayHeadline = document.getElementById('displayHeadline');
                const displayLocation = document.getElementById('displayLocation');
                const aboutText = document.getElementById('aboutText');
                const avatar = document.getElementById('avatarEl');

                if (displayName) displayName.textContent = name;
                if (displayHeadline) displayHeadline.textContent = headline;
                if (displayLocation) displayLocation.textContent = location;
                if (aboutText) aboutText.textContent = about;
                if (avatar) avatar.textContent = getInitials(name);
            }
        },
        skills: {
            title: 'Edit Skills',
            html: () => {
                const skills = Array.from(document.querySelectorAll('#skillsGrid .skill-tag'))
                    .map((skill) => skill.textContent)
                    .join(', ');
                return `
                    <div class="form-group">
                        <label class="form-label">Skills (comma-separated)</label>
                        <textarea class="form-textarea" id="f_skills" style="min-height:60px">${skills}</textarea>
                    </div>`;
            },
            save: () => {
                const tags = (document.getElementById('f_skills')?.value || '')
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean);

                const skillsGrid = document.getElementById('skillsGrid');
                if (skillsGrid) {
                    skillsGrid.innerHTML = tags.map((tag) => `<span class="skill-tag">${tag}</span>`).join('');
                }
            }
        }
    };

    let currentModal = null;

    function openModal(key) {
        const modal = modals[key];
        if (!modal) return;

        currentModal = key;

        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        const overlay = document.getElementById('modalOverlay');

        if (title) title.textContent = modal.title;
        if (body) body.innerHTML = modal.html();
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

    function saveModal() {
        if (currentModal && modals[currentModal] && modals[currentModal].save) {
            modals[currentModal].save();
        }
        closeModal();
    }

    try {
        await window.ApiClient.ensureAuthenticated();
        const profile = await window.ProfileApi.getProfile();

        const displayEmail = document.getElementById('displayEmail');
        const displayName = document.getElementById('displayName');
        const displayCreatedAt = document.getElementById('displayCreatedAt');
        const avatar = document.getElementById('avatarEl');

        const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Not Set';

        if (displayEmail) displayEmail.textContent = profile.email || 'Not Set';
        if (displayName) displayName.textContent = fullName;
        if (displayCreatedAt) {
            displayCreatedAt.textContent = profile.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : 'Unavailable';
        }

    if (avatar) avatar.textContent = getInitials(fullName);

            const savedPic = localStorage.getItem('profilePic');
            if (savedPic && avatar) {
                avatar.style.backgroundImage = `url('${savedPic}')`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
                avatar.textContent = '';
            }

            const savedMeta = localStorage.getItem('profileMeta');
            if (savedMeta) {
                const meta = JSON.parse(savedMeta);
                const displayLocation = document.getElementById('displayLocation');
                if (displayLocation) displayLocation.textContent = meta.location || 'Not Set';
            }
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
});
document.addEventListener('DOMContentLoaded', async () => {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const darkModeStatus = document.getElementById('darkModeStatus');

    if (!modalOverlay || !modalTitle || !modalBody || !darkModeStatus) {
        return;
    }

    let currentModal = null;

    const races = [
        'African American/Black',
        'Asian',
        'Caucasian/White',
        'Hispanic/Latino',
        'Native American/Alaska Native',
        'Native Hawaiian/Pacific Islander',
        'Middle Eastern/North African',
        'Multiracial',
        'Other'
    ];

    const languages = [
        'English',
        'Spanish',
        'French',
        'German',
        'Chinese (Simplified)',
        'Chinese (Traditional)',
        'Arabic',
        'Hindi',
        'Portuguese',
        'Russian',
        'Japanese',
        'Korean',
        'Italian',
        'Dutch',
        'Turkish',
        'Polish',
        'Swedish',
        'Vietnamese',
        'Tagalog',
        'Indonesian',
        'Thai',
        'Hebrew',
        'Greek'
    ];

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getStoredArray(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (error) {
            return [];
        }
    }

    function updateDarkStatus(mode) {
        darkModeStatus.textContent = mode === 'on' ? 'ON' : 'OFF';
    }

    function applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark ? 'on' : 'off');
        updateDarkStatus(isDark ? 'on' : 'off');
    }

    function loadDemographicsDisplay() {
        const gender = localStorage.getItem('demographics.gender') || '';
        const selectedRaces = getStoredArray('demographics.races');

        const displayGender = document.getElementById('displayGender');
        const displayRaces = document.getElementById('displayRaces');

        if (displayGender) {
            displayGender.textContent = gender || 'Prefer not to say';
        }

        if (displayRaces) {
            displayRaces.textContent = selectedRaces.length ? selectedRaces.join(', ') : 'None';
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        currentModal = null;
    }

    function closeModalOutside(event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    }

    function initDemographicsModal() {
        const container = document.getElementById('raceCheckboxes');
        const genderSelect = document.getElementById('genderSelect');
        if (!container || !genderSelect) return;

        container.innerHTML = races.map((race) => `
            <label class="settings-checkbox-row">
                <input type="checkbox" value="${escapeHtml(race)}">
                <span>${escapeHtml(race)}</span>
            </label>
        `).join('');

        const savedRaces = getStoredArray('demographics.races');
        savedRaces.forEach((race) => {
            const checkbox = container.querySelector(`input[value="${CSS.escape(race)}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        genderSelect.value = localStorage.getItem('demographics.gender') || '';
    }

    const modals = {
        demographics: {
            title: 'Edit Demographics',
            html: () => `
                <div class="form-group">
                    <label class="form-label">Gender (optional)</label>
                    <select id="genderSelect" class="form-input">
                        <option value="">Prefer not to say</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Nonbinary">Nonbinary</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Race & Ethnicity (select all that apply)</label>
                    <div id="raceCheckboxes" class="checkbox-container"></div>
                    <small class="settings-help-text">Select multiple if necessary</small>
                </div>
            `,
            bind: initDemographicsModal,
            save: () => {
                const gender = document.getElementById('genderSelect')?.value || '';
                const selectedRaces = Array.from(
                    document.querySelectorAll('#raceCheckboxes input:checked')
                ).map((checkbox) => checkbox.value);

                localStorage.setItem('demographics.gender', gender);
                localStorage.setItem('demographics.races', JSON.stringify(selectedRaces));
                loadDemographicsDisplay();
            }
        },
        language: {
            title: 'Language',
            html: () => `
                <div class="form-group">
                    <label class="form-label">Select Language</label>
                    <select id="languageSelect" class="form-input">
                        ${languages.map((language) => `<option value="${escapeHtml(language)}">${escapeHtml(language)}</option>`).join('')}
                    </select>
                </div>
            `,
            bind: () => {
                const select = document.getElementById('languageSelect');
                if (select) {
                    select.value = localStorage.getItem('preferences.language') || 'English';
                }
            },
            save: () => {
                const language = document.getElementById('languageSelect')?.value || 'English';
                localStorage.setItem('preferences.language', language);
            }
        },
        privacy: {
            title: 'Privacy',
            html: () => `
                <div class="form-group">
                    <label class="form-label">Account Visibility</label>
                    <select id="privacySelect" class="form-input">
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
            `,
            bind: () => {
                const select = document.getElementById('privacySelect');
                if (select) {
                    select.value = localStorage.getItem('preferences.privacy') || 'Public';
                }
            },
            save: () => {
                const privacy = document.getElementById('privacySelect')?.value || 'Public';
                localStorage.setItem('preferences.privacy', privacy);
            }
        },
        darkmode: {
            title: 'Dark Mode',
            html: () => `
                <div class="form-group">
                    <label class="form-label">Toggle Dark Mode</label>
                    <select id="darkToggle" class="form-input">
                        <option value="off">Off</option>
                        <option value="on">On</option>
                    </select>
                </div>
            `,
            bind: () => {
                const select = document.getElementById('darkToggle');
                if (select) {
                    select.value = localStorage.getItem('darkMode') === 'on' ? 'on' : 'off';
                }
            },
            save: () => {
                const mode = document.getElementById('darkToggle')?.value || 'off';
                applyDarkMode(mode === 'on');
            }
        },
        password: {
            title: 'Change Password',
            html: () => `
                <div class="form-group">
                    <input type="password" id="oldPassword" class="form-input" placeholder="Old Password" required>
                </div>
                <div class="form-group">
                    <input type="password" id="newPassword" class="form-input" placeholder="New Password" required>
                </div>
                <div class="form-group">
                    <input type="password" id="confirmPassword" class="form-input" placeholder="Confirm Password" required>
                </div>
            `,
            bind: () => {},
            save: () => {
                const oldPassword = document.getElementById('oldPassword')?.value || '';
                const newPassword = document.getElementById('newPassword')?.value || '';
                const confirmPassword = document.getElementById('confirmPassword')?.value || '';
                const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

                if (!oldPassword) {
                    throw new Error('Current password is required.');
                }

                if (newPassword !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }

                if (!validPassword.test(newPassword)) {
                    throw new Error('Password must include uppercase, lowercase, number, and symbol.');
                }

                return window.AuthApi.changePassword(oldPassword, newPassword).then(() => {
                    window.alert('Password updated.');
                });
            }
        },
        delete: {
            title: 'Delete Account',
            html: () => `
                <p class="settings-warning-text">Are you sure you want to delete your account?</p>
                <button class="btn-primary" id="confirmDeleteBtn" type="button">Yes, Delete Account</button>
            `,
            bind: () => {
                document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
                    window.alert('Account deleted');
                    window.location.href = '/';
                });
            },
            save: () => {}
        }
    };

    function openModal(key) {
        const modal = modals[key];
        if (!modal) return;

        currentModal = key;
        modalTitle.textContent = modal.title;
        modalBody.innerHTML = modal.html();
        modalOverlay.classList.add('open');

        if (modal.bind) {
            modal.bind();
        }
    }

    async function saveModal() {
        if (!currentModal || !modals[currentModal]) {
            closeModal();
            return;
        }

        try {
            if (modals[currentModal].save) {
                await modals[currentModal].save();
            }
            closeModal();
        } catch (error) {
            window.alert(error.message || 'Unable to save settings.');
        }
    }

    loadDemographicsDisplay();
    applyDarkMode(localStorage.getItem('darkMode') === 'on');

    document.getElementById('editDemographicsBtn')?.addEventListener('click', () => openModal('demographics'));
    document.getElementById('editLanguageBtn')?.addEventListener('click', () => openModal('language'));
    document.getElementById('editPrivacyBtn')?.addEventListener('click', () => openModal('privacy'));
    document.getElementById('editDarkModeBtn')?.addEventListener('click', () => openModal('darkmode'));
    document.getElementById('editPasswordBtn')?.addEventListener('click', () => openModal('password'));
    document.getElementById('deleteAccountBtn')?.addEventListener('click', () => openModal('delete'));

    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('cancelModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('saveModalBtn')?.addEventListener('click', async () => {
        await saveModal();
    });
    modalOverlay.addEventListener('click', closeModalOutside);
});

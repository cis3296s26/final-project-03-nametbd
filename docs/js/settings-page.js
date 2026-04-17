document.addEventListener('DOMContentLoaded', async () => {
    const saveBtn = document.getElementById('saveProfileButton');
    if (!saveBtn) return;

    const status = document.getElementById('profileStatus');
    const defaultPicturePath = '/docs/resources/defaultProfilePic.jpg';

    function setStatus(message, isError = false) {
        if (!status) return;
        status.textContent = message;
        status.style.color = isError ? '#b00020' : '';
    }

    function loadSavedPicture() {
        const savedPic = localStorage.getItem('profilePic');
        const picture = document.getElementById('profilePicture');
        if (savedPic && picture) {
            picture.src = savedPic;
        }
    }

    function loadLocalPreferences() {
        const savedMeta = localStorage.getItem('profileMeta');
        if (!savedMeta) return;

        try {
            const profileMeta = JSON.parse(savedMeta);
            const profileStatus = document.getElementById('status');
            const location = document.getElementById('location');

            if (profileStatus) profileStatus.value = profileMeta.status || 'student';
            if (location) location.value = profileMeta.location || '';
        } catch (error) {
            setStatus('Unable to load saved preferences.', true);
        }
    }


    async function loadProfile() {
        try {
            setStatus('Loading profile...');

            await window.ApiClient.ensureAuthenticated();
            const profile = await window.ProfileApi.getProfile();

            const email = document.getElementById('profileEmail');
            const firstName = document.getElementById('profileFirstName');
            const lastName = document.getElementById('profileLastName');
            const createdAt = document.getElementById('profileCreatedAt');

            if (email) email.value = profile.email || '';
            if (firstName) firstName.value = profile.firstName || '';
            if (lastName) lastName.value = profile.lastName || '';
            if (createdAt) {
                createdAt.textContent = profile.createdAt
                    ? new Date(profile.createdAt).toLocaleString()
                    : 'Unavailable';
            }

            setStatus('Profile loaded.');
        } catch (error) {
            setStatus(error.message || 'Unable to load profile.', true);
        }
    }
    function saveLocalPreferences() {
            const profileMeta = {
                status: document.getElementById('status')?.value || 'student',
                location: document.getElementById('location')?.value.trim() || ''
            };

            localStorage.setItem('profileMeta', JSON.stringify(profileMeta));
        }

    async function saveProfile() {
        const payload = {
            email: document.getElementById('profileEmail')?.value.trim() || '',
            firstName: document.getElementById('profileFirstName')?.value.trim() || '',
            lastName: document.getElementById('profileLastName')?.value.trim() || ''
        };

        try {
            setStatus('Saving profile...');

            await window.ProfileApi.updateProfile(payload);
            saveLocalPreferences();

            setStatus('Saving profile...');
        } catch (error) {
            setStatus(error.message || 'Unable to save profile.', true);
        }
    }
    function resetPic() {
            const profilePicture = document.getElementById('profilePicture');
            if (profilePicture) profilePicture.src = defaultPicturePath;
            localStorage.removeItem('profilePic');
        }

        function handlePictureUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64 = loadEvent.target?.result;
                if (!base64) return;

                const picture = document.getElementById('profilePicture');
                if (picture) picture.src = base64;
                localStorage.setItem('profilePic', base64);
            };

            reader.readAsDataURL(file);
        }

        function addTag() {
            window.alert('Tag editing will be available in a future update.');
        }

        window.resetPic = resetPic;
        window.saveBasicInfo = saveProfile;
        window.addTag = addTag;

        document.getElementById('picUpload')?.addEventListener('change', handlePictureUpload);

        loadSavedPicture();
        loadLocalPreferences();

    await loadProfile();
    saveBtn.addEventListener('click', saveProfile);
});
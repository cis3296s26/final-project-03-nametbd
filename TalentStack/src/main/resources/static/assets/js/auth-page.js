//Authentication page behavior. This file controls login/register form submission, page status text, and password visibility toggles while delegating HTTP work to AuthApi

(function () {
    //Redirect target used after successful authentication.
    const DASHBOARD_PAGE = '/assets/pages/dashboard.html';

    const EYE_OPEN_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
    <circle cx="12" cy="12" r="3"/>
    </svg>
    `;

    const EYE_CLOSED_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
    <path d="m2 2 20 20"/>
    </svg>
    `;

    //Update a named status element with success/error text.
    function setStatus(elementId, message, isError = false) {
        const status = document.getElementById(elementId);
        if (!status) return;
        status.textContent = message || '';
        status.style.color = isError ? '#b00020' : '';
    }

    //Toggle password inputs between masked and plain-text display.
    function setupPasswordToggles() {
        const toggles = document.querySelectorAll('.password-toggle');

        toggles.forEach((toggleBtn) => {
            toggleBtn.addEventListener('click', () => {
                const targetId = toggleBtn.dataset.target;
                const input = document.getElementById(targetId);
                if (!input) return;

                const showing = input.type === 'text';
                input.type = showing ? 'password' : 'text';
                toggleBtn.innerHTML = showing ? EYE_OPEN_ICON : EYE_CLOSED_ICON;
            });
        });
    }

    //Submit login credentials through AuthApi and redirect when authentication succeeds.
    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email')?.value.trim() || '';
            const password = document.getElementById('password')?.value || '';

            setStatus('authStatus', 'Signing in...');

            try {
                await window.AuthApi.login(email, password);
                setStatus('authStatus', 'Login successful.');
                window.location.href = DASHBOARD_PAGE;
            } catch (error) {
            setStatus('authStatus', error.message || 'Login failed.', true);
            }
        });
    }

    //Submit registration data through AuthApi after confirming the passwords match.
    function setupRegisterForm() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const firstName = document.getElementById('firstName')?.value.trim() || '';
            const lastName = document.getElementById('lastName')?.value.trim() || '';
            const email = document.getElementById('regEmail')?.value.trim() || '';
            const password = document.getElementById('regPassword')?.value || '';
            const confirmPassword = document.getElementById('confirmPassword')?.value || '';

            if (password !== confirmPassword) {
                setStatus('registerStatus', 'Passwords do not match.', true);
                return;
            }

            setStatus('registerStatus', 'Creating account...');

            try {
                await window.AuthApi.register(firstName, lastName, email, password);
                setStatus('registerStatus', 'Registration successful.');
                window.location.href = DASHBOARD_PAGE;
            } catch (error) {
            setStatus('registerStatus', error.message || 'Registration failed.', true);
            }
        });
    }

    //Initialize all auth-page behaviors only after the DOM is ready.
    document.addEventListener('DOMContentLoaded', () => {
        setupPasswordToggles();
        setupLoginForm();
        setupRegisterForm();
    });
})();

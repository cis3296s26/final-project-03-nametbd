(function () {
    const LOGIN_ENDPOINT = '/api/login';
    const REGISTER_ENDPOINT = '/api/signup';
    const PROFILE_PAGE = '/docs/pages/profile.html';
    const DASHBOARD_PAGE = '/docs/pages/dashboard.html';

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

    function setStatus(message, isError = false) {
        const status = document.getElementById('authStatus');
        if (!status) return;

        status.textContent = message || '';
        status.style.color = isError ? '#b00020' : '';
    }

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

    async function login(email, password) {
        if (!window.ApiClient) {
            throw new Error('ApiClient is not available.');
        }

        return window.ApiClient.request(LOGIN_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
    }

    async function register(firstName, lastName, email, password) {
        if (!window.ApiClient) {
            throw new Error('ApiClient is not available.');
        }

        return window.ApiClient.request(REGISTER_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                first_name: firstName,
                last_name: lastName
            })
        });
    }

    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email')?.value.trim() || '';
            const password = document.getElementById('password')?.value || '';

            setStatus('Signing in...');

            try {
                await login(email, password);
                setStatus('Login successful.');
                window.location.href = DASHBOARD_PAGE;
            } catch (error) {
                setStatus(error.message || 'Login failed.', true);
            }
        });
    }

function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstName = document.getElementById('firstName')?.value.trim() || '';
        const lastName = document.getElementById('lastName')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const password = document.getElementById('password')?.value || '';
        const confirmPassword = document.getElementById('confirmPassword')?.value || '';

        if (password !== confirmPassword) {
            setStatus('Passwords do not match.', true);
            return;
        }

        setStatus('Creating account...');

        try {
            await register(firstName, lastName, email, password);
            setStatus('Registration successful.');
            window.location.href = DASHBOARD_PAGE;
        } catch (error) {
            setStatus(error.message || 'Registration failed.', true);
        }
    });
}

    document.addEventListener('DOMContentLoaded', () => {
        setupPasswordToggles();
        setupLoginForm();
        setupRegisterForm();
    });
})();
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach((dropdown) => {
        const btn = dropdown.querySelector('.dropbtn');
        const menu = dropdown.querySelector('.dropdown-content');

        if (!btn || !menu) return;

        btn.addEventListener('click', (event) => {
            event.stopPropagation();

            dropdowns.forEach((d) => {
                const current = d.querySelector('.dropdown-content');
                if (current && current !== menu) {
                    current.classList.remove('show');
                }
            });

            menu.classList.toggle('show');
        });
    });

    document.addEventListener('click', () => {
        dropdowns.forEach((dropdown) => {
            const menu = dropdown.querySelector('.dropdown-content');
            if (menu) {
                menu.classList.remove('show');
            }
        });
    });

const logoutLinks = document.querySelectorAll('[data-action="logout"]');
    logoutLinks.forEach((link) => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                if (window.AuthApi && typeof window.AuthApi.logout === 'function') {
                    await window.AuthApi.logout();
                }
            } finally {
                if (window.ApiClient && typeof window.ApiClient.redirectToLogin === 'function') {
                    window.ApiClient.redirectToLogin();
                } else {
                    window.location.href = '/';
                }
            }
        });
    });
});
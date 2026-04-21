//Landing/auth screen behavior. This file manages dropdown menus, profile hydration for shared layouts, password toggle icons, and switching between login/register panels.

// Initialize shared landing-page UI after the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    // Dropdown menus are mutually exclusive: opening one closes the others.
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

    // If this shared script is running on a profile page, hook the save button into profile helpers.
    const saveBtn = document.getElementById('saveProfileButton');
    if (saveBtn && window.ProfileApi && window.loadProfile && window.saveProfile) {
        window.loadProfile();
        saveBtn.addEventListener('click', () => {
            window.saveProfile();
        });
    }

    // If profile display fields exist, fetch profile data and fill the basic summary values.
    if (document.getElementById('displayEmail') && window.ProfileApi) {
        window.ProfileApi.getProfile()
            .then((profile) => {
                const email = document.getElementById('displayEmail');
                const firstName = document.getElementById('displayFirstName');
                const lastName = document.getElementById('displayLastName');
                const createdAt = document.getElementById('displayCreatedAt');
                const status = document.getElementById('profileStatus');

                if (email) email.textContent = profile.email || 'Not Set';
                if (firstName) firstName.textContent = profile.firstName || 'Not Set';
                if (lastName) lastName.textContent = profile.lastName || 'Not Set';
                if (createdAt) {
                    createdAt.textContent = profile.createdAt
                        ? new Date(profile.createdAt).toLocaleString()
                        : 'Unavailable';
                }

                if (status) status.textContent = 'Profile loaded.';
            })
            .catch((error) => {
                const status = document.getElementById('profileStatus');
                if (status) status.textContent = error.message;
            });
    }
});

// FOR PASSWORD SHOW/HIDE
// Toggle one password input between hidden and visible text states and swap the eye icon.
function togglePassword(icon) {
    const inputGroup = icon.closest(".input-group");
    const passwordInput = inputGroup.querySelector("input");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.733 5.076A10.744 10.744 0 0 1 21.938 12 10.75 10.75 0 0 1 18 17.357"/>
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                <path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12a10.75 10.75 0 0 1 4.441-5.938"/>
                <path d="M2 2l20 20"/>
            </svg>
        `;
    } else {
        passwordInput.type = "password";
        icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    }
}




// FOR CHANGING SCREEN FROM REGISTER TO SIGN IN + RESPONSIVE CARD RESIZING
// Cache the major auth screen panels/buttons used for login/register mode switching.
const formContainer = document.querySelector(".form-container");
const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

const loginBtn = document.querySelector("#login-btn");
const registerBtn = document.querySelector("#register-btn")

const loginForm = document.querySelector(".login-container");
const registerForm = document.querySelector(".register-container");

const fluid = document.querySelector("#fluid");

// Shift the animated auth layout back to the login view.
function viewLogin() {
    loginForm.style.left = "0";
    registerForm.style.left = "100%";

    formContainer.classList.remove("register-mode");

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;

    fluid.classList.add("fluid-animate");
}

// Shift the animated auth layout over to the registration view.
function viewRegister() {
    loginForm.style.left = "-100%";
    registerForm.style.left = "0";

    formContainer.classList.add("register-mode");

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;

    fluid.classList.add("fluid-animate");
}

// Bind the mode-switch buttons so the user can move between auth views.
registerBtn.addEventListener('click', viewRegister);
loginBtn.addEventListener('click', viewLogin);

// Remove the temporary animation class once the CSS transition completes.
fluid.addEventListener('animationend', () => {
    fluid.classList.remove("fluid-animate");
})
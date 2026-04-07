document.addEventListener('DOMContentLoaded', () =>{
    const dropdowns = document.querySelectorAll('.dropdown');


    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropbtn');
        const menu = dropdown.querySelector('.dropdown-content');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            // close all other dropdowns (to fix where they're both open)
            dropdowns.forEach(d => {
                const m = d.querySelector('.dropdown-content');
                if (m !== menu) {
                    m.classList.remove('show');
                }   
            });

            // toggle current one selected
            menu.classList.toggle('show');
        });
    });

    // close all dropdowns when clicked outside (elsewhere on page)
    document.addEventListener('click', () => {
        dropdowns.forEach(d => {
        d.querySelector('.dropdown-content').classList.remove('show');
        });
    });

    // SETTINGS.html functionalities (runs only in settings)
    if(document.querySelector('.profile-container')){
        // global functions for onclick
        window.resetPic = resetPic;
        window.saveBasicInfo = saveBasicInfo;
        window.addTag - addTag;

        // profile picture upload
        const picUpload = document.getElementById('picUpload');
        if(picUpload){
            picUpload.addEventListener('change', (e) => {
                const file = event.target.files[0];
                if(file){
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('profilePicture').src = e.target.result;
                        localStorage.setItem('profilePic', event.target.result); // share with profile.html
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // reset profile picture to default
        function resetPic(){
            document.getElementById('profilePicture').src = '../resources/defaultProfilePic.jpg';
            localStorage.removeItem('profilePic');
        }

        // save basic information
        function saveBasicInfo(){
            const info = {
                name: document.getElementById('fullName').value,
                status: document.getElementById('status').value,
                location: document.getElementById('location').value
            };
            localStorage.setItem('profileInfo', JSON.stringify(info));
            alert('Profile Saved!');
        }

        // add tags & sections
        // TBD

        // load data into forms
        const savedInfo = localStorage.getItem('profileInfo');
        if(savedInfo){
            const info = JSON.parse(savedInfo);
            document.getElementById('fullName').value = info.name || '';
            document.getElementById('status').value = info.status || 'student';
            document.getElementById('location').value = info.location || '';
        }

        const savedPic = localStorage.getItem('profilePic');
        if(savedPic){
            document.getElementById('profilePicture').src = savedPic;
        }
    }

    // PROFILE.html functionalities (runs only in profile)
    if(document.querySelector('profile-display')){
        const savedInfo = localStorage.getItem('profileInfo');
        const savedPic = localStorage.getItem('profilePic');
        // const savedTags = localStorage.getItem('profileTags')

        // hide locked notice, display data if it exists
        const lockedNotice = document.getElementById('lockedNotice');
        if(savedInfo || savedPic){
            if(lockedNotice){
                lockedNotice.style.display = none;
            }

            // load profile picture
            const profilePic = document.getElementById('profilePicture') || document.getElementById('profileDisplayPic');
            if(savedPic && profilePic){
                profilePic.src = savedPic;
            }

            // load basic info
            if (savedInfo) {
                const info = JSON.parse(savedInfo);
                const nameEl = document.getElementById('displayName');
                const statusEl = document.getElementById('displayStatus');
                const locationEl = document.getElementById('displayLocation');
                const infoSection = document.getElementById('profileInfoSection');

                if (nameEl) nameEl.textContent = info.name || 'Not Set';
                if (statusEl) statusEl.textContent = info.status === 'student' ? 'Student' : 'Graduate';
                if (locationEl) locationEl.textContent = info.location || 'Not Set';
                if (infoSection) infoSection.style.display = 'block';
            }

            // load tags
            // TBD
        }
    }

});

// FOR PASSWORD SHOW/HIDE
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
const formContainer = document.querySelector(".form-container");
const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

const loginBtn = document.querySelector("#login-btn");
const registerBtn = document.querySelector("#register-btn")

const loginForm = document.querySelector(".login-container");
const registerForm = document.querySelector(".register-container");

const fluid = document.querySelector("#fluid");

function viewLogin() {
    loginForm.style.left = "0";
    registerForm.style.left = "100%";

    formContainer.classList.remove("register-mode");

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;

    fluid.classList.add("fluid-animate");
}

function viewRegister() {
    loginForm.style.left = "-100%";
    registerForm.style.left = "0";

    formContainer.classList.add("register-mode");

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;

    fluid.classList.add("fluid-animate");
}

registerBtn.addEventListener('click', viewRegister);
loginBtn.addEventListener('click', viewLogin);

fluid.addEventListener('animationend', () => {
    fluid.classList.remove("fluid-animate");
})



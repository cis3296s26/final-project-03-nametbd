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

    // SETTINGS page functionalities (runs only in settings)
    if(document.querySelector('.profile-container')){
        // expose functions globally for onclick handlers
        window.resetPic = resetPic;
        window.saveBasicInfo = saveBasicInfo;
        window.addTag - addTag;

        // profile picture upload
        const picUpload = document.getElementById('picUpload');
        if(picUpload){
            picUpload.addEventListener('change', function(event){
                const file = event.target.files[0];
                if(file){
                    reader.onload = function(e){
                        document.getElementById('profilePicture').src = e.target.result;
                        localStorage.setItem('profilePic', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // reset profile picture to default
        function resetPic(){
            const profilePic = document.getElementById('profilePicture');
            profilePic.src = '../resources/defaultProfilePic.jpg';
            localStorage.removeItem('profilePic');
        }
    }
});




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
});




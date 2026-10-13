// =====================================
// SnapFin Instructions Page
// Mobile navigation + page interactions
// =====================================

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

// Mobile menu
if (menu && menuLinks) {
    menu.addEventListener('click', function () {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
}

// Close the mobile menu after selecting a navigation link
const navLinks = document.querySelectorAll('.navbar__links');

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        if (menu && menuLinks) {
            menu.classList.remove('is-active');
            menuLinks.classList.remove('active');
        }
    });
});

// Record that the user has visited the instructions page.
// This keeps the same behaviour as the homepage logic.
const instructionsLink = document.getElementById('nav-instructions');

if (instructionsLink) {
    sessionStorage.setItem('hasVisitedInstructionsPage', 'true');

    instructionsLink.addEventListener('click', function () {
        sessionStorage.setItem('hasVisitedInstructionsPage', 'true');
    });
}

// The homepage uses this session flag to allow access to the
// image uploading page after the instructions have been reviewed.
const classifyButtons = document.querySelectorAll('.check-instructions');

classifyButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        sessionStorage.setItem('hasVisitedInstructionsPage', 'true');
    });
});
// Logic for the mobile menu */
// Add the click effect so that it actually animates */
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
})


// Logic for the instructions pages*/
// Mark the 'Instructions Page' as visited when the user clicks on the instructions page link */
const instructionsLink = document.getElementById('nav-instructions');
if (instructionsLink) {
    instructionsLink.addEventListener('click', function() {
        sessionStorage.setItem('hasVisitedInstructionsPage', 'true');
    
    });
}

// Intercept clicks on any "Classify Fish" or "Try Now" buttons */
const classifyButtons =document.querySelectorAll('.check-instructions');
const alertBox = document.getElementById('alert-box');
const alertBoxOkayBtn = document.getElementById('alert-box-okay-btn');



classifyButtons.forEach( button => {
button.addEventListener('click', function(e) {
    // Stop the button from navigating immediately
    e.preventDefault();

    // Grab the destination URL (e.g., uploading)
    const destinationUrl = this.getAttribute('href');

    // Check if the user has already visited the instructions page 
    if(sessionStorage.getItem('hasVisitedInstructionsPage') == 'true') {
        // User has visited the instructions page -> so we allow them to proceed to the image uploading page
        window.location.href = destinationUrl;
    } else {
        // User has not visited the instructions page -> show the alert box 
        alertBox.style.display = 'flex';
    }
});
});

// Handle the "Okay" button inside the alert box 
if(alertBoxOkayBtn) {
    alertBoxOkayBtn.addEventListener('click', function() {
        // Hide the alert box 
        alertBox.style.display = 'none';
    })
}

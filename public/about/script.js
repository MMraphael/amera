//IR HOME
function irHome() {
    window.location.href = '/index.html';
   }

//NAV - FOOTER
document.addEventListener("scroll", function() {
    const homeButton = document.querySelector('.home');
    const footer = document.querySelector('footer');
    
    const footerRect = footer.getBoundingClientRect();
    const homeButtonRect = homeButton.getBoundingClientRect();

    if (homeButtonRect.bottom >= footerRect.top) {
        homeButton.classList.add('hidden');
    } else {
        homeButton.classList.remove('hidden');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileNav = document.getElementById('mobile-nav');
    const body = document.querySelector('body');

    if (hamburgerButton && mobileNav && body) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('open');
            mobileNav.classList.toggle('hidden');
            body.classList.toggle('no-scroll', !mobileNav.classList.contains('hidden'));
        });
    }

    const navLinks = document.querySelectorAll('#mobile-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // If the mobile nav is open, clicking a link should close it.
            if (!mobileNav.classList.contains('hidden')) {
                hamburgerButton.click();
            }
        });
    });
});
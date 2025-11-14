document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileNav = document.getElementById('mobile-nav');
    const body = document.querySelector('body');
    const navLinks = document.querySelectorAll('#mobile-nav a');

    const toggleNavigation = () => {
        if (!hamburgerButton || !mobileNav || !body) return;

        hamburgerButton.classList.toggle('open');
        const isOpen = hamburgerButton.classList.contains('open');
        mobileNav.classList.toggle('is-open', isOpen);
        body.classList.toggle('no-scroll', isOpen);
        hamburgerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    if (hamburgerButton && mobileNav && body) {
        hamburgerButton.addEventListener('click', toggleNavigation);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav && mobileNav.classList.contains('is-open')) {
                toggleNavigation();
            }
        });
    });
});
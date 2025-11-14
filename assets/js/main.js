document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('#mobile-nav a');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const pageTransition = document.getElementById('page-transition');

    const toggleNavigation = () => {
        if (!hamburgerButton || !mobileNav || !body) return;
        hamburgerButton.classList.toggle('open');
        const isOpen = hamburgerButton.classList.contains('open');
        mobileNav.classList.toggle('is-open', isOpen);
        body.classList.toggle('no-scroll', isOpen);
        hamburgerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    if (hamburgerButton && mobileNav) {
        hamburgerButton.addEventListener('click', toggleNavigation);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav && mobileNav.classList.contains('is-open')) {
                toggleNavigation();
            }
        });
    });

    // Reveal on scroll
    const animatedNodes = document.querySelectorAll('[data-animate]');
    if ('IntersectionObserver' in window && animatedNodes.length) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
        animatedNodes.forEach(node => revealObserver.observe(node));
    } else {
        animatedNodes.forEach(node => node.classList.add('is-visible'));
    }

    // Cursor
    const prefersCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (prefersCoarse) {
        body.classList.add('is-touch');
    } else if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        const ease = 0.18;

        const render = () => {
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            requestAnimationFrame(render);
        };
        render();

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.classList.remove('is-hidden');
            cursorRing.classList.remove('is-hidden');
        });
        document.addEventListener('mouseleave', () => {
            cursorDot.classList.add('is-hidden');
            cursorRing.classList.add('is-hidden');
        });

        const linkables = document.querySelectorAll('a, button, .btn');
        linkables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('is-link'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-link'));
        });
    }

    // Page transition
    if (pageTransition) {
        const removeTransition = () => {
            pageTransition.classList.remove('is-active');
            body.classList.remove('is-loading');
        };
        window.addEventListener('load', () => {
            setTimeout(removeTransition, 400);
        });
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const url = new URL(link.href, window.location.origin);
            if (url.origin !== window.location.origin || url.pathname.startsWith('#')) return;
            link.addEventListener('click', evt => {
                if (link.target === '_blank' || evt.metaKey || evt.ctrlKey) return;
                evt.preventDefault();
                pageTransition.classList.add('is-active');
                setTimeout(() => {
                    window.location.href = link.href;
                }, 600);
            });
        });
        window.addEventListener('pageshow', e => {
            if (e.persisted) {
                removeTransition();
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = document.querySelectorAll('#mobile-nav a');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const pageTransition = document.getElementById('page-transition');
    const invitationButton = document.getElementById('invitation-button');
    const invitationOptions = document.getElementById('invitation-options');
    const journalCarousel = document.getElementById('journal-carousel');
    const journalPrevBtn = document.getElementById('journal-prev');
    const journalNextBtn = document.getElementById('journal-next');
    const isHomePage = body.classList.contains('home-page');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // Invitation options toggle
    if (invitationButton && invitationOptions) {
        const setInvitationVisibility = visible => {
            const isVisible = typeof visible === 'boolean' ? visible : !invitationOptions.classList.contains('is-visible');
            invitationOptions.classList.toggle('is-visible', isVisible);
            invitationOptions.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
        };

        invitationButton.addEventListener('click', evt => {
            evt.preventDefault();
            evt.stopPropagation();
            setInvitationVisibility();
        });

        document.addEventListener('click', evt => {
            if (!invitationOptions.contains(evt.target) && evt.target !== invitationButton) {
                setInvitationVisibility(false);
            }
        });
    }

    if (journalCarousel) {
        const getScrollAmount = () => journalCarousel.clientWidth * 0.9;
        const scrollStep = direction => {
            const maxScrollLeft = Math.max(0, journalCarousel.scrollWidth - journalCarousel.clientWidth);
            if (maxScrollLeft === 0) return;
            const amount = getScrollAmount();
            if (direction > 0) {
                if (journalCarousel.scrollLeft + amount >= maxScrollLeft - 4) {
                    journalCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    journalCarousel.scrollBy({ left: amount, behavior: 'smooth' });
                }
            } else {
                if (journalCarousel.scrollLeft <= 4) {
                    journalCarousel.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
                } else {
                    journalCarousel.scrollBy({ left: -amount, behavior: 'smooth' });
                }
            }
        };

        let autoTimer = null;
        const stopAuto = () => {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        };
        const startAuto = () => {
            if (journalCarousel.children.length <= 1) return;
            stopAuto();
            autoTimer = setInterval(() => scrollStep(1), 6000);
        };

        const handleNav = direction => {
            stopAuto();
            scrollStep(direction);
            startAuto();
        };

        if (journalPrevBtn) {
            journalPrevBtn.addEventListener('click', () => handleNav(-1));
            journalPrevBtn.addEventListener('pointerenter', stopAuto);
            journalPrevBtn.addEventListener('pointerleave', startAuto);
        }
        if (journalNextBtn) {
            journalNextBtn.addEventListener('click', () => handleNav(1));
            journalNextBtn.addEventListener('pointerenter', stopAuto);
            journalNextBtn.addEventListener('pointerleave', startAuto);
        }

        journalCarousel.addEventListener('pointerenter', stopAuto);
        journalCarousel.addEventListener('pointerleave', startAuto);

        startAuto();
    }

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

    // Page transition + intro loader
    if (pageTransition) {
        const loaderTrace = pageTransition.querySelector('.loader-border__trace');
        if (loaderTrace && typeof loaderTrace.getTotalLength === 'function') {
            const length = loaderTrace.getTotalLength();
            loaderTrace.style.strokeDasharray = length;
            loaderTrace.style.strokeDashoffset = length;
        }

        const deactivateTransition = () => {
            pageTransition.classList.remove('is-active', 'is-entry', 'is-leaving');
            pageTransition.setAttribute('aria-hidden', 'true');
            body.classList.remove('is-loader-active');
        };

        const playIntroLoader = () => {
            const shouldPlayIntro = isHomePage && pageTransition.classList.contains('is-active');
            if (!shouldPlayIntro) {
                deactivateTransition();
                return;
            }

            pageTransition.setAttribute('aria-hidden', 'false');
            pageTransition.classList.add('is-entry');
            body.classList.add('is-loader-active');

            const introDuration = prefersReducedMotion ? 800 : 3000;
            const fadeOffset = prefersReducedMotion ? 200 : 700;

            setTimeout(() => {
                pageTransition.classList.add('is-leaving');
            }, Math.max(0, introDuration - fadeOffset));

            setTimeout(() => {
                deactivateTransition();
            }, introDuration);
        };

        window.addEventListener('load', playIntroLoader);

        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const url = new URL(link.href, window.location.origin);
            if (url.origin !== window.location.origin || url.pathname.startsWith('#')) return;
            link.addEventListener('click', evt => {
                if (link.target === '_blank' || evt.metaKey || evt.ctrlKey) return;
                evt.preventDefault();
                pageTransition.classList.remove('is-entry', 'is-leaving');
                pageTransition.setAttribute('aria-hidden', 'false');
                pageTransition.classList.add('is-active');
                setTimeout(() => {
                    window.location.href = link.href;
                }, 600);
            });
        });

        window.addEventListener('pageshow', e => {
            if (e.persisted) {
                deactivateTransition();
            }
        });
    }
});
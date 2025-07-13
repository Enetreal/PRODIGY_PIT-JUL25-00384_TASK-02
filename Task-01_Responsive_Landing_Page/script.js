document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelector('.nav-links');
    const burgerMenu = document.querySelector('.burger-menu');

    // --- Navigation Menu Interactivity (Hamburger Menu) ---
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked (for smoother navigation on mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // --- Header Background Change on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Change 50 to the scroll distance you prefer
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Hover Effect on Navigation Links (CSS handles basic hover) ---
    // JavaScript can be used for more complex effects, but simple color/background changes
    // are usually best left to CSS :hover pseudo-class for performance.
    // Example: You already have this in style.css:
    // .nav-links a:hover {
    //     color: #ffd700;
    //     border-bottom: 2px solid #ffd700;
    // }
});


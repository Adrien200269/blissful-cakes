// About page functionality
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupInteractions();
    }

    setupAnimations() {
        // Animate elements when about page becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe about page elements
        const aboutElements = document.querySelectorAll('#about-page .about-paragraphs p, #about-page .contact-details p');
        aboutElements.forEach(el => observer.observe(el));
    }

    setupInteractions() {
        // Add hover effects to contact information
        const contactDetails = document.querySelectorAll('.contact-details p');
        contactDetails.forEach(detail => {
            detail.addEventListener('mouseenter', () => {
                detail.style.transform = 'translateX(10px)';
                detail.style.transition = 'transform 0.3s ease';
            });

            detail.addEventListener('mouseleave', () => {
                detail.style.transform = 'translateX(0)';
            });
        });

        // Logo interaction
        const logoImage = document.querySelector('.logo-image');
        if (logoImage) {
            logoImage.addEventListener('click', () => {
                logoImage.classList.add('animate-jello');
                setTimeout(() => {
                    logoImage.classList.remove('animate-jello');
                }, 1000);
            });
        }
    }

    show() {
        const aboutPage = document.getElementById('about-page');
        if (aboutPage) {
            aboutPage.classList.add('active');
            this.triggerAnimations();
        }
    }

    hide() {
        const aboutPage = document.getElementById('about-page');
        if (aboutPage) {
            aboutPage.classList.remove('active');
        }
    }

    triggerAnimations() {
        // Stagger animations for paragraphs
        const paragraphs = document.querySelectorAll('#about-page .about-paragraphs p');
        paragraphs.forEach((p, index) => {
            setTimeout(() => {
                p.classList.add('animate-fade-in');
            }, index * 200);
        });
    }
}

// Initialize about page
window.aboutPage = new AboutPage();
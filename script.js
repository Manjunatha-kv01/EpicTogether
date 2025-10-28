/* ========================================
   HORIZON TRAVEL WEBSITE - SCRIPT
   Interactive Features & Animations
   ======================================== */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // VARIABLES
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const contactForm = document.getElementById('contact-form');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    let currentSlide = 0;
    let slideInterval;
    
    // ========================================
    // HERO SLIDER
    // ========================================
    function initHeroSlider() {
        if (heroSlides.length === 0) return;
        
        // Show first slide
        heroSlides[0].classList.add('active');
        
        // Auto-advance slides
        function nextSlide() {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }
        
        slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            hero.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }
    
    // ========================================
    // NAVIGATION
    // ========================================
    function initNavigation() {
        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Active navigation highlighting
        function updateActiveNav() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNav);
    }
    
    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    function initNavbarScrollEffect() {
        function handleNavbarScroll() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'var(--bg-surface)';
                navbar.style.boxShadow = 'none';
            }
        }
        
        window.addEventListener('scroll', handleNavbarScroll);
    }
    
    // ========================================
    // THEME TOGGLE
    // ========================================
    function initThemeToggle() {
        if (!themeToggle) return;
        
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
        
        function updateThemeIcon(theme) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }
    
    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);
        
        // Observe all elements with data-aos attribute
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ========================================
    // COUNTER ANIMATIONS
    // ========================================
    function initCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(counter => {
            counterObserver.observe(counter);
        });
        
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current).toLocaleString();
                }
            }, 20);
        }
    }
    
    // ========================================
    // GALLERY LIGHTBOX
    // ========================================
    function initLightbox() {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
    
    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    function initBackToTop() {
        if (!backToTopBtn) return;
        
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        window.addEventListener('scroll', toggleBackToTop);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ========================================
    // CONTACT FORM
    // ========================================
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : '#dc3545'};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 3000;
                transform: translateX(400px);
                transition: transform 0.3s ease-in-out;
                max-width: 300px;
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }
    
    // ========================================
    // SMOOTH SCROLLING FOR BUTTONS
    // ========================================
    function initSmoothScrollButtons() {
        const scrollButtons = document.querySelectorAll('a[href^="#"]');
        
        scrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ========================================
    // PARALLAX EFFECT
    // ========================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero');
        
        function handleParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }
        
        // Only apply parallax on desktop
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', handleParallax);
        }
    }
    
    // ========================================
    // NAVIGATION HIGHLIGHT ON SCROLL
    // ========================================
    function initNavigationHighlight() {
        function highlightNavigation() {
            const sections = document.querySelectorAll('section');
            const navHeight = navbar.offsetHeight;
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', highlightNavigation);
    }
    
    // ========================================
    // CARD HOVER EFFECTS
    // ========================================
    function initCardEffects() {
        const cards = document.querySelectorAll('.destination-card, .package-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // ========================================
    // LOADING ANIMATION
    // ========================================
    function initLoadingAnimation() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }
    
    // ========================================
    // NEWSLETTER FORM
    // ========================================
    function initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                if (!email) {
                    showNotification('Please enter your email address.', 'error');
                    return;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Simulate subscription
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                newsletterForm.reset();
            });
        }
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        initHeroSlider();
        initNavigation();
        initNavbarScrollEffect();
        initThemeToggle();
        initScrollAnimations();
        initCounterAnimations();
        initLightbox();
        initBackToTop();
        initContactForm();
        initSmoothScrollButtons();
        initParallax();
        initNavigationHighlight();
        initCardEffects();
        initLoadingAnimation();
        initNewsletterForm();
        
        // Add loading class to body initially
        document.body.classList.add('loading');
    }
    
    // Initialize all features
    init();
    
    // ========================================
    // RESIZE HANDLER
    // ========================================
    window.addEventListener('resize', () => {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Use passive event listeners where possible
document.addEventListener('scroll', throttle(function() {
    // Handle scroll events with throttling
}, 16)); // ~60fps

document.addEventListener('resize', debounce(function() {
    // Handle resize events with debouncing
}, 250));

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Focus management for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && e.target.closest('.lightbox')) {
        const focusableElements = e.target.closest('.lightbox').querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// ========================================
// ERROR HANDLING
// ========================================

// Global error handler
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ========================================
// BROWSER COMPATIBILITY
// ========================================

// Polyfill for IntersectionObserver (older browsers)
if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    console.warn('IntersectionObserver not supported, using fallback');
    
    // Simple fallback - add aos-animate class to all elements immediately
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            el.classList.add('aos-animate');
        });
    });
}

// ========================================
// DEVELOPMENT HELPERS
// ========================================

// Enable debug mode in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debug = {
        showNotification: (message, type = 'info') => {
            console.log(`[DEBUG ${type.toUpperCase()}]:`, message);
        },
        performance: {
            start: () => performance.now(),
            end: (start) => console.log(`Execution time: ${performance.now() - start}ms`)
        }
    };
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle,
        debounce
    };
}
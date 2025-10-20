       // Smooth scroll for anchor links
       document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add subtle parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.abstract-visual');
        if (parallax) {
            parallax.style.transform = `translateY(${-50 + scrolled * 0.1}%)`;
        }
    });

    // Toggle module expansion
    function toggleModule(moduleNumber) {
        const module = document.querySelector(`.module[data-module="${moduleNumber}"]`);
        if (module) {
            module.classList.toggle('collapsed');
        }
    }

    // Share functionality
    function shareToSlack() {
        const text = "Cursor & Beyond: 3-session sprint to take your AI prototype live, collect feedback, and keep shipping. $500 SF cohort starts Nov 1. 🚀";
        const url = window.location.href;
        // In production, this would integrate with Slack API
        alert('Slack share: ' + text + '\n' + url);
    }

    function shareViaEmail() {
        const subject = "Cursor & Beyond — take your AI prototype live";
        const body = "Hey! Cursor & Beyond is a 3-session sprint to move what you built with AI into production, deploy to your own domain, and add real features. Cohort 1 (SF) starts Nov 1. Check it out: " + window.location.href;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function copyLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const btn = event.target.closest('.share-copy');
            const originalText = btn.querySelector('span').textContent;
            btn.querySelector('span').textContent = '✓ Copied!';
            setTimeout(() => {
                btn.querySelector('span').textContent = originalText;
            }, 2000);
        });
    }

    // Update social ticker with live data (mock for now)
    function updateSocialTicker() {
        const items = document.querySelectorAll('.social-item');
        // In production, this would fetch real data
        const workshopDates = ['Nov 1'];
        const nextDate = workshopDates[Math.floor(Math.random() * workshopDates.length)];
        if (items[1]) {
            items[1].innerHTML = `⚡ Next workshop: ${nextDate}`;
        }
    }

    // Add urgency with countdown
    function addUrgencyCountdown() {
        const badges = document.querySelectorAll('.badge');
        let hours = 47; // Time until price increase
        setInterval(() => {
            hours--;
            if (hours > 0 && badges[0]) {
                // Optional: Add countdown to badge
            }
        }, 3600000); // Update every hour
    }

    // Reserve flow
    /**
     * Handles the Reserve Spot flow:
     * - Prevents default form submit
     * - Validates email from hero or CTA inputs
     * - Gives inline feedback on input errors
     * - Saves valid email to localStorage
     * - Fires tracking event via gtag if available
     * - Shows feedback to user
     * - Opens Stripe Checkout (or fallback redirects)
     */
    function reserveSpot(event) {
        if (event) {
            event.preventDefault();
        }

        const form = event?.target;
        const heroInput = document.querySelector('.hero-input');
        const ctaInput = document.querySelector('.cta-input');
        const sourceInput = form ? form.querySelector('input[type="email"]') : heroInput || ctaInput;
        const email = sourceInput ? sourceInput.value.trim() : '';

        if (!email || !email.includes('@')) {
            if (sourceInput) {
                sourceInput.classList.add('input-error');
                sourceInput.focus();
            }
            return;
        }

        [heroInput, ctaInput].forEach(input => {
            if (input) {
                input.classList.remove('input-error');
                if (!input.value) {
                    input.value = email;
                }
            }
        });

        try {
            localStorage.setItem('vibecoding_pending_email', email);
        } catch (err) {
            console.warn('Email persistence skipped:', err);
        }

        if (typeof gtag === 'function') {
            gtag('event', 'reserve_spot', {
                'event_category': 'conversion',
                'event_label': 'primary_checkout_click'
            });
        }

        showReserveFeedback('Checkout ready. Click OK to continue.');

        alert('Thank you! We will now take you to the payment page.');

        // Replace with production Stripe Checkout link
        const checkoutUrl = 'https://buy.stripe.com/fZuaEW35dctq4PsghgafS01';
        const checkoutWindow = window.open(checkoutUrl, '_blank', 'noopener');
        if (!checkoutWindow) {
            window.location.href = checkoutUrl;
        }
    }

    function focusReserve() {
        const heroSection = document.querySelector('.hero');
        const heroInput = document.querySelector('.hero-input');
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => {
            if (heroInput) {
                heroInput.focus();
            }
        }, 400);
    }

    /**
     * Populates the hero and CTA email input fields with the 
     * email value previously saved in localStorage (if any and if input is empty).
     * This makes it easier for users who return to the page or reload,
     * so they don't have to retype their email address.
     */
    function hydrateEmailFromStorage() {
        try {
            const stored = localStorage.getItem('vibecoding_pending_email');
            if (stored) {
                const heroInput = document.querySelector('.hero-input');
                const ctaInput = document.querySelector('.cta-input');
                [heroInput, ctaInput].forEach(input => {
                    if (input && !input.value) {
                        input.value = stored;
                    }
                });
            }
        } catch (err) {
            console.warn('Email hydration skipped:', err);
        }
    }

    let reserveFeedbackTimer;
    function showReserveFeedback(message) {
        const feedback = document.getElementById('reserve-feedback');
        if (!feedback) return;
        feedback.textContent = message;
        feedback.classList.add('active');
        clearTimeout(reserveFeedbackTimer);
        reserveFeedbackTimer = setTimeout(() => {
            feedback.classList.remove('active');
        }, 6000);
    }

    // Update capacity information
    function updateSeatsLeft() {
        const seatsElement = document.querySelector('.seats-left');
        if (seatsElement) {
            // Keep it static and professional
            seatsElement.textContent = 'Capped at 8 builders';
        }
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        // updateSocialTicker();
        addUrgencyCountdown();
        updateSeatsLeft();
        hydrateEmailFromStorage();
        attachReserveListeners();
        
        // Update seats counter every hour
        setInterval(updateSeatsLeft, 60 * 60 * 1000);
    });

    function attachReserveListeners() {
        const inputs = document.querySelectorAll('.hero-input, .cta-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error');
            });
        });
    }

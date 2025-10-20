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

    // Enrollment and conversion functions
    function enrollNow() {
        // Track conversion event
        gtag && gtag('event', 'enrollment_click', {
            'event_category': 'conversion',
            'event_label': 'enroll_button_click'
        });
        
        // Redirect to booking
        window.location.href = 'mailto:markocalvocruz@gmail.com,theterrytucker@gmail.com?subject=Cursor%20%26%20Beyond%20Enrollment&body=Hi!%20I%E2%80%99d%20like%20to%20join%20the%20Cursor%20%26%20Beyond%20cohort%20starting%20November%201.%0A%0AName:%20[Your%20Name]%0AProject:%20[What%20you%E2%80%99ve%20built%20so%20far]%0AWhat%20I%20want%20to%20ship%20next:%20[Features%20or%20goals]%0A%0AThanks!';
    }

    function showTeamDiscount() {
        alert('Group Pricing Available\n\nTeams of 8 or more participants qualify for volume pricing.\n\nContact us at markocalvocruz@gmail.com with your team size for a customized quote.\n\nEducation budget-friendly options available.');
    }

    function subscribeEmail() {
        const emailInput = document.querySelector('.email-input');
        const submitBtn = document.querySelector('.email-submit');
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            emailInput.style.borderColor = '#EF4444';
            emailInput.focus();
            return;
        }
        
        // Reset border color
        emailInput.style.borderColor = 'var(--gray-300)';
        
        // Update button state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
            submitBtn.textContent = '✓ Subscribed!';
            submitBtn.style.background = '#10B981';
            emailInput.value = '';
            
            // Track subscription
            gtag && gtag('event', 'email_subscribe', {
                'event_category': 'lead_generation',
                'event_label': 'newsletter_signup'
            });
            
            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--secondary)';
                submitBtn.disabled = false;
            }, 3000);
        }, 1000);
        
        // In production, send to your email service:
        // fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({email: email})
        // });
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
        
        // Update seats counter every hour
        setInterval(updateSeatsLeft, 60 * 60 * 1000);
    });

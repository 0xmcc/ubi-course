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
        const text = "Found this amazing AI workshop for design teams. They show you how to turn Figma mocks into React apps with no coding! 🚀";
        const url = window.location.href;
        // In production, this would integrate with Slack API
        alert('Slack share: ' + text + '\n' + url);
    }

    function shareViaEmail() {
        const subject = "You need to see this AI workshop";
        const body = "Hey! I found this workshop that teaches design teams how to use AI tools like Cursor and Claude Code. Teams are shipping 2x faster after taking it. Check it out: " + window.location.href;
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
        const workshopDates = ['Sept 24', 'Oct 8', 'Oct 15'];
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
        window.location.href = 'mailto:markocalvocruz@gmail.com,theterrytucker@gmail.com?subject=Q4 UBI Workshop Enrollment - [Your Company Name]&body=Hi! We\'d like to enroll our team in the Q4 UBI Workshop.%0A%0ATeam size: [X] people%0APreferred date: [October 15 / November 12 / December 3]%0AFormat preference: [In-person SF Bay Area / Virtual]%0A%0APlease send us the enrollment details and next steps.%0A%0AThanks!';
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
            seatsElement.textContent = 'Limited to 12 participants';
        }
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        updateSocialTicker();
        addUrgencyCountdown();
        updateSeatsLeft();
        
        // Update seats counter every hour
        setInterval(updateSeatsLeft, 60 * 60 * 1000);
    });
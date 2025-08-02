// Language toggle functionality
let currentLanguage = 'es';

document.getElementById('toggleLanguage').addEventListener('click', function() {
    if (currentLanguage === 'es') {
        switchLanguage('en');
        this.textContent = 'Español';
    } else {
        switchLanguage('es');
        this.textContent = 'English';
    }
});

function switchLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-en]');
    
    elements.forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Update options in select elements
    document.querySelectorAll('option').forEach(option => {
        if (option.hasAttribute(`data-${lang}`)) {
            option.textContent = option.getAttribute(`data-${lang}`);
        }
    });
    
    // Handle placeholders for inputs
    document.querySelectorAll('input[placeholder]').forEach(input => {
        if (input.hasAttribute(`data-placeholder-${lang}`)) {
            input.placeholder = input.getAttribute(`data-placeholder-${lang}`);
        }
    });

    // Update map button text
    const mapWrapper = document.querySelector('.map-wrapper');
    const toggleMapBtn = document.querySelector('.toggle-map');
    
    if (toggleMapBtn && mapWrapper) {
        const isCollapsed = mapWrapper.classList.contains('collapsed');
        updateMapToggleText(toggleMapBtn, isCollapsed);
    }

    updateCountdown();
}

// Countdown timer
const eventDate = new Date('August 24, 2025 18:30:00');
let countdownInterval;

function updateCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
        countdownEl.textContent = currentLanguage === 'en' ?
            'The party has started!' : '¡La fiesta ha comenzado!';
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (currentLanguage === 'en') {
        countdownEl.textContent = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    } else {
        countdownEl.textContent = `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
});

// Modify your form submission code
document.getElementById('rsvpForm').addEventListener('submit', function(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // If we're returning from success, show success message
    if (window.location.search.includes('success=true')) {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('rsvpForm').style.display = 'none';
        launchConfetti();
        launchBalloons();
    } else {
        // For initial form submission
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.textContent = currentLanguage === 'en' ? 'Submitting...' : 'Enviando...';
        submitButton.disabled = true;
        
        // Save local backup
        try {
            const formData = {
                name: document.getElementById('name').value,
                attendance: document.querySelector('input[name="attendance"]:checked').value,
                guests: document.getElementById('guests').value,
                allergies: document.getElementById('allergies')?.value || "",
                message: document.getElementById('message')?.value || ""
            };
            saveResponseLocally(formData);
        } catch (e) {
            console.error('Error saving backup:', e);
        }
        
        // Show success message and animations immediately
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('rsvpForm').style.display = 'none';
        launchConfetti();
        launchBalloons();
        
        // Submit the form in the background
        const formEl = this;
        setTimeout(function() {
            // Create a copy of the form data
            const formData = new FormData(formEl);
            
            // Submit via fetch to avoid page navigation
            fetch(formEl.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Prevent CORS errors
            }).catch(error => {
                console.log('Form submitted in background, any errors can be ignored');
            });
            
            // Also update URL to include success=true
            if (history.pushState) {
                const newurl = window.location.protocol + "//" + 
                      window.location.host + 
                      window.location.pathname + 
                      '?success=true';
                window.history.pushState({path: newurl}, '', newurl);
            }
        }, 1000); // Small delay to ensure animations start first
    }
});

// Check for success parameter on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with 1 guest
    generateGuestFields(1);
    
    // Check for success parameter
    if (window.location.search.includes('success=true')) {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('rsvpForm').style.display = 'none';
        launchConfetti();
        launchBalloons();
    }
    
    // Set up map toggle - THIS IS THE ONLY INSTANCE OF THIS CODE
    const toggleMapBtn = document.querySelector('.toggle-map');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (toggleMapBtn && mapWrapper) {
        // Check if map should start collapsed (e.g., on mobile)
        if (window.innerWidth < 768) {
            mapWrapper.classList.add('collapsed');
            updateMapToggleText(toggleMapBtn, true);
        }
        
        toggleMapBtn.addEventListener('click', function() {
            mapWrapper.classList.toggle('collapsed');
            const isCollapsed = mapWrapper.classList.contains('collapsed');
            updateMapToggleText(toggleMapBtn, isCollapsed);
        });
    }
    
    // Rest of your initialization code...
});

// Helper function for updating toggle button text
function updateMapToggleText(button, isCollapsed) {
    if (currentLanguage === 'en') {
        button.textContent = isCollapsed ? 'Show Map' : 'Hide Map';
    } else {
        button.textContent = isCollapsed ? 'Mostrar mapa' : 'Ocultar mapa';
    }
}

// Show/hide number of guests based on attendance
document.querySelectorAll('input[name="attendance"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        // Get all form sections that should be hidden/shown based on attendance
        const formSections = [
            document.getElementById('guests').parentElement,
            document.getElementById('guestDetailsContainer'),
            document.getElementById('allergies').parentElement
            // REMOVED: Kids-related form sections
        ];
        
        if (this.value === 'yes') {
            // Show all sections
            formSections.forEach(section => {
                if (section) section.style.display = 'block';
            });
        } else {
            // Hide all sections
            formSections.forEach(section => {
                if (section) section.style.display = 'none';
            });
            
            // Pre-fill hidden required fields with default values
            document.getElementById('guests').value = "1";
            
            // Also fill in any guest details fields
            if (document.getElementById('guestName1')) {
                document.getElementById('guestName1').value = document.getElementById('name').value || "";
            }
            
            if (document.getElementById('guestMeal1')) {
                document.getElementById('guestMeal1').value = "vegetarian"; // Default value
            }
            
            // REMOVED: Kids count setting
        }
    });
});

// Handle dynamic guest details generation
document.getElementById('guests').addEventListener('change', function() {
    generateGuestFields(parseInt(this.value) || 1);

    // Apply language to new elements
    if (currentLanguage !== 'es') {
        switchLanguage(currentLanguage);
    }
});

function generateGuestFields(count) {
    const container = document.getElementById('guestDetailsContainer');
    container.innerHTML = ''; // Clear existing fields
    
    // Generate fields for each guest
    for (let i = 1; i <= count; i++) {
        const guestDiv = document.createElement('div');
        guestDiv.className = 'guest-detail';
        guestDiv.dataset.guestIndex = i;
        
        const title = i === 1 ?
            `<h4 data-en="Guest ${i} (you)" data-es="Invitado ${i} (tú)">Invitado ${i} (tú)</h4>` :
            `<h4 data-en="Guest ${i}" data-es="Invitado ${i}">Invitado ${i}</h4>`;

        guestDiv.innerHTML = `
            ${title}
            <div class="form-group">
                <label for="guestName${i}" data-en="Name:" data-es="Nombre:">Nombre:</label>
                <input type="text" id="guestName${i}" name="guestName${i}" required>
            </div>
            <div class="form-group">
                <label for="guestMeal${i}" data-en="Meal Preference:" data-es="Preferencia de comida:">Preferencia de comida:</label>
                <select id="guestMeal${i}" name="guestMeal${i}">
                    <option value="" data-en="-- Please select --" data-es="-- Por favor selecciona --">-- Por favor selecciona --</option>
                    <option value="standard" data-en="🔴 Non-Veg (Chicken/Mutton)" data-es="🔴 No vegetariano (Pollo/Cordero)">🔴 No vegetariano (Pollo/Cordero)</option>
                    <option value="vegetarian" data-en="🟢 Vegetarian" data-es="🟢 Vegetariano">🟢 Vegetariano</option>
                </select>
            </div>
        `;
        
        container.appendChild(guestDiv);
    }
}

// Auto-fill Guest 1 name from main name field
let guestName1ManuallyEdited = false;

document.getElementById('name').addEventListener('input', function() {
    if (!guestName1ManuallyEdited && document.getElementById('guestName1')) {
        document.getElementById('guestName1').value = this.value;
    }
});

document.getElementById('guestDetailsContainer').addEventListener('input', function(event) {
    if (event.target && event.target.id === 'guestName1') {
        guestName1ManuallyEdited = event.target.value !== document.getElementById('name').value;
    }
});

// Animation functions
function launchConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#FF61A6', '#7B5BE6', '#FFD166', '#06D6A0', '#118AB2'];
    
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'absolute';
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = Math.random() + 0.5;
        
        confettiContainer.appendChild(confetti);
        
        confetti.animate([
            { transform: `translateY(-10px) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${360 * Math.random()}deg)`, opacity: 0.3 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.37, 1.04, 0.68, 0.98)',
            fill: 'forwards'
        }).onfinish = () => confetti.remove();
    }
}

function launchBalloons() {
    const balloonContainer = document.getElementById('balloon-container');
    const balloonEmojis = ['🎈', '🎈', '🎈', '🎀', '🎁', '🎉', '🎊', '🦄', '🧸'];
    
    balloonContainer.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
            balloon.style.fontSize = Math.random() * 20 + 30 + 'px';
            balloon.style.left = Math.random() * 90 + 5 + 'vw';
            balloon.style.bottom = '0';
            
            balloonContainer.appendChild(balloon);
            
            balloon.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                { transform: 'translateY(-20vh) rotate(-5deg)', opacity: 1, offset: 0.2 },
                { transform: 'translateY(-100vh) rotate(5deg)', opacity: 0.7 }
            ], {
                duration: Math.random() * 10000 + 10000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => balloon.remove();
        }, i * 500);
    }
}

// Initialize the form and animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with 1 guest
    generateGuestFields(1);
    
    // Animate in the form fields
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
    
    // Launch animations for initial display
    setTimeout(() => {
        launchConfetti();
        launchBalloons();
    }, 1000);
    
    // Setup auto-fill for guest name
    if (document.getElementById('guestName1') && document.getElementById('name')) {
        document.getElementById('guestName1').value = document.getElementById('name').value;
    }
});

// Store responses locally as backup
function saveResponseLocally(formData) {
    try {
        const existingResponses = JSON.parse(localStorage.getItem('birthdayRSVPs') || '[]');
        existingResponses.push({
            data: formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('birthdayRSVPs', JSON.stringify(existingResponses));
    } catch (e) {
        console.error('Could not save to local storage:', e);
    }
};

// Add this to your DOMContentLoaded event or at the beginning of your script
document.addEventListener('DOMContentLoaded', function() {
    // Video loading prioritization
    const video = document.getElementById('birthdayVideo');
    const fallbackContainer = document.getElementById('fallbackContainer');
    let videoLoaded = false;
    
    // Track if video can play through
    video.addEventListener('canplaythrough', function() {
        videoLoaded = true;
        // Hide fallback once video is ready
        if (fallbackContainer.style.display !== 'none') {
            fallbackContainer.style.display = 'none';
        }
    });
    
    // Handle video errors
    video.addEventListener('error', function() {
        console.log("Video error encountered");
        showFallback();
    });
    
    // Add timeout for slow connections
    const videoTimeout = setTimeout(function() {
        if (!videoLoaded) {
            console.log("Video loading timed out");
            showFallback();
        }
    }, 5000); // 5 second timeout
    
    // Add suspending event listener
    video.addEventListener('suspend', function() {
        // Sometimes suspend is normal, only show fallback if no data loaded
        if (video.readyState < 2 && !videoLoaded) {
            showFallback();
        }
    });
    
    function showFallback() {
        video.style.display = 'none';
        fallbackContainer.style.display = 'block';
    }
    
    // Force video load with play attempt
    var playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(function(error) {
            console.log("Autoplay prevented:", error);
            // Show play button or fallback on autoplay prevention
            if (error.name === 'NotAllowedError') {
                // Show a custom play button on top of video
                const playButton = document.createElement('button');
                playButton.innerHTML = '▶️';
                playButton.className = 'video-play-button';
                playButton.addEventListener('click', function() {
                    video.play();
                    this.remove();
                });
                video.parentNode.appendChild(playButton);
            }
        });
    }
    
    // Existing code below...
});

// Add this to your DOMContentLoaded event or at the end of your script
document.addEventListener('DOMContentLoaded', function() {
    // Video fallback handling
    const video = document.getElementById('birthdayVideo');
    const fallback = document.getElementById('videoFallback');
    
    // Function to check connection speed
    function checkConnectionSpeed() {
        // For very basic speed detection
        const connection = navigator.connection || 
                           navigator.mozConnection || 
                           navigator.webkitConnection;
        
        if (connection && (connection.downlink < 1.5 || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            console.log("Slow connection detected, using GIF");
            return false;
        }
        
        return true;
    }
    
    // Check if video can be played
    const videoPromise = video.play();
    
    if (videoPromise !== undefined && checkConnectionSpeed()) {
        videoPromise
            .then(() => {
                // Video can play, so hide fallback and show video
                fallback.style.display = 'none';
                video.style.display = 'block';
            })
            .catch(error => {
                // Video couldn't play, keep showing the GIF
                console.log("Video playback prevented:", error);
            });
    }
});
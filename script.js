// Language toggle functionality
let currentLanguage = 'en';

document.getElementById('toggleLanguage').addEventListener('click', function() {
    if (currentLanguage === 'en') {
        switchLanguage('hi');
        this.textContent = 'English';
    } else {
        switchLanguage('en');
        this.textContent = 'हिंदी';
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

    // Additional code for map button text
    const mapWrapper = document.querySelector('.map-wrapper');
    const toggleMapBtn = document.querySelector('.toggle-map');
    
    if (toggleMapBtn && mapWrapper) {
        const isCollapsed = mapWrapper.classList.contains('collapsed');
        if (lang === 'en') {
            toggleMapBtn.textContent = isCollapsed ? 'Show Map' : 'Hide Map';
        } else {
            toggleMapBtn.textContent = isCollapsed ? 'मानचित्र दिखाएं' : 'मानचित्र छिपाएं';
        }
    }
}

// Form submission handling
document.getElementById('rsvpForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const isAttending = document.getElementById('attend-yes').checked;
    
    // If not attending, set default values for all required fields
    if (!isAttending) {
        // Ensure guest details have valid values
        const guestCount = 1;
        
        // Make sure at least one guest has a name
        if (document.getElementById('guestName1') && !document.getElementById('guestName1').value) {
            document.getElementById('guestName1').value = document.getElementById('name').value || "Not Attending";
        }
        
        // Make sure meal preference is selected
        if (document.getElementById('guestMeal1') && !document.getElementById('guestMeal1').value) {
            document.getElementById('guestMeal1').value = "vegetarian";
        }
    }
    
    // Continue with the existing form processing...
    // Collect all guest data
    const guestCount = parseInt(document.getElementById('guests').value) || 1;
    const guests = [];
    
    for (let i = 1; i <= guestCount; i++) {
        guests.push({
            name: document.getElementById(`guestName${i}`).value || "Not Attending",
            meal: document.getElementById(`guestMeal${i}`).value || "vegetarian"
        });
    }
    
    // Collect all kid data
    const kidCount = parseInt(document.getElementById('kidsCount').value) || 0;
    const kids = [];
    
    for (let i = 1; i <= kidCount; i++) {
        if (document.getElementById(`kidName${i}`)) {
            kids.push({
                name: document.getElementById(`kidName${i}`).value,
                age: document.getElementById(`kidAge${i}`).value,
                likes: document.getElementById(`kidLikes${i}`).value
            });
        }
    }
    
    // Get form data
    const formData = new FormData(this);
    
    // Add serialized guest and kids data (JSON stringified)
    formData.append('guestsData', JSON.stringify(guests));
    formData.append('kidsData', JSON.stringify(kids));
    
    // Console log for debugging
    console.log('Submitting form with:');
    console.log('Guests:', guests);
    console.log('Kids:', kids);
    
    // IMPORTANT: Replace with your actual Google Form ID
    const formId = '1FAIpQLSewjAHSlMdFghcsWMj0k9WO6iD4dt7GhFtaADvpkyGlEdVmjQ';
    const googleFormUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    
    // IMPORTANT: Replace with your actual entry IDs from Google Form
    const data = new URLSearchParams();
    data.append('entry.559352220', formData.get('name'));
    data.append('entry.877086558', formData.get('attendance'));
    data.append('entry.924523986', formData.get('guests'));
    data.append('entry.160349664', JSON.stringify(guests)); // Send guest details as JSON
    data.append('entry.1260685378', formData.get('allergies'));
    data.append('entry.443565211', formData.get('message'));
    data.append('entry.186230675', formData.get('kidsCount')); // Add number of kids
    data.append('entry.1751303409', JSON.stringify(kids)); // Send kids details as JSON
    
    // Send data to Google Forms
    sendToGoogleForms(googleFormUrl, data);
    
    // Show success message
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('rsvpForm').style.display = 'none';
    
    // Launch animations
    launchConfetti();
    launchBalloons();
    
    // Log form field values
    console.log('Form data being submitted:');
    console.log('Name:', document.getElementById('name').value);
    console.log('Attendance:', document.querySelector('input[name="attendance"]:checked')?.value);
    console.log('Guests:', document.getElementById('guests').value);
    console.log('Meal:', document.getElementById('meal').value);
    console.log('Allergies:', document.getElementById('allergies').value);
    console.log('Message:', document.getElementById('message').value);
});

function sendToGoogleForms(url, data) {
    // Method 1: Using fetch API (subject to CORS issues)
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).catch(err => console.error('Error submitting form:', err));
    
    // Method 2: Using hidden iframe (more reliable for Google Forms)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = 'hidden-iframe';
    
    // Convert URLSearchParams to form fields
    for (const [key, value] of data.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    }
    
    document.body.appendChild(form);
    iframe.name = 'hidden-iframe';
    form.submit();
    
    // Clean up after submission
    setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
    }, 2000);
}

// Show/hide number of guests based on attendance
document.querySelectorAll('input[name="attendance"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        // Get all form sections that should be hidden/shown based on attendance
        const formSections = [
            document.getElementById('guests').parentElement,
            document.getElementById('guestDetailsContainer'),
            document.getElementById('kidsCount').parentElement,
            document.getElementById('kidsDetailsContainer'),
            document.getElementById('allergies').parentElement
            // document.getElementById('message').parentElement
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
                document.getElementById('guestName1').value = document.getElementById('name').value || "Not Attending";
            }
            
            if (document.getElementById('guestMeal1')) {
                document.getElementById('guestMeal1').value = "vegetarian"; // Default value
            }
            
            // Set kids count to 0
            document.getElementById('kidsCount').value = "0";
        }
    });
});

// Add this after your existing guest count change handler

// Handle dynamic guest details generation
document.getElementById('guests').addEventListener('change', function() {
    generateGuestFields(parseInt(this.value) || 1);
    
    // Apply language to new elements
    if (currentLanguage !== 'en') {
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
            `<h4 data-en="Guest ${i} (you)" data-hi="अतिथि ${i} (आप)">Guest ${i} (you)</h4>` : 
            `<h4 data-en="Guest ${i}" data-hi="अतिथि ${i}">Guest ${i}</h4>`;
        
        guestDiv.innerHTML = `
            ${title}
            <div class="form-group">
                <label for="guestName${i}" data-en="Name:" data-hi="नाम:">Name:</label>
                <input type="text" id="guestName${i}" name="guestName${i}" required>
            </div>
            <div class="form-group">
                <label for="guestMeal${i}" data-en="Meal Preference:" data-hi="भोजन प्राथमिकता:">Meal Preference:</label>
                <select id="guestMeal${i}" name="guestMeal${i}">
                    <option value="" data-en="-- Please select --" data-hi="-- कृपया चुनें --">-- Please select --</option>
                    <option value="standard" data-en="🔴 Non-Veg (Chicken/Mutton)" data-hi="🔴 नॉन-वेज (चिकन/मटन)">🔴 Non-Veg (Chicken/Mutton)</option>
                    <option value="vegetarian" data-en="🟢 Vegetarian" data-hi="🟢 शाकाहारी">🟢 Vegetarian</option>
                </select>
            </div>
        `;
        
        container.appendChild(guestDiv);
    }
}

// Handle kids details generation
document.getElementById('kidsCount').addEventListener('change', function() {
    const count = parseInt(this.value) || 0;
    generateKidsFields(count);
    
    // Show or hide the kids container
    const kidsContainer = document.getElementById('kidsDetailsContainer');
    kidsContainer.style.display = count > 0 ? 'block' : 'none';
    
    // Apply language to new elements
    if (currentLanguage !== 'en') {
        switchLanguage(currentLanguage);
    }
});

function generateKidsFields(count) {
    const container = document.getElementById('kidsDetailsContainer');
    container.innerHTML = ''; // Clear existing fields
    
    if (count <= 0) return;
    
    // Add title for kids section
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `
        <h3 data-en="Kids Details" data-hi="बच्चों का विवरण">Kids Details</h3>
        <p data-en="Please provide details for the special surprise!" data-hi="कृपया विशेष आश्चर्य के लिए विवरण प्रदान करें!">
            Please provide details for the special surprise!
        </p>
    `;
    container.appendChild(titleDiv);
    
    // Generate fields for each kid
    for (let i = 1; i <= count; i++) {
        const kidDiv = document.createElement('div');
        kidDiv.className = 'kid-detail';
        kidDiv.dataset.kidIndex = i;
        
        kidDiv.innerHTML = `
            <h4 data-en="Kid ${i}" data-hi="बच्चा ${i}">Kid ${i}</h4>
            <div class="form-group">
                <label for="kidName${i}" data-en="Name:" data-hi="नाम:">Name:</label>
                <input type="text" id="kidName${i}" name="kidName${i}" required>
            </div>
            <div class="form-group">
                <label for="kidAge${i}" data-en="Age:" data-hi="उम्र:">Age:</label>
                <input type="number" id="kidAge${i}" name="kidAge${i}" min="1" max="10" required>
            </div>
            <div class="form-group">
                <label for="kidLikes${i}" data-en="Favorite character/toy:" data-hi="पसंदीदा किरदार/खिलौना:">Favorite character/toy:</label>
                <input type="text" id="kidLikes${i}" name="kidLikes${i}" placeholder="Princess, Spiderman, Cars...">
            </div>
        `;
        
        container.appendChild(kidDiv);
    }
}

// Initialize the form on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with 1 guest
    generateGuestFields(1);
    
    // Check if kids count is > 0
    const kidsCount = parseInt(document.getElementById('kidsCount').value) || 0;
    if (kidsCount > 0) {
        generateKidsFields(kidsCount);
        document.getElementById('kidsDetailsContainer').style.display = 'block';
    }
    
    // Rest of your existing DOMContentLoaded code...
});

// Add this code to synchronize the main name field with Guest 1 name field

// Variable to track if user has manually edited the guest name
let guestName1ManuallyEdited = false;

// Listen for input on the main name field
document.getElementById('name').addEventListener('input', function() {
    // Only auto-fill if user hasn't manually edited the guest name field
    if (!guestName1ManuallyEdited && document.getElementById('guestName1')) {
        document.getElementById('guestName1').value = this.value;
    }
});

// Track if user manually edits the guest name field
document.getElementById('guestDetailsContainer').addEventListener('input', function(event) {
    if (event.target && event.target.id === 'guestName1') {
        // If values are different, mark as manually edited
        if (event.target.value !== document.getElementById('name').value) {
            guestName1ManuallyEdited = true;
        } 
        // If user makes it match again, allow auto-syncing again
        else {
            guestName1ManuallyEdited = false;
        }
    }
});

// Reset manual edit flag when generating new guest fields
const originalGenerateGuestFields = generateGuestFields;
generateGuestFields = function(count) {
    // Call the original function
    originalGenerateGuestFields(count);
    
    // Reset the flag and sync the name again
    guestName1ManuallyEdited = false;
    
    // Set Guest 1 name to main name if available
    if (document.getElementById('guestName1') && document.getElementById('name')) {
        document.getElementById('guestName1').value = document.getElementById('name').value;
    }
};

// Sync the name field when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add this to your existing DOMContentLoaded handler
    if (document.getElementById('guestName1') && document.getElementById('name')) {
        document.getElementById('guestName1').value = document.getElementById('name').value;
    }
});

function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confettiContainer.appendChild(confetti);
    }
}

function createBalloons() {
    const balloonContainer = document.getElementById('balloon-container');
    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDelay = `${Math.random() * 5}s`;
        balloonContainer.appendChild(balloon);
    }
}

window.onload = function() {
    createConfetti();
    createBalloons();
};

// Confetti celebration animation
function launchConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#FF61A6', '#7B5BE6', '#FFD166', '#06D6A0', '#118AB2'];
    
    // Clear any existing confetti
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
        
        // Use standard animations with fallbacks for broader compatibility
        const startY = -10;
        const endY = window.innerHeight;
        const startRotation = 0;
        const endRotation = 360 * Math.random();
        const duration = Math.random() * 3000 + 2000;
        
        // Apply keyframe animation with JavaScript for better browser support
        confetti.animate([
            { transform: `translateY(${startY}px) rotate(${startRotation}deg)`, opacity: 1 },
            { transform: `translateY(${endY}px) rotate(${endRotation}deg)`, opacity: 0.3 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.37, 1.04, 0.68, 0.98)',
            fill: 'forwards'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Floating balloon animation - FIXED
function launchBalloons() {
    const balloonContainer = document.getElementById('balloon-container');
    const balloonEmojis = ['🎈', '🎈', '🎈', '🎀', '🎁', '🎉', '🎊', '🦄', '🧸'];
    
    // Clear any existing balloons
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
            
            // Create more reliable animation
            balloon.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                { transform: 'translateY(-20vh) rotate(-5deg)', opacity: 1, offset: 0.2 },
                { transform: 'translateY(-100vh) rotate(5deg)', opacity: 0.7 }
            ], {
                duration: Math.random() * 10000 + 10000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => {
                balloon.remove();
            };
        }, i * 500);
    }
}

// Add some animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Test animations on page load (remove in production)
    setTimeout(() => {
        launchConfetti(); // Launch a few confetti for testing
        launchBalloons(); // Launch a few balloons for testing
    }, 1000);
    
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
});

// Function to test animations (you can remove this for production)
function testAnimations() {
    launchConfetti();
    launchBalloons();
}

// Add a test button event listener
document.getElementById('testAnimations').addEventListener('click', function() {
    launchConfetti();
    launchBalloons();
});

// Add this to your existing script.js file

// Map toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleMapBtn = document.querySelector('.toggle-map');
    const mapWrapper = document.querySelector('.map-wrapper');
    
    if (toggleMapBtn && mapWrapper) {
        toggleMapBtn.addEventListener('click', function() {
            mapWrapper.classList.toggle('collapsed');
            
            // Update button text based on map state and current language
            const isCollapsed = mapWrapper.classList.contains('collapsed');
            if (currentLanguage === 'en') {
                this.textContent = isCollapsed ? 'Show Map' : 'Hide Map';
            } else {
                this.textContent = isCollapsed ? 'मानचित्र दिखाएं' : 'मानचित्र छिपाएं';
            }
        });
    }
});

// Update the existing switchLanguage function to handle map button text
const originalSwitchLanguage = switchLanguage;
switchLanguage = function(lang) {
    // Call the original function first
    originalSwitchLanguage(lang);
    
    // Additional code for map button text
    const mapWrapper = document.querySelector('.map-wrapper');
    const toggleMapBtn = document.querySelector('.toggle-map');
    
    if (toggleMapBtn && mapWrapper) {
        const isCollapsed = mapWrapper.classList.contains('collapsed');
        if (lang === 'en') {
            toggleMapBtn.textContent = isCollapsed ? 'Show Map' : 'Hide Map';
        } else {
            toggleMapBtn.textContent = isCollapsed ? 'मानचित्र दिखाएं' : 'मानचित्र छिपाएं';
        }
    }
};

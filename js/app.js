// ============================================
// SHORE SQUAD - Main Application
// ============================================

class ShoreSquad {
    constructor() {
        this.crew = JSON.parse(localStorage.getItem('shoreSquadCrew')) || [];
        this.cleanups = this.initializeCleanups();
        this.userLocation = null;
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderCleanups();
        this.updateCrewStats();
        this.requestGeolocation();
        this.setupAccessibility();
    }

    cacheDOM() {
        // Modal
        this.joinModal = document.getElementById('joinModal');
        this.joinForm = document.getElementById('joinForm');
        this.modalClose = document.querySelector('.modal-close');

        // Buttons
        this.joinBtn = document.getElementById('joinBtn');
        this.heroBtn = document.getElementById('heroBtn');
        this.ctaBtn = document.getElementById('ctaBtn');

        // Map controls
        this.locateBtn = document.getElementById('locateBtn');
        this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');

        // Content containers
        this.cleanupsGrid = document.getElementById('cleanupsGrid');
        this.crewMembers = document.getElementById('crewMembers');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // Stats
        this.crewCount = document.getElementById('crewCount');
        this.cleanupCount = document.getElementById('cleanupCount');
        this.trashCount = document.getElementById('trashCount');
    }

    bindEvents() {
        // Modal events
        this.joinBtn.addEventListener('click', () => this.openModal());
        this.heroBtn.addEventListener('click', () => this.scrollToSection('cleanups'));
        this.ctaBtn.addEventListener('click', () => this.openModal());
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.joinForm.addEventListener('submit', (e) => this.handleJoin(e));

        // Map controls
        this.locateBtn.addEventListener('click', () => this.locateUser());
        this.zoomInBtn.addEventListener('click', () => this.zoomMap(true));
        this.zoomOutBtn.addEventListener('click', () => this.zoomMap(false));

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterCleanups(e.target.dataset.filter));
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.joinModal) {
                this.closeModal();
            }
        });
    }

    // ============================================
    // MODAL MANAGEMENT
    // ============================================

    openModal() {
        this.joinModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.joinModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    handleJoin(e) {
        e.preventDefault();
        
        const formData = new FormData(this.joinForm);
        const name = this.joinForm.querySelector('input[type="text"]').value;
        const email = this.joinForm.querySelector('input[type="email"]').value;
        const motivation = this.joinForm.querySelector('textarea').value;

        const newMember = {
            id: Date.now(),
            name,
            email,
            motivation,
            joinedDate: new Date().toLocaleDateString(),
            cleanupsAttended: 0
        };

        this.crew.push(newMember);
        localStorage.setItem('shoreSquadCrew', JSON.stringify(this.crew));

        // Show success message
        this.showNotification(`Welcome to ShoreSquad, ${name}! 🌊`);
        
        this.joinForm.reset();
        this.closeModal();
        this.updateCrewStats();
        this.renderCrewMembers();
    }

    // ============================================
    // CLEANUP MANAGEMENT
    // ============================================

    initializeCleanups() {
        return [
            {
                id: 1,
                name: 'Bondi Beach Cleanup',
                location: 'Bondi Beach, Sydney',
                date: '2025-12-15',
                time: '09:00',
                crew: 24,
                difficulty: 'Easy',
                description: 'Join us for our weekly beach cleanup session!'
            },
            {
                id: 2,
                name: 'Collaroy Point Restoration',
                location: 'Collaroy Point, Sydney',
                date: '2025-12-20',
                time: '14:00',
                crew: 18,
                difficulty: 'Moderate',
                description: 'Tackle the rocks and restore marine habitats'
            },
            {
                id: 3,
                name: 'Manly Beach Community Drive',
                location: 'Manly Beach, Sydney',
                date: '2025-12-22',
                time: '10:00',
                crew: 32,
                difficulty: 'Easy',
                description: 'Festive season beach cleanup with the squad!'
            },
            {
                id: 4,
                name: 'Palm Beach Extended Clean',
                location: 'Palm Beach, Sydney',
                date: '2025-12-28',
                time: '08:00',
                crew: 15,
                difficulty: 'Hard',
                description: 'Early morning deep clean for committed crew members'
            },
            {
                id: 5,
                name: 'Shelly Beach Marine Zone',
                location: 'Shelly Beach, Sydney',
                date: '2026-01-05',
                time: '15:00',
                crew: 12,
                difficulty: 'Moderate',
                description: 'Marine protection focused cleanup dive'
            },
            {
                id: 6,
                name: 'Cronulla Beach Squad Session',
                location: 'Cronulla Beach, Sydney',
                date: '2026-01-12',
                time: '09:30',
                crew: 20,
                difficulty: 'Easy',
                description: 'Casual crew session with food after!'
            }
        ];
    }

    renderCleanups(filter = 'all') {
        this.cleanupsGrid.innerHTML = '';

        let filteredCleanups = this.cleanups;

        if (filter === 'this-week') {
            filteredCleanups = this.cleanups.filter(c => this.isThisWeek(c.date));
        } else if (filter === 'this-month') {
            filteredCleanups = this.cleanups.filter(c => this.isThisMonth(c.date));
        } else if (filter === 'my-crew') {
            filteredCleanups = this.cleanups.filter((_, i) => i % 2 === 0); // Demo filter
        }

        if (filteredCleanups.length === 0) {
            this.cleanupsGrid.innerHTML = '<p class="placeholder">No cleanups found for this filter.</p>';
            return;
        }

        filteredCleanups.forEach(cleanup => {
            const card = this.createCleanupCard(cleanup);
            this.cleanupsGrid.appendChild(card);
        });
    }

    createCleanupCard(cleanup) {
        const card = document.createElement('div');
        card.className = 'cleanup-card';
        
        const formattedDate = new Date(cleanup.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        card.innerHTML = `
            <span class="cleanup-card-date">${formattedDate}</span>
            <h3>${cleanup.name}</h3>
            <p class="cleanup-card-location">📍 ${cleanup.location}</p>
            <p>${cleanup.description}</p>
            <div class="cleanup-card-crew">
                👥 ${cleanup.crew} crew members
            </div>
            <p><strong>Difficulty:</strong> ${cleanup.difficulty}</p>
            <p><strong>Time:</strong> ${cleanup.time}</p>
            <button class="cleanup-card-btn" data-cleanup-id="${cleanup.id}">
                Join This Cleanup
            </button>
        `;

        card.querySelector('.cleanup-card-btn').addEventListener('click', () => {
            this.joinCleanup(cleanup);
        });

        return card;
    }

    joinCleanup(cleanup) {
        if (this.crew.length === 0) {
            this.showNotification('Please join ShoreSquad first!');
            this.openModal();
            return;
        }

        cleanup.crew++;
        this.showNotification(`You've joined "${cleanup.name}"! 🏄‍♂️`);
        this.updateCrewStats();
    }

    filterCleanups(filter) {
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.renderCleanups(filter);
    }

    // ============================================
    // GEOLOCATION & MAP
    // ============================================

    requestGeolocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.fetchWeather();
                    this.showNotification('📍 Location detected!');
                },
                () => {
                    console.log('Geolocation not enabled. Using default location.');
                    this.fetchWeather('Sydney');
                }
            );
        }
    }

    locateUser() {
        if (this.userLocation) {
            this.showNotification(`📍 You're at: ${this.userLocation.lat.toFixed(2)}, ${this.userLocation.lng.toFixed(2)}`);
        } else {
            this.requestGeolocation();
        }
    }

    zoomMap(zoomIn) {
        const action = zoomIn ? 'zoomed in' : 'zoomed out';
        this.showNotification(`Map ${action} 🗺️`);
    }

    // ============================================
    // WEATHER API
    // ============================================

    fetchWeather(location = 'Sydney') {
        // Simulated weather data (replace with real API call)
        const weatherData = {
            temp: 24,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            uvIndex: 6
        };

        this.displayWeather(weatherData);
    }

    displayWeather(data) {
        this.weatherInfo.innerHTML = `
            <div style="color: white;">
                <h3 style="margin-bottom: 1rem;">☀️ Beach Conditions</h3>
                <p><strong>Temperature:</strong> ${data.temp}°C</p>
                <p><strong>Condition:</strong> ${data.condition}</p>
                <p><strong>Humidity:</strong> ${data.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.windSpeed} km/h</p>
                <p><strong>UV Index:</strong> ${data.uvIndex} (High)</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.9;">💡 Remember sunscreen and hydration!</p>
            </div>
        `;
    }

    // ============================================
    // CREW MANAGEMENT
    // ============================================

    updateCrewStats() {
        this.crewCount.textContent = this.crew.length;
        this.cleanupCount.textContent = this.crew.reduce((sum, m) => sum + m.cleanupsAttended, 0);
        this.trashCount.textContent = (this.crew.length * 12).toString(); // Demo calculation
    }

    renderCrewMembers() {
        if (this.crew.length === 0) {
            this.crewMembers.innerHTML = '<p class="placeholder">No crew members yet. Invite your friends!</p>';
            return;
        }

        this.crewMembers.innerHTML = this.crew.map(member => `
            <div class="crew-member" style="
                background: linear-gradient(135deg, #0077BE, #00a8ff);
                color: white;
                padding: 1rem;
                margin: 0.5rem 0;
                border-radius: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <strong>${member.name}</strong>
                    <p style="margin: 0.25rem 0; opacity: 0.9;">Joined: ${member.joinedDate}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-weight: 600;">${member.cleanupsAttended} cleanups</p>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0077BE;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideInNotification 0.3s ease;
            font-weight: 600;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    isThisWeek(dateStr) {
        const cleanupDate = new Date(dateStr);
        const today = new Date();
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return cleanupDate >= today && cleanupDate <= weekEnd;
    }

    isThisMonth(dateStr) {
        const cleanupDate = new Date(dateStr);
        const today = new Date();
        return cleanupDate.getMonth() === today.getMonth() &&
               cleanupDate.getFullYear() === today.getFullYear();
    }

    setupAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.joinModal.style.display === 'block') {
                this.closeModal();
            }
        });

        // Announce important changes for screen readers
        this.announceToScreenReaders('ShoreSquad loaded successfully');
    }

    announceToScreenReaders(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}

// ============================================
// ADD ANIMATIONS TO STYLESHEET
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInNotification {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutNotification {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const app = new ShoreSquad();
    window.shoreSquadApp = app; // Expose for debugging
});

// ============================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
        console.log('Service Worker registration failed (optional)');
    });
}

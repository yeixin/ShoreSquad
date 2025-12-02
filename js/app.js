/**
 * ShoreSquad App
 * Minimal, modular application for coordinating beach cleanup events.
 * Built for progressive enhancement & performance.
 */

// ============================================================================
// DOM Selectors - Single source of truth for interactive elements
// ============================================================================

const selectors = {
	// Buttons
	createBtn: '#createEvent',
	findBtn: '#findEvents',

	// Weather
	weather: '#weather',
	weatherValue: '.weather-value',

	// Map
	map: '#map',
	mapSection: '#mapSection',

	// Events
	eventsList: '#eventsList',
	eventsSection: '#events'
};

// ============================================================================
// App Initialization
// ============================================================================

/**
 * Initialize UI when DOM is ready.
 * Module script with defer attribute ensures DOM is loaded.
 */
function initApp() {
	initUI();
	initMap();
	fetchWeatherData();
	initEventListeners();
	loadJoinedEvents();
	// registerServiceWorker(); // Uncomment when sw.js is ready
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initApp);
} else {
	initApp();
}

// ============================================================================
// UI Initialization
// ============================================================================

/**
 * Initialize event listeners for interactive elements.
 */
function initUI() {
	const createBtn = document.querySelector(selectors.createBtn);
	const findBtn = document.querySelector(selectors.findBtn);

	if (createBtn) {
		createBtn.addEventListener('click', handleCreateEvent);
	}

	if (findBtn) {
		findBtn.addEventListener('click', handleFindNearby);
	}

	// Debounce window resize for map updates
	window.addEventListener('resize', debounce(handleResize, 300));
}

/**
 * Initialize additional event listeners for modal and join buttons.
 */
function initEventListeners() {
	// Create Event Modal controls
	const createModal = document.querySelector('#createEventModal');
	const createCloseBtn = document.querySelector('#createEventModal .modal-close');
	const createCancelBtn = document.querySelector('#cancelCreate');
	const createModalOverlay = document.querySelector('#createEventModal .modal-overlay');
	const createForm = document.querySelector('#createEventForm');

	if (createCloseBtn) {
		createCloseBtn.addEventListener('click', () => hideModal('createEventModal'));
	}

	if (createCancelBtn) {
		createCancelBtn.addEventListener('click', () => hideModal('createEventModal'));
	}

	if (createModalOverlay) {
		createModalOverlay.addEventListener('click', () => hideModal('createEventModal'));
	}

	if (createForm) {
		createForm.addEventListener('submit', handleCreateEventSubmit);
	}

	// Footer modals
	const aboutBtn = document.querySelector('#aboutBtn');
	const contactBtn = document.querySelector('#contactBtn');
	const privacyBtn = document.querySelector('#privacyBtn');
	const termsBtn = document.querySelector('#termsBtn');

	if (aboutBtn) {
		aboutBtn.addEventListener('click', () => showModal('aboutModal'));
	}

	if (contactBtn) {
		contactBtn.addEventListener('click', () => showModal('contactModal'));
	}

	if (privacyBtn) {
		privacyBtn.addEventListener('click', () => showModal('privacyModal'));
	}

	if (termsBtn) {
		termsBtn.addEventListener('click', () => showModal('termsModal'));
	}

	// Close all modals with close button
	const closeButtons = document.querySelectorAll('.modal-close');
	closeButtons.forEach(btn => {
		btn.addEventListener('click', function() {
			const modal = this.closest('.modal');
			if (modal) {
				hideModal(modal.id);
			}
		});
	});

	// Close modals with overlay click
	const modalOverlays = document.querySelectorAll('.modal-overlay');
	modalOverlays.forEach(overlay => {
		overlay.addEventListener('click', function() {
			const modal = this.closest('.modal');
			if (modal) {
				hideModal(modal.id);
			}
		});
	});

	// Cancel buttons in modals
	const cancelButtons = document.querySelectorAll('.cancel-modal-btn');
	cancelButtons.forEach(btn => {
		btn.addEventListener('click', function() {
			const modal = this.closest('.modal');
			if (modal) {
				hideModal(modal.id);
			}
		});
	});

	// Contact form submission
	const contactForm = document.querySelector('#contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', handleContactFormSubmit);
	}

	// Join event buttons
	const joinButtons = document.querySelectorAll('.join-event-btn');
	joinButtons.forEach(btn => {
		btn.addEventListener('click', handleJoinEvent);
	});
}

/**
 * Handle "Create Event" button click.
 */
function handleCreateEvent() {
	console.log('Create event action triggered');
	showModal('createEventModal');
}

/**
 * Handle "Find Nearby" button click.
 * Integrate with Geolocation API.
 */
function handleFindNearby() {
	console.log('Find nearby action triggered');

	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				console.log(`User location: ${latitude}, ${longitude}`);
				
				// Add user marker to map if Leaflet is loaded
				if (window.leafletMapInstance && window.L) {
					// Add user location marker
					L.circleMarker([latitude, longitude], {
						radius: 8,
						fillColor: '#FF6B6B',
						color: '#FF6B6B',
						weight: 2,
						opacity: 1,
						fillOpacity: 0.8
					})
						.bindPopup('📍 Your location')
						.addTo(window.leafletMapInstance);

					// Pan map to user location
					window.leafletMapInstance.panTo([latitude, longitude]);
					console.log('✅ User marker added to map');
				}

				// Calculate distances and filter nearby events
				const events = [
					{ lat: 33.9425, lng: -118.4081, title: 'Coral Cove Cleanup' },
					{ lat: 34.0195, lng: -118.4912, title: 'Kelp Forest Beach Day' },
					{ lat: 34.2195, lng: -119.1772, title: 'Harbor Pier Restoration' }
				];

				const nearbyEvents = events.map(event => {
					const distance = calculateDistance(latitude, longitude, event.lat, event.lng);
					return { ...event, distance };
				}).sort((a, b) => a.distance - b.distance);

				// Show nearby events
				const eventsList = nearbyEvents
					.map(e => `${e.title} (${e.distance.toFixed(1)} km away)`)
					.join('\n');

				alert(`📍 Found at: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\nNearby events:\n${eventsList}`);
			},
			(error) => {
				console.warn('Geolocation error:', error);
				alert('Unable to access location. Please enable geolocation and try again.');
			}
		);
	} else {
		alert('Geolocation not supported in this browser.');
	}
}

/**
 * Handle window resize for responsive map updates.
 */
function handleResize() {
	const map = document.querySelector(selectors.map);
	if (map && window.L) {
		// Leaflet: invalidateSize() for responsive maps
		const leafletMap = window.leafletMapInstance;
		if (leafletMap && typeof leafletMap.invalidateSize === 'function') {
			leafletMap.invalidateSize();
		}
	}
}

// ============================================================================
// Map Initialization
// ============================================================================

/**
 * Initialize interactive map using Leaflet if available.
 * Falls back to placeholder if library not loaded.
 */
function initMap() {
	const mapEl = document.querySelector(selectors.map);
	if (!mapEl) {
		console.warn('Map element not found');
		return;
	}

	// Wait for Leaflet to load (with timeout)
	const checkLeaflet = setInterval(() => {
		if (window.L) {
			clearInterval(checkLeaflet);
			try {
				console.log('Leaflet found, initializing map...');
				
				// Initialize Leaflet map centered on beach region (e.g., Southern California coast)
				const mapInstance = L.map('map').setView([33.9425, -118.4081], 9);

				// Add tile layer (OpenStreetMap)
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
					maxZoom: 19
				}).addTo(mapInstance);

				// Add sample markers for cleanup locations
				const events = [
					{ lat: 33.9425, lng: -118.4081, title: 'Coral Cove Cleanup' },
					{ lat: 34.0195, lng: -118.4912, title: 'Kelp Forest Beach Day' },
					{ lat: 34.2195, lng: -119.1772, title: 'Harbor Pier Restoration' }
				];

				events.forEach(event => {
					L.marker([event.lat, event.lng])
						.bindPopup(`<strong>${event.title}</strong>`)
						.addTo(mapInstance);
				});

				// Store reference for responsive resize handling
				window.leafletMapInstance = mapInstance;

				console.log('✅ Map initialized successfully with', events.length, 'markers');
			} catch (error) {
				console.error('Error initializing Leaflet map:', error);
				mapEl.innerHTML = '<div style="padding: 2rem; color: var(--muted); text-align: center;">Map initialization error: ' + error.message + '</div>';
			}
		}
	}, 100);

	// Timeout after 5 seconds
	setTimeout(() => {
		clearInterval(checkLeaflet);
		if (!window.L) {
			console.error('Leaflet library failed to load after 5 seconds');
			mapEl.innerHTML = `
				<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center; background: linear-gradient(180deg, #CFE5FF, var(--sand));">
					<p style="font-size: 3rem; margin: 0; line-height: 1;">🗺️</p>
					<p style="font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: var(--ocean);">Map failed to load</p>
					<p style="font-size: 0.9rem; color: var(--text-muted); margin: 0; max-width: 400px;">
						Leaflet library did not load from CDN. Check your internet connection and reload the page.
					</p>
				</div>
			`;
		}
	}, 5000);
}

// ============================================================================
// Weather API Integration
// ============================================================================

/**
 * Fetch and display weather data.
 * Replace with real OpenWeather API + proper key management.
 */
async function fetchWeatherData() {
	const weatherEl = document.querySelector(selectors.weather);
	const weatherValueEl = document.querySelector(selectors.weatherValue);

	if (!weatherEl || !weatherValueEl) {
		console.warn('Weather element not found');
		return;
	}

	try {
		// Simulate network latency
		await delay(600);

		// STUB: Replace with real API call
		// const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
		// const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Malibu&appid=${apiKey}`);
		// const data = await response.json();

		// Simulated weather data
		const weatherData = {
			temp: '22°C',
			condition: 'Sunny',
			humidity: '65%',
			windSpeed: '12 knots'
		};

		// Display weather info
		weatherValueEl.textContent = `${weatherData.condition} · ${weatherData.temp} · ${weatherData.humidity} humidity`;

		console.log('Weather data loaded (simulated)');
	} catch (error) {
		console.error('Weather fetch failed:', error);
		weatherValueEl.textContent = 'Weather unavailable';
	}
}

// ============================================================================
// Service Worker Registration
// ============================================================================

/**
 * Register Service Worker for offline support & caching.
 * Implement with cache strategies & IndexedDB for events.
 */
async function registerServiceWorker() {
	if (!('serviceWorker' in navigator)) {
		console.info('Service Workers not supported in this browser');
		return;
	}

	try {
		const registration = await navigator.serviceWorker.register('/sw.js');
		console.log('Service Worker registered:', registration);

		// Listen for updates
		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;
			console.log('Service Worker update available');
		});
	} catch (error) {
		console.warn('Service Worker registration failed:', error);
	}
}

// ============================================================================
// IndexedDB Integration (Foundation)
// ============================================================================

/**
 * Initialize IndexedDB for event persistence.
 * Stub implementation - expand for CRUD operations.
 */
const dbConfig = {
	name: 'ShoreSquadDB',
	version: 1,
	stores: {
		events: { keyPath: 'id', indexes: [{ name: 'date', keyPath: 'date' }] },
		userProfiles: { keyPath: 'id' }
	}
};

async function initDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbConfig.name, dbConfig.version);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			// Create object stores if they don't exist
			Object.entries(dbConfig.stores).forEach(([name, config]) => {
				if (!db.objectStoreNames.contains(name)) {
					const store = db.createObjectStore(name, { keyPath: config.keyPath });
					config.indexes?.forEach(index => store.createIndex(index.name, index.keyPath));
					console.log(`IndexedDB store "${name}" created`);
				}
			});
		};
	});
}

// Uncomment to initialize DB on app load:
// initDB().catch(err => console.warn('DB initialization failed:', err));

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simulate async delay (for testing).
 */
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function for performance optimization.
 * Prevents excessive function calls during rapid events (e.g., resize, scroll).
 */
function debounce(fn, wait = 300) {
	let timeoutId;
	return function debouncedFn(...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), wait);
	};
}

/**
 * Throttle function for smooth scrolling/resizing.
 */
function throttle(fn, limit = 300) {
	let lastRun = 0;
	return function throttledFn(...args) {
		const now = Date.now();
		if (now - lastRun >= limit) {
			fn(...args);
			lastRun = now;
		}
	};
}

/**
 * Safe DOM manipulation with input sanitization.
 * Prevent XSS when inserting user/API content.
 */
function sanitizeHTML(str) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return str.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Validate email format.
 */
function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

/**
 * Log analytics event (stub for future integration).
 */
function trackEvent(eventName, data = {}) {
	console.log('Analytics:', eventName, data);
	// TODO: Integrate with analytics service (e.g., Google Analytics, Mixpanel)
}

/**
 * Calculate distance between two geographic coordinates using Haversine formula.
 * Returns distance in kilometers.
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
	const R = 6371; // Earth's radius in km
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// ============================================================================
// Modal Management
// ============================================================================

/**
 * Show a modal dialog.
 */
function showModal(modalId) {
	const modal = document.querySelector(`#${modalId}`);
	if (modal) {
		modal.style.display = 'flex';
		modal.classList.add('active');
		document.body.style.overflow = 'hidden';
		console.log(`Modal ${modalId} opened`);
	}
}

/**
 * Hide a modal dialog.
 */
function hideModal(modalId) {
	const modal = document.querySelector(`#${modalId}`);
	if (modal) {
		modal.style.display = 'none';
		modal.classList.remove('active');
		document.body.style.overflow = 'auto';
		console.log(`Modal ${modalId} closed`);
	}
}

/**
 * Handle contact form submission.
 */
function handleContactFormSubmit(e) {
	e.preventDefault();

	const formData = new FormData(e.target);
	const contact = {
		name: formData.get('name'),
		email: formData.get('email'),
		message: formData.get('message'),
		sentAt: new Date().toISOString()
	};

	// Validate
	if (!contact.name || !contact.email || !contact.message) {
		alert('Please fill in all fields.');
		return;
	}

	if (!validateEmail(contact.email)) {
		alert('Please enter a valid email address.');
		return;
	}

	console.log('Contact form submitted:', contact);

	// Save to localStorage (in a real app, this would send to a server)
	const messages = JSON.parse(localStorage.getItem('shorequad_contact_messages') || '[]');
	messages.push(contact);
	localStorage.setItem('shorequad_contact_messages', JSON.stringify(messages));

	// Reset form and close modal
	e.target.reset();
	hideModal('contactModal');

	alert(`✅ Thank you, ${contact.name}! We'll get back to you soon at ${contact.email}. 🌊`);
	trackEvent('contact_form_submitted', { email: contact.email });
}

/**
 * Handle form submission for creating a new event.
 */
function handleCreateEventSubmit(e) {
	e.preventDefault();
	
	const formData = new FormData(e.target);
	const newEvent = {
		id: Date.now(),
		title: formData.get('title'),
		date: formData.get('date'),
		time: formData.get('time'),
		location: formData.get('location'),
		description: formData.get('description'),
		createdAt: new Date().toISOString()
	};

	// Validate form
	if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
		alert('Please fill in all required fields.');
		return;
	}

	console.log('New event created:', newEvent);
	
	// Save to IndexedDB
	saveEventToIndexedDB(newEvent);

	// Add event to the list
	addEventToDOM(newEvent);

	// Reset form and close modal
	e.target.reset();
	hideModal('createEventModal');

	// Show confirmation
	alert(`✅ Event "${newEvent.title}" created successfully!`);
	trackEvent('event_created', { eventTitle: newEvent.title });
}

/**
 * Add event to the DOM.
 */
function addEventToDOM(event) {
	const eventsList = document.querySelector(selectors.eventsList);
	if (!eventsList) return;

	const li = document.createElement('li');
	li.className = 'event-card';
	li.innerHTML = `
		<article>
			<h3>${sanitizeHTML(event.title)}</h3>
			<p class="event-date">📅 ${event.date} at ${event.time}</p>
			<p class="event-location">📍 ${sanitizeHTML(event.location)}</p>
			<p class="event-description">${sanitizeHTML(event.description || 'No description provided')}</p>
			<button class="btn btn-secondary join-event-btn" data-event-id="${event.id}" data-event-title="${sanitizeHTML(event.title)}" aria-label="Join ${sanitizeHTML(event.title)} event">Join Crew</button>
		</article>
	`;

	eventsList.appendChild(li);

	// Add event listener to the new join button
	const joinBtn = li.querySelector('.join-event-btn');
	if (joinBtn) {
		joinBtn.addEventListener('click', handleJoinEvent);
	}

	console.log('Event added to DOM:', event.title);
}

// ============================================================================
// Join Event Handler
// ============================================================================

/**
 * Handle joining an event.
 */
function handleJoinEvent(e) {
	const eventId = e.target.dataset.eventId;
	const eventTitle = e.target.dataset.eventTitle;
	
	if (!eventId || !eventTitle) {
		console.warn('Missing event ID or title');
		return;
	}

	// Save to IndexedDB
	const participation = {
		id: Date.now(),
		eventId: eventId,
		eventTitle: eventTitle,
		joinedAt: new Date().toISOString()
	};

	saveParticipationToIndexedDB(participation);

	// Change button state
	e.target.textContent = '✅ Joined';
	e.target.disabled = true;
	e.target.style.opacity = '0.6';

	console.log(`✅ Joined event: ${eventTitle}`);
	alert(`🎉 You joined "${eventTitle}"! See you at the cleanup! 🌊`);
	trackEvent('event_joined', { eventTitle: eventTitle });
}

/**
 * Load and display user's joined events.
 */
function loadJoinedEvents() {
	// Retrieve joined events from IndexedDB
	getAllParticipationFromIndexedDB().then(participations => {
		participations.forEach(participation => {
			const joinBtn = document.querySelector(`.join-event-btn[data-event-id="${participation.eventId}"]`);
			if (joinBtn) {
				joinBtn.textContent = '✅ Joined';
				joinBtn.disabled = true;
				joinBtn.style.opacity = '0.6';
			}
		});
	});
}

// ============================================================================
// IndexedDB Functions
// ============================================================================

/**
 * Save a new event to IndexedDB.
 */
async function saveEventToIndexedDB(event) {
	try {
		const db = await initDB();
		const transaction = db.transaction(['events'], 'readwrite');
		const store = transaction.objectStore('events');
		store.add(event);
		console.log('Event saved to IndexedDB:', event.title);
	} catch (error) {
		console.warn('Could not save event to IndexedDB:', error);
	}
}

/**
 * Save event participation to IndexedDB.
 */
async function saveParticipationToIndexedDB(participation) {
	try {
		const db = await initDB();
		const transaction = db.transaction(['events'], 'readwrite');
		const store = transaction.objectStore('events');
		
		// Check if we need to create a participations store
		if (!db.objectStoreNames.contains('participations')) {
			console.warn('Participations store not initialized');
			return;
		}
		
		const participationStore = transaction.objectStore('participations');
		participationStore.add(participation);
		console.log('Participation saved to IndexedDB');
	} catch (error) {
		// Fallback: store in localStorage
		const participations = JSON.parse(localStorage.getItem('shorequad_participations') || '[]');
		participations.push(participation);
		localStorage.setItem('shorequad_participations', JSON.stringify(participations));
		console.log('Participation saved to localStorage:', participation);
	}
}

/**
 * Get all user participations from IndexedDB or localStorage.
 */
async function getAllParticipationFromIndexedDB() {
	try {
		// Try localStorage first (more reliable for this demo)
		const stored = localStorage.getItem('shorequad_participations');
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.warn('Error loading participations:', error);
		return [];
	}
}

// ============================================================================
// Export for testing (if using modules)
// ============================================================================

export {
	initApp,
	initUI,
	initMap,
	fetchWeatherData,
	handleCreateEvent,
	handleFindNearby,
	debounce,
	throttle,
	sanitizeHTML,
	validateEmail,
	trackEvent
};


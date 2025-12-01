# ShoreSquad 🌊

Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

## Project Vision

ShoreSquad creates value by mobilizing young people to clean beaches, using weather and maps for easy planning and social features to make eco-action fun and connected.

---

## 🎨 Brand Identity

### Colour Palette
- **Primary**: Ocean Blue (`#0077BE`) - Trust, water, environment
- **Secondary**: Coral/Sunset Orange (`#FF6B6B`) - Energy, enthusiasm, social
- **Accent**: Lime Green (`#4CAF50`) - Growth, action, sustainability
- **Neutral**: Off-white (`#F8F9FA`) - Clean, minimalist
- **Dark**: Charcoal (`#2C3E50`) - Text, depth

### Typography
- **Display**: Poppins (700, 600) - Bold, modern, youthful
- **Body**: Inter (400, 500, 600) - Clean, readable, accessible

---

## ✨ Key Features

### Core Functionality
- **Interactive Map** - Locate nearby beach cleanups
- **Weather Integration** - Real-time conditions for beach planning
- **Event Management** - Discover and join cleanup events
- **Crew Tracking** - Build your social circle and track impact
- **Gamification** - Points and badges for participation

### Technical Features
- **Geolocation API** - Auto-detect user location
- **Local Storage** - Persistent crew data
- **Responsive Design** - Mobile-first, works on all devices
- **Accessibility (WCAG 2.1 AA)** - Inclusive design principles
- **PWA Support** - Service Workers for offline capability

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Live Server (VS Code extension) or any local server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShoreSquad-1
   ```

2. **Start Live Server**
   - VS Code: Right-click `index.html` → "Open with Live Server"
   - Terminal: `npx http-server`
   - Or use any local server on `http://localhost:5500`

3. **Open in browser**
   ```
   http://localhost:5500
   ```

---

## 📁 Project Structure

```
ShoreSquad-1/
├── index.html              # HTML5 entry point
├── css/
│   └── styles.css          # Main stylesheet with brand colors
├── js/
│   └── app.js              # Core application logic
├── .vscode/
│   └── settings.json       # Live Server configuration
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🎯 UX Design Principles

1. **Mobile-First** - Primary audience is young people on phones
2. **Accessibility** - WCAG 2.1 AA compliance, semantic HTML
3. **Micro-Interactions** - Smooth transitions and feedback
4. **Social Proof** - Display crew size and participation badges
5. **Gamification** - Points/badges for cleanups attended
6. **Speed & Intuition** - Minimal clicks to join a cleanup
7. **Inclusive** - Keyboard navigation, screen reader support

---

## 💻 JavaScript Architecture

### Main Components

**ShoreSquad Class**
- Singleton pattern for app state management
- Local Storage integration for data persistence
- Event delegation for all interactions

**Key Methods**
- `init()` - Bootstrap the application
- `handleJoin()` - Crew member registration
- `renderCleanups()` - Dynamic cleanup listing
- `fetchWeather()` - Weather data retrieval
- `requestGeolocation()` - Location services
- `showNotification()` - User feedback system

---

## 🌐 API Integration Points

Ready for integration with:
- **OpenWeatherMap API** - Real weather data
- **Leaflet.js** - Advanced mapping
- **Firebase** - Backend services
- **Mapbox** - Enhanced geolocation

---

## ♿ Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels and live regions
- ✅ Keyboard navigation (ESC to close modals)
- ✅ High contrast color combinations
- ✅ Reduced motion support
- ✅ Screen reader announcements
- ✅ Focus indicators
- ✅ Touch-friendly button sizes

---

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px - 1200px
- **Wide**: 1201px+

---

## 🔄 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📝 Next Steps

### Phase 1: Polish
- [ ] Add real weather API integration
- [ ] Integrate Leaflet.js for maps
- [ ] Implement form validation
- [ ] Add loading states

### Phase 2: Backend
- [ ] Setup Firebase/Database
- [ ] User authentication
- [ ] Event creation by crew leaders
- [ ] Real crew member management

### Phase 3: Enhancement
- [ ] Push notifications
- [ ] Photo gallery of cleanups
- [ ] Achievements/leaderboard
- [ ] Community challenges

### Phase 4: Mobile App
- [ ] React Native version
- [ ] App store deployment
- [ ] Offline-first architecture

---

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests!

---

## 📄 License

Open source for environmental impact.

---

## 🌊 Mission

Every beach deserves respect. Join ShoreSquad and inspire your community to take action!

**Rally your crew. Protect our oceans. 🌊**

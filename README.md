# EventsManager — Campus Event & Check-In Platform

**EventsManager** (OrbitCheck) is a real-time event operating system built for student clubs, tech summits, hackathons, and campus gate check-ins at **Microsoft Innovations Club (MIC)** & **VIT Chennai**.

It combines event discovery, digital 2D QR pass issuing, live 3-second database metrics streaming, automated webcam QR scanning, and server-side AI operational intelligence into a single, high-performance web platform.

---

## ✨ Features

- **Real-Time Campus Event Discovery**: Discover active club events, view room capacities, remaining spots, and detailed schedules.
- **Digital 2D QR Passes**: Claim duplicate-proof digital passes with high-resolution 2D QR codes rendered directly on your device.
- **Automated Webcam Gate Scanner**: Real-time video frame scanning operating at 15 FPS with instant duplicate detection and sub-100ms verification latency.
- **Live 3-Second Database Sync**: Room capacity, check-in velocity, and registered counts update automatically across all open screens without page reloads.
- **Server-Side AI Event Intelligence**: Query AI for check-in velocity summaries, peak arrival predictions, and organizer recommendations.
- **CSV Roster Export**: 1-click export of verified gate attendance rosters.
- **Persistent Local Data Store**: Full file-backed storage ensuring all created events, registrations, and check-ins persist across server restarts.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with Webpack)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **QR Engine**: `qrcode`, `html5-qrcode`
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SAMJOD07-devz/MIC-PROJECT.git
   cd MIC-PROJECT/orbit-check
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 👤 Author & Credits

**Engineered & Designed by Saumya Pandya**  
Microsoft Innovations Club (MIC), VIT Chennai.

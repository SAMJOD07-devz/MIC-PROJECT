'use client';

import React, { useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  LocateFixed,
  MoveUpRight,
  ScanLine,
  Sparkles,
  Users,
} from 'lucide-react';
import { PastEventsMarquee } from '@/components/UI/PastEventsMarquee';
import { playClickSFX, playHoverSFX } from '@/lib/audio';

interface LandingPageProps {
  onEnterOrganizer: () => void;
  onEnterAttendee: () => void;
  onOpenLogin: () => void;
}

const signalItems = [
  { value: '03', label: 'clubs live now', tone: 'magenta' },
  { value: '82%', label: 'Hall B capacity', tone: 'cobalt' },
  { value: '00:14', label: 'average check-in', tone: 'vermilion' },
  { value: '24/7', label: 'campus signal', tone: 'ivory' },
];

const workflow = [
  {
    number: '01',
    title: 'Create the moment',
    copy: 'Set a room, a capacity, a time window, and the story you want people to find.',
    icon: CalendarDays,
  },
  {
    number: '02',
    title: 'Share one clear pass',
    copy: 'Your event gets a simple page and a digital QR pass that is ready for the group chat.',
    icon: ArrowUpRight,
  },
  {
    number: '03',
    title: 'Scan the arrival',
    copy: 'Check people in quickly with duplicate-proof validation that keeps the queue moving.',
    icon: ScanLine,
  },
  {
    number: '04',
    title: 'See the room change',
    copy: 'Live capacity signals help organizers make better calls while the event is in motion.',
    icon: MoveUpRight,
  },
];

export function LandingPage({
  onEnterOrganizer,
  onEnterAttendee,
  onOpenLogin,
}: LandingPageProps) {
  useEffect(() => {
    const root = document.documentElement;
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty('--parallax-x', `${Math.round(x * 12)}px`);
      root.style.setProperty('--parallax-y', `${Math.round(y * 9)}px`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />

      <main>
        {/* 1. HERO SECTION WITH COSMIC PLANET & ORBITAL GRAPHICS */}
        <section id="top" className="hero section-dark">
          {/* Pure SVG Cosmic Background */}
          <div className="absolute inset-0 z-[-3] overflow-hidden pointer-events-none">
            <svg className="w-full h-full object-cover" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
              <rect width="1440" height="900" fill="#16151a" />
              {/* Planet sphere on right */}
              <circle cx="1180" cy="450" r="380" fill="url(#planet-gradient)" opacity="0.85" />
              {/* Orbital Curves */}
              <ellipse cx="980" cy="420" rx="550" ry="240" stroke="url(#orbit-line-1)" strokeWidth="1.5" transform="rotate(-18 980 420)" opacity="0.4" />
              <ellipse cx="980" cy="420" rx="420" ry="380" stroke="url(#orbit-line-2)" strokeWidth="1" transform="rotate(32 980 420)" opacity="0.35" />
              <ellipse cx="980" cy="420" rx="680" ry="180" stroke="#7a54ff" strokeWidth="1" transform="rotate(12 980 420)" opacity="0.25" />
              <defs>
                <radialGradient id="planet-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1000 280) rotate(55) scale(500)">
                  <stop stopColor="#ff7bc2" />
                  <stop offset="0.45" stopColor="#e443b4" />
                  <stop offset="0.75" stopColor="#5c1f8a" />
                  <stop offset="1" stopColor="#16151a" />
                </radialGradient>
                <linearGradient id="orbit-line-1" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#e443b4" />
                  <stop offset="0.5" stopColor="#7a54ff" />
                  <stop offset="1" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="orbit-line-2" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#4b79ff" />
                  <stop offset="1" stopColor="#e443b4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="hero-vignette" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" /> Live event operating system{' '}
                <span className="eyebrow-muted">EST. 2024</span>
              </div>
              <h1>
                Make every <em>arrival</em> count.
              </h1>
              <p className="hero-lede">
                OrbitCheck brings discovery, registration, and duplicate-proof check-in into one calm, live layer for campus life.
              </p>
              <div className="hero-actions">
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => {
                    playClickSFX();
                    onEnterOrganizer();
                  }}
                  onMouseEnter={playHoverSFX}
                >
                  Enter as organizer <ArrowRight size={16} />
                </button>
                <button
                  className="button button-ghost"
                  type="button"
                  onClick={() => {
                    playClickSFX();
                    onEnterAttendee();
                  }}
                  onMouseEnter={playHoverSFX}
                >
                  Enter as attendee <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="hero-note">
                <span className="pulse-dot" /> Instant door validation — zero queues, zero duplicate entries
              </div>
            </div>

            <div className="orbit-field">
              <span className="orbit-field-label">FIELD PREVIEW / CAMPUS LOOP</span>
              <div className="orbit-ring orbit-ring-one" />
              <div className="orbit-ring orbit-ring-two" />
              <div className="orbit-ring orbit-ring-three" />
              <div className="orbit-core">
                <span className="core-label">LIVE / HALL B</span>
                <strong>82%</strong>
                <span className="core-caption">capacity in motion</span>
              </div>
              <div className="float-card float-card-checkin">
                <div className="float-card-icon">
                  <ScanLine size={16} />
                </div>
                <div>
                  <span>CHECK-IN</span>
                  <strong>+18 arrivals</strong>
                </div>
                <span className="float-card-time">now</span>
              </div>
              <div className="float-card float-card-event">
                <div className="event-avatar">
                  <Users size={17} />
                </div>
                <div>
                  <span>DISCOVERED</span>
                  <strong>Design Society</strong>
                </div>
                <span className="status-dot" />
              </div>
              <div className="float-card float-card-room">
                <LocateFixed size={15} />
                <span>ROOM 04</span>
                <b>Open</b>
              </div>
              <div className="orbit-spark spark-one">
                <Sparkles size={13} />
              </div>
              <div className="orbit-spark spark-two">
                <span />
              </div>
              <div className="orbit-field-footer">
                <span>SYNCING LIVE</span>
                <i /> <span>00:14 AVG. SCAN</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>Scroll to explore</span>
            <span className="scroll-line" />
          </div>
        </section>

        {/* 2. DENSE LIVE SIGNAL STRIP */}
        <section id="signal" className="signal-strip" aria-label="Live sample signals">
          <div className="container signal-strip-inner">
            <div className="signal-intro">
              <span className="mono-label">LIVE SIGNAL</span>
              <strong>For the room as it changes.</strong>
            </div>
            {signalItems.map((item) => (
              <div className={`signal-item signal-${item.tone}`} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CLUBS LIVE NOW — PAST MANAGED EVENTS MARQUEE LOOP */}
        <PastEventsMarquee onRegister={onEnterAttendee} />

        {/* 4. PLATFORM PAPER SECTION WITH HTML/CSS CAMPUS LIVE-MAP ARTIFACT */}
        <section id="platform" className="paper-section platform-section">
          <div className="container platform-grid">
            <div className="section-index">
              <span>01</span>
              <i />
              <span>PLATFORM NOTE</span>
            </div>
            <div className="platform-copy">
              <span className="mono-label">ONE LAYER / MANY MOMENTS</span>
              <h2>
                Less queue.
                <br />
                <em>More campus.</em>
              </h2>
              <p>
                OrbitCheck gives student organizers one calm tool to publish events, track arrivals live, and keep door lines moving fast.
              </p>

              <div className="metric-row">
                <div>
                  <strong>0.08s</strong>
                  <span>DOOR SCAN LATENCY</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>DUPLICATE BLOCKED</span>
                </div>
              </div>

              <button className="inline-link" type="button" onClick={() => scrollTo('workflow')}>
                See how it works <ArrowRight size={14} />
              </button>
            </div>

            <div className="platform-visual">
              <div className="visual-caption">
                <span>CAMPUS LIVE SIGNAL MAP</span>
                <span>REAL-TIME DENSITY</span>
              </div>

              {/* Pure HTML/CSS Campus Live-Map Visual Board */}
              <div className="visual-frame visual-board">
                <div className="board-top">
                  <span>VIT CHENNAI CAMPUS LOOP</span>
                  <span>EST. LATENCY: &lt;80MS</span>
                </div>

                <div className="campus-map">
                  <span className="map-road map-road-one" />
                  <span className="map-road map-road-two" />
                  <span className="map-road map-road-three" />

                  <span className="map-building building-one" />
                  <span className="map-building building-two" />
                  <span className="map-building building-three" />
                  <span className="map-building building-[#e443b4] building-four" />

                  <div className="map-pin pin-one">
                    <i /> <span>AB1 AUDITORIUM</span>
                  </div>
                  <div className="map-pin pin-two">
                    <i /> <span>HALL B</span>
                  </div>
                  <div className="map-pin pin-three">
                    <i /> <span>GATE 2</span>
                  </div>

                  <div className="map-center">
                    <div>
                      <strong>82%</strong>
                      <small>CAPACITY</small>
                    </div>
                  </div>
                </div>

                <div className="board-bottom">
                  <div>
                    <strong>MIC CodeStorm &amp; technoVIT 2025</strong>
                    <div className="board-status">
                      <i /> <span>Live gate scan active</span>
                    </div>
                  </div>
                  <span>SWIPE PREVIEW</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DARK ORGANIZER SIGNAL SECTION */}
        <section className="signal-section">
          <div className="container signal-section-grid">
            <div className="signal-section-copy">
              <span className="mono-label">ORGANIZER CONTROL</span>
              <h2>
                Built for the
                <br />
                <em>gate, the stage,</em>
                <br />
                and the room.
              </h2>
              <p>
                From sudden high-density rushes to VIP speaker check-ins, OrbitCheck ensures zero gate chaos and complete operational control.
              </p>

              <div className="status-card">
                <div className="status-card-top">
                  <span>
                    <i className="status-dot" /> LIVE GATE FEED
                  </span>
                  <span>GATE 02</span>
                </div>
                <div className="status-card-line">
                  <strong>Check-in Velocity</strong>
                  <span>142/min</span>
                </div>
                <div className="progress-line">
                  <i />
                </div>
                <div className="status-card-bottom">
                  <span>DUPLICATES REJECTED: 12</span>
                  <span>SYNC: OK</span>
                </div>
              </div>
            </div>

            <div className="feature-list">
              <div className="feature-row">
                <span className="feature-number">01</span>
                <div>
                  <h3>Offline-First Scan Sync</h3>
                  <p>Check-in continues seamlessly even if venue Wi-Fi drops out entirely, auto-syncing when reconnected.</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
              <div className="feature-row">
                <span className="feature-number">02</span>
                <div>
                  <h3>Instant Duplicate Prevention</h3>
                  <p>Cryptographic token hashes prevent pass sharing or double entry attempts at door check-in.</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
              <div className="feature-row">
                <span className="feature-number">03</span>
                <div>
                  <h3>Live Capacity Intelligence</h3>
                  <p>Real-time analytics monitor room fill percentage and alert gate teams to adjust entry speed.</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* 6. STEPPED WORKFLOW PLATES */}
        <section id="workflow" className="workflow-section">
          <div className="container">
            <div className="workflow-heading">
              <div>
                <span className="mono-label">03 / THE MOVEMENT</span>
                <h2>
                  Four steps to a<br />
                  <em>calmer event.</em>
                </h2>
              </div>
              <p>Designed for fast setup before the event and simple check-in while people arrive.</p>
            </div>

            <div className="workflow-path">
              {workflow.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.number} className="workflow-step">
                    <div className="workflow-step-top">
                      <span>{step.number}</span>
                      <IconComponent size={20} />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                    <div className="workflow-connector">
                      <ArrowRight size={11} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. CALL TO ACTION SECTION */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <div className="cta-copy">
                <span className="mono-label">GET STARTED</span>
                <h2>
                  Ready for a<br />
                  <em>calmer event?</em>
                </h2>
              </div>
              <div className="cta-actions">
                <p>Launch your campus event with OrbitCheck discovery and duplicate-proof gate check-in in under 2 minutes.</p>
                <button
                  className="button button-dark"
                  type="button"
                  onClick={() => {
                    playClickSFX();
                    onEnterOrganizer();
                  }}
                  onMouseEnter={playHoverSFX}
                >
                  Create an Event <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <footer className="footer section-dark">
        <div className="container footer-top">
          <button className="brand footer-brand" type="button" onClick={() => scrollTo('top')}>
            <span className="brand-mark">
              <span>O</span>
            </span>
            <span className="brand-wordmark">
              Orbit<span>Check</span>
              <small>Campus events / check-in</small>
            </span>
          </button>
          <div className="footer-note">
            <span className="mono-label">A SMALLER QUEUE FOR A BIGGER MOMENT</span>
            <strong>Built for the people who make campus feel alive.</strong>
          </div>
          <div className="footer-links">
            <button type="button" onClick={() => scrollTo('platform')}>
              Platform
            </button>
            <button type="button" onClick={() => scrollTo('workflow')}>
              How it works
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSFX();
                onOpenLogin();
              }}
            >
              Sign in <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 OrbitCheck — Campus Event Operating System</span>
          <span>
            System status <i className="status-dot" /> All signals clear
          </span>
          <span>Made for the moment in between.</span>
        </div>
      </footer>
    </div>
  );
}

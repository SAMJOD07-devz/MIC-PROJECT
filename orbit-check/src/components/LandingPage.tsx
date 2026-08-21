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
                <span className="pulse-dot" /> Built for the moment before the room fills.
              </div>
            </div>

            <div className="orbit-field" aria-label="OrbitCheck live signal preview">
              <div className="orbit-field-label label-top">FIELD PREVIEW / CAMPUS LOOP</div>
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
                  <ScanLine size={18} />
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

        {/* 3. PLATFORM PAPER SECTION WITH HTML/CSS CAMPUS LIVE-MAP ARTIFACT */}
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
                Give every event a clear front door. OrbitCheck makes the operational layer feel as considered as the experience itself, from the first tap to the last person in the room.
              </p>
              <div className="metric-row">
                <div>
                  <strong>01</strong>
                  <span>shared event link</span>
                </div>
                <div>
                  <strong>∞</strong>
                  <span>ways to discover</span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>duplicate entries</span>
                </div>
              </div>
              <button
                className="inline-link"
                type="button"
                onClick={() => scrollTo('workflow')}
              >
                See the system <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="platform-visual">
              <div className="visual-caption">
                <span>FIELD NOTE 01</span>
                <span>DESIGNED TO MOVE</span>
              </div>
              <div className="visual-frame visual-board">
                <div className="board-top">
                  <span>ORBITCHECK / WEDNESDAY</span>
                  <span>LIVE MAP / 03</span>
                </div>
                <div className="campus-map" aria-label="Campus event live map">
                  <span className="map-road map-road-one" />
                  <span className="map-road map-road-two" />
                  <span className="map-road map-road-three" />
                  <span className="map-building building-one" />
                  <span className="map-building building-two" />
                  <span className="map-building building-three" />
                  <span className="map-building building-four" />
                  <span className="map-pin pin-one">
                    <i />
                    <b>HALL B</b>
                  </span>
                  <span className="map-pin pin-two">
                    <i />
                    <b>NORTH QUAD</b>
                  </span>
                  <span className="map-pin pin-three">
                    <i />
                    <b>ROOM 04</b>
                  </span>
                  <span className="map-center">
                    <strong>03</strong>
                    <small>
                      LIVE
                      <br />
                      EVENTS
                    </small>
                  </span>
                </div>
                <div className="board-bottom">
                  <div>
                    <span>DESIGN SOCIETY</span>
                    <strong>82% capacity</strong>
                  </div>
                  <div>
                    <span>LAST SCAN</span>
                    <strong>00:14 ago</strong>
                  </div>
                  <div>
                    <span>STATUS</span>
                    <strong className="board-status">
                      <i /> clear
                    </strong>
                  </div>
                </div>
                <div className="visual-callout callout-one">
                  <span className="callout-dot" /> one clear pass
                </div>
                <div className="visual-callout callout-two">
                  <span className="callout-dot" /> live room signal
                </div>
                <div className="visual-stamp">
                  OC
                  <br />
                  <span>
                    FIELD
                    <br />
                    SYSTEM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ORGANIZER CONTROL SECTION */}
        <section className="section-dark signal-section">
          <div className="container signal-section-grid">
            <div className="signal-section-copy">
              <span className="mono-label">02 / ORGANIZER CONTROL</span>
              <h2>
                Know what is
                <br />
                <em>happening now.</em>
              </h2>
              <p>
                Build a rhythm people can feel. Keep the room visible without turning the room into a spreadsheet.
              </p>
              <div className="status-card">
                <div className="status-card-top">
                  <span>
                    <i className="status-dot" /> Demo signal
                  </span>
                  <span>Live / 07:42</span>
                </div>
                <div className="status-card-line">
                  <strong>Design Society — Hall B</strong>
                  <span>82%</span>
                </div>
                <div className="progress-line">
                  <i />
                </div>
                <div className="status-card-bottom">
                  <span>156 checked in</span>
                  <span>34 spots left</span>
                </div>
              </div>
            </div>
            <div className="feature-list">
              <article className="feature-row">
                <span className="feature-number">01</span>
                <div>
                  <h3>Duplicate-proof by default</h3>
                  <p>Every scan is validated in the moment, so the line stays human and the data stays clean.</p>
                </div>
                <ArrowUpRight size={18} />
              </article>
              <article className="feature-row">
                <span className="feature-number">02</span>
                <div>
                  <h3>Capacity you can actually use</h3>
                  <p>Make room for a better decision with a simple signal, not a wall of admin panels.</p>
                </div>
                <ArrowUpRight size={18} />
              </article>
              <article className="feature-row">
                <span className="feature-number">03</span>
                <div>
                  <h3>A better front door for attendees</h3>
                  <p>Discovery, digital passes, and arrival live in the same visual language from day one.</p>
                </div>
                <ArrowUpRight size={18} />
              </article>
            </div>
          </div>
        </section>

        {/* 5. INFINITE MARQUEE LOOP OF PAST MANAGED CAMPUS EVENTS (VIT CHENNAI) */}
        <PastEventsMarquee />

        {/* 6. WORKFLOW PAPER SECTION matching screenshot 1:1 */}
        <section id="workflow" className="paper-section workflow-section">
          <div className="container">
            <div className="workflow-heading">
              <div>
                <span className="mono-label">03 / THE MOVEMENT</span>
                <h2>
                  From signal
                  <br />
                  <em>to shared moment.</em>
                </h2>
              </div>
              <p>Four small actions. One much clearer event day.</p>
            </div>
            <div className="workflow-path" aria-label="OrbitCheck workflow">
              {workflow.map(({ number, title, copy, icon: Icon }, index) => (
                <article className={`workflow-step workflow-step-${index + 1}`} key={number}>
                  <div className="workflow-step-top">
                    <span>{number}</span>
                    <Icon size={19} />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  {index < workflow.length - 1 && (
                    <span className="workflow-connector" aria-hidden="true">
                      <ArrowRight size={15} />
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CTA SECTION */}
        <section id="contact" className="cta-section">
          <div className="container cta-card">
            <div className="cta-orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="cta-copy">
              <span className="mono-label">READY WHEN THE ROOM IS</span>
              <h2>
                Make arrival
                <br />
                <em>feel effortless.</em>
              </h2>
            </div>
            <div className="cta-actions">
              <p>Bring the next campus moment into focus with a clearer way to discover, enter, and keep moving.</p>
              <button
                className="button button-dark"
                type="button"
                onClick={() => {
                  playClickSFX();
                  onEnterOrganizer();
                }}
              >
                Open organizer demo <ArrowRight size={16} />
              </button>
              <button
                className="cta-secondary"
                type="button"
                onClick={() => {
                  playClickSFX();
                  onEnterAttendee();
                }}
              >
                I’m here to attend <ArrowUpRight size={15} />
              </button>
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

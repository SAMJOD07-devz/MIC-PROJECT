/*
 * Kinetic Editorial Gallery: asymmetric case-study composition, dark graphite canvas,
 * warm paper panels, editorial labels, Orbit Magenta signals, and quiet antigravity motion.
 */
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  LocateFixed,
  Menu,
  MoveUpRight,
  ScanLine,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const HERO_ASSET = "/manus-storage/orbitcheck-hero-reference_1ed4a51f.png";
const ORB_ASSET = "/manus-storage/orbitcheck-orb-accent_56bfb536.png";
const MARK_ASSET = "/manus-storage/orbitcheck-mark_5739bed4.png";

type Role = "organizer" | "attendee" | null;

const signalItems = [
  { value: "03", label: "clubs live now", tone: "magenta" },
  { value: "82%", label: "Hall B capacity", tone: "cobalt" },
  { value: "00:14", label: "average check-in", tone: "vermilion" },
  { value: "24/7", label: "campus signal", tone: "ivory" },
];

const workflow = [
  {
    number: "01",
    title: "Create the moment",
    copy: "Set a room, a capacity, a time window, and the story you want people to find.",
    icon: CalendarDays,
  },
  {
    number: "02",
    title: "Share one clear pass",
    copy: "Your event gets a simple page and a digital QR pass that is ready for the group chat.",
    icon: ArrowUpRight,
  },
  {
    number: "03",
    title: "Scan the arrival",
    copy: "Check people in quickly with duplicate-proof validation that keeps the queue moving.",
    icon: ScanLine,
  },
  {
    number: "04",
    title: "See the room change",
    copy: "Live capacity signals help organizers make better calls while the event is in motion.",
    icon: MoveUpRight,
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const handlePointerMove = (event: PointerEvent) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 2;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 2;
      root.style.setProperty("--parallax-x", `${Math.round(x * 12)}px`);
      root.style.setProperty("--parallax-y", `${Math.round(y * 9)}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" type="button" onClick={() => scrollTo("top")} aria-label="OrbitCheck home">
            <span className="brand-mark"><img src={MARK_ASSET} alt="" /></span>
            <span className="brand-wordmark">Orbit<span>Check</span><small>Campus events / check-in</small></span>
          </button>

          <nav className="desktop-nav" aria-label="Main navigation">
            <button type="button" onClick={() => scrollTo("platform")}>Platform</button>
            <button type="button" onClick={() => scrollTo("signal")}>Live signal</button>
            <button type="button" onClick={() => scrollTo("workflow")}>How it works</button>
          </nav>

          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={() => setSoundOn((current) => !current)} aria-label={soundOn ? "Mute ambient sound" : "Play ambient sound"}>
              {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <button className="text-action desktop-only" type="button" onClick={() => setRole("organizer")}>Organizer demo</button>
            <button className="text-action desktop-only" type="button" onClick={() => setRole("attendee")}>Attendee demo</button>
            <button className="sign-in desktop-only" type="button" onClick={() => setRole("organizer")}>Sign in <ArrowUpRight size={14} /></button>
            <button className="mobile-menu-button" type="button" onClick={() => setMobileMenuOpen((current) => !current)} aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav" aria-label="Mobile navigation">
            <button type="button" onClick={() => scrollTo("platform")}>Platform <ArrowUpRight size={15} /></button>
            <button type="button" onClick={() => scrollTo("signal")}>Live signal <ArrowUpRight size={15} /></button>
            <button type="button" onClick={() => scrollTo("workflow")}>How it works <ArrowUpRight size={15} /></button>
            <div className="mobile-nav-actions">
              <button type="button" onClick={() => setRole("organizer")}>Organizer demo</button>
              <button type="button" onClick={() => setRole("attendee")}>Attendee demo</button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="top" className="hero section-dark">
          <div className="hero-art" style={{ backgroundImage: `url(${HERO_ASSET})` }} aria-hidden="true" />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> Live event operating system <span className="eyebrow-muted">EST. 2024</span></div>
              <h1>Make every <em>arrival</em> count.</h1>
              <p className="hero-lede">OrbitCheck brings discovery, registration, and duplicate-proof check-in into one calm, live layer for campus life.</p>
              <div className="hero-actions">
                <button className="button button-primary" type="button" onClick={() => setRole("organizer")}>Enter as organizer <ArrowRight size={16} /></button>
                <button className="button button-ghost" type="button" onClick={() => setRole("attendee")}>Enter as attendee <ArrowUpRight size={16} /></button>
              </div>
              <div className="hero-note"><span className="pulse-dot" /> Built for the moment before the room fills.</div>
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
                <div className="float-card-icon"><ScanLine size={18} /></div>
                <div><span>CHECK-IN</span><strong>+18 arrivals</strong></div>
                <span className="float-card-time">now</span>
              </div>
              <div className="float-card float-card-event">
                <div className="event-avatar"><Users size={17} /></div>
                <div><span>DISCOVERED</span><strong>Design Society</strong></div>
                <span className="status-dot" />
              </div>
              <div className="float-card float-card-room">
                <LocateFixed size={15} /><span>ROOM 04</span><b>Open</b>
              </div>
              <div className="orbit-spark spark-one"><Sparkles size={13} /></div>
              <div className="orbit-spark spark-two"><span /></div>
              <img className="orbit-accent" src={ORB_ASSET} alt="" />
              <div className="orbit-field-footer"><span>SYNCING LIVE</span><i /> <span>00:14 AVG. SCAN</span></div>
            </div>
          </div>
          <div className="hero-bottom container"><span>Scroll to explore</span><span className="scroll-line" /></div>
        </section>

        <section id="signal" className="signal-strip" aria-label="Live sample signals">
          <div className="container signal-strip-inner">
            <div className="signal-intro"><span className="mono-label">LIVE SIGNAL</span><strong>For the room as it changes.</strong></div>
            {signalItems.map((item) => (
              <div className={`signal-item signal-${item.tone}`} key={item.label}>
                <strong>{item.value}</strong><span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="platform" className="paper-section platform-section">
          <div className="container platform-grid">
            <div className="section-index"><span>01</span><i /><span>PLATFORM NOTE</span></div>
            <div className="platform-copy">
              <span className="mono-label">ONE LAYER / MANY MOMENTS</span>
              <h2>Less queue.<br /><em>More campus.</em></h2>
              <p>Give every event a clear front door. OrbitCheck makes the operational layer feel as considered as the experience itself, from the first tap to the last person in the room.</p>
              <div className="metric-row">
                <div><strong>01</strong><span>shared event link</span></div>
                <div><strong>∞</strong><span>ways to discover</span></div>
                <div><strong>0</strong><span>duplicate entries</span></div>
              </div>
              <button className="inline-link" type="button" onClick={() => scrollTo("workflow")}>See the system <ArrowUpRight size={15} /></button>
            </div>
            <div className="platform-visual">
              <div className="visual-caption"><span>FIELD NOTE 01</span><span>DESIGNED TO MOVE</span></div>
              <div className="visual-frame visual-board">
                <div className="board-top"><span>ORBITCHECK / WEDNESDAY</span><span>LIVE MAP / 03</span></div>
                <div className="campus-map" aria-label="Campus event live map">
                  <span className="map-road map-road-one" /><span className="map-road map-road-two" /><span className="map-road map-road-three" />
                  <span className="map-building building-one" /><span className="map-building building-two" /><span className="map-building building-three" /><span className="map-building building-four" />
                  <span className="map-pin pin-one"><i /><b>HALL B</b></span><span className="map-pin pin-two"><i /><b>NORTH QUAD</b></span><span className="map-pin pin-three"><i /><b>ROOM 04</b></span>
                  <span className="map-center"><strong>03</strong><small>LIVE<br />EVENTS</small></span>
                </div>
                <div className="board-bottom"><div><span>DESIGN SOCIETY</span><strong>82% capacity</strong></div><div><span>LAST SCAN</span><strong>00:14 ago</strong></div><div><span>STATUS</span><strong className="board-status"><i /> clear</strong></div></div>
                <div className="visual-callout callout-one"><span className="callout-dot" /> one clear pass</div>
                <div className="visual-callout callout-two"><span className="callout-dot" /> live room signal</div>
                <div className="visual-stamp">OC<br /><span>FIELD<br />SYSTEM</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-dark signal-section">
          <div className="container signal-section-grid">
            <div className="signal-section-copy">
              <span className="mono-label">02 / ORGANIZER CONTROL</span>
              <h2>Know what is<br /><em>happening now.</em></h2>
              <p>Build a rhythm people can feel. Keep the room visible without turning the room into a spreadsheet.</p>
              <div className="status-card">
                <div className="status-card-top"><span><i className="status-dot" /> Demo signal</span><span>Live / 07:42</span></div>
                <div className="status-card-line"><strong>Design Society — Hall B</strong><span>82%</span></div>
                <div className="progress-line"><i /></div>
                <div className="status-card-bottom"><span>156 checked in</span><span>34 spots left</span></div>
              </div>
            </div>
            <div className="feature-list">
              <article className="feature-row"><span className="feature-number">01</span><div><h3>Duplicate-proof by default</h3><p>Every scan is validated in the moment, so the line stays human and the data stays clean.</p></div><ArrowUpRight size={18} /></article>
              <article className="feature-row"><span className="feature-number">02</span><div><h3>Capacity you can actually use</h3><p>Make room for a better decision with a simple signal, not a wall of admin panels.</p></div><ArrowUpRight size={18} /></article>
              <article className="feature-row"><span className="feature-number">03</span><div><h3>A better front door for attendees</h3><p>Discovery, digital passes, and arrival live in the same visual language from day one.</p></div><ArrowUpRight size={18} /></article>
            </div>
          </div>
        </section>

        <section id="workflow" className="paper-section workflow-section">
          <div className="container">
            <div className="workflow-heading"><div><span className="mono-label">03 / THE MOVEMENT</span><h2>From signal<br /><em>to shared moment.</em></h2></div><p>Four small actions. One much clearer event day.</p></div>
            <div className="workflow-path" aria-label="OrbitCheck workflow">
              {workflow.map(({ number, title, copy, icon: Icon }, index) => (
                <article className={`workflow-step workflow-step-${index + 1}`} key={number}>
                  <div className="workflow-step-top"><span>{number}</span><Icon size={19} /></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  {index < workflow.length - 1 && <span className="workflow-connector" aria-hidden="true"><ArrowRight size={15} /></span>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="cta-section">
          <div className="container cta-card">
            <div className="cta-orbit" aria-hidden="true"><span /><span /><span /></div>
            <div className="cta-copy"><span className="mono-label">READY WHEN THE ROOM IS</span><h2>Make arrival<br /><em>feel effortless.</em></h2></div>
            <div className="cta-actions"><p>Bring the next campus moment into focus with a clearer way to discover, enter, and keep moving.</p><button className="button button-dark" type="button" onClick={() => setRole("organizer")}>Open organizer demo <ArrowRight size={16} /></button><button className="cta-secondary" type="button" onClick={() => setRole("attendee")}>I’m here to attend <ArrowUpRight size={15} /></button></div>
          </div>
        </section>
      </main>

      <footer className="footer section-dark">
        <div className="container footer-top"><button className="brand footer-brand" type="button" onClick={() => scrollTo("top")}><span className="brand-mark"><img src={MARK_ASSET} alt="" /></span><span className="brand-wordmark">Orbit<span>Check</span><small>Campus events / check-in</small></span></button><div className="footer-note"><span className="mono-label">A SMALLER QUEUE FOR A BIGGER MOMENT</span><strong>Built for the people who make campus feel alive.</strong></div><div className="footer-links"><button type="button" onClick={() => scrollTo("platform")}>Platform</button><button type="button" onClick={() => scrollTo("workflow")}>How it works</button><button type="button" onClick={() => setRole("organizer")}>Sign in <ArrowUpRight size={13} /></button></div></div>
        <div className="container footer-bottom"><span>© 2024 OrbitCheck / Demo interface</span><span>System status <i className="status-dot" /> All signals clear</span><span>Made for the moment in between.</span></div>
      </footer>

      {role && (
        <div className="modal-backdrop" role="presentation" onClick={() => setRole(null)}>
          <div className="role-modal" role="dialog" aria-modal="true" aria-labelledby="role-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setRole(null)} aria-label="Close demo selector"><X size={18} /></button>
            <span className="modal-kicker">ORBITCHECK / DEMO MODE</span>
            <h2 id="role-title">Choose your<br /><em>point of view.</em></h2>
            <p>Pick the way you want to experience the event layer. This demo stays local and is ready to connect to your real flow.</p>
            <div className="role-options">
              <button className={role === "organizer" ? "role-option active" : "role-option"} type="button" onClick={() => setRole("organizer")}><span className="role-option-icon"><LocateFixed size={18} /></span><span><strong>Organizer</strong><small>See the room, manage the moment.</small></span>{role === "organizer" && <Check size={17} />}</button>
              <button className={role === "attendee" ? "role-option active" : "role-option"} type="button" onClick={() => setRole("attendee")}><span className="role-option-icon"><Users size={18} /></span><span><strong>Attendee</strong><small>Find the event, scan in, keep moving.</small></span>{role === "attendee" && <Check size={17} />}</button>
            </div>
            <button className="button button-primary modal-continue" type="button" onClick={() => setRole(null)}>Continue to {role} demo <ArrowRight size={16} /></button>
            <div className="modal-footnote"><Clock3 size={13} /> Demo only / no account required</div>
          </div>
        </div>
      )}
    </div>
  );
}

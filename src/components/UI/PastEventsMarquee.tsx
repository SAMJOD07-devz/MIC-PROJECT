'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PastEventDetailModal, PastEventDetailed } from '@/components/Modals/PastEventDetailModal';
import { playClickSFX, playHoverSFX } from '@/lib/audio';
import { ArrowUpRight, Trophy, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const VIT_CHENNAI_EVENTS_DETAILED: PastEventDetailed[] = [
  {
    id: 'vitc-1',
    title: 'MIC CodeStorm 2025',
    category: 'Flagship Hackathon',
    attendees: '850+ Hackers',
    date: 'Jan 24, 2025',
    location: 'AB1 Auditorium, VITC',
    badge: 'MIC FLAGSHIP',
    gradient: 'from-purple-600 via-indigo-600 to-pink-500',
    organizer: 'Microsoft Innovations Club',
    prizePool: '₹1,50,000',
    description: 'A 24-hour flagship hackathon hosted by MIC VITC focusing on AI Agents, Web3 Infra, and Campus Tech Solutions.',
    winners: [
      { position: '1st Place', teamName: 'Team NeuralX', projectName: 'AI Gate Check-In Agent', prizeMoney: '₹75,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team ByteCraft', projectName: 'Offline IndexedDB Sync', prizeMoney: '₹45,000', college: 'VIT Chennai' },
      { position: '3rd Place', teamName: 'Team DevPulse', projectName: 'Smart Roster Exporter', prizeMoney: '₹30,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'MIC Event Lead', role: 'President & Tech Lead', email: 'president.mic@vitstudent.ac.in', phone: '+91 98765 43210' },
      { name: 'Ananya Sharma', role: 'Operations Head', email: 'ananya.sharma2025@vitstudent.ac.in', phone: '+91 98765 43211' },
    ],
    stats: { scansPerMinute: 120, avgLatencyMs: 78, duplicateBlocked: 34 }
  },
  {
    id: 'vitc-2',
    title: 'technoVIT 2025',
    category: 'Annual Tech Fest',
    attendees: '6,500+ Attendees',
    date: 'Feb 14-16, 2025',
    location: 'AB1 & AB2 Lawns, VITC',
    badge: 'CAMPUS FEST',
    gradient: 'from-blue-600 via-cyan-600 to-indigo-700',
    organizer: 'VIT Chennai Student Council',
    prizePool: '₹3,00,000',
    description: 'VIT Chennai flagship annual technical extravaganza featuring robotics arenas, drone racing, gaming tournaments, and technical papers.',
    winners: [
      { position: '1st Place', teamName: 'Team Cyberbot', projectName: 'Autonomous Drone Navigator', prizeMoney: '₹1,50,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team AeroSpark', projectName: 'Solar Haptic Rover', prizeMoney: '₹90,000', college: 'IIT Madras' },
      { position: '3rd Place', teamName: 'Team RoboNexus', projectName: 'Micro-Grid Controller', prizeMoney: '₹60,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'Karthik Raja', role: 'technoVIT Convenor', email: 'karthik.r2025@vitstudent.ac.in', phone: '+91 98765 43213' },
    ],
    stats: { scansPerMinute: 180, avgLatencyMs: 65, duplicateBlocked: 112 }
  },
  {
    id: 'vitc-3',
    title: 'MIC DevSpace 2025',
    category: 'Dev Conference',
    attendees: '1,100+ Attendees',
    date: 'Mar 10, 2025',
    location: 'Admin Block Auditorium, VITC',
    badge: 'MIC DEV CONF',
    gradient: 'from-pink-600 via-purple-600 to-rose-500',
    organizer: 'Microsoft Innovations Club',
    prizePool: '₹1,00,000',
    description: 'Developer conference featuring industry speakers from Microsoft, Google, and open-source leads sharing insights on Cloud Native & Next.js.',
    winners: [
      { position: '1st Place', teamName: 'Team CloudSync', projectName: 'Distributed Edge Vault', prizeMoney: '₹50,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team DevPulse', projectName: 'Real-Time Telemetry Engine', prizeMoney: '₹30,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'MIC Event Lead', role: 'MIC President', email: 'president.mic@vitstudent.ac.in', phone: '+91 98765 43210' },
    ],
    stats: { scansPerMinute: 95, avgLatencyMs: 82, duplicateBlocked: 18 }
  },
  {
    id: 'vitc-4',
    title: 'Vibrance 2025',
    category: 'Cultural Mega-Fest',
    attendees: '9,200+ Attendees',
    date: 'Apr 04-06, 2025',
    location: 'MG Block Grounds, VITC',
    badge: 'MEGA CULTURAL',
    gradient: 'from-amber-500 via-pink-600 to-purple-600',
    organizer: 'VIT Chennai Events Board',
    prizePool: '₹2,50,000',
    description: 'The largest annual cultural festival of VIT Chennai with pro-nights, battle of the bands, choreography competitions, and fashion showcases.',
    winners: [
      { position: '1st Place', teamName: 'Team RhythmX', projectName: 'Western Dance Championship', prizeMoney: '₹1,20,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'Divya Nambiar', role: 'Vibrance General Secretary', email: 'divya.n2025@vitstudent.ac.in', phone: '+91 98765 43216' },
    ],
    stats: { scansPerMinute: 220, avgLatencyMs: 62, duplicateBlocked: 210 }
  },
  {
    id: 'vitc-5',
    title: 'HackVIT Chennai 2025',
    category: '24-Hour AI Hackathon',
    attendees: '750+ Hackers',
    date: 'Oct 18, 2025',
    location: 'AB3 Cyber Labs, VITC',
    badge: 'AI & WEB3',
    gradient: 'from-emerald-600 via-teal-600 to-blue-600',
    organizer: 'MIC & ACM VITC',
    prizePool: '₹1,20,000',
    description: 'A 24-hour hackathon focused on Generative AI pipelines, intelligent campus automation, and decentralized credentials.',
    winners: [
      { position: '1st Place', teamName: 'Team AgenticAI', projectName: 'Autonomous Campus Concierge', prizeMoney: '₹60,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'MIC Event Lead', role: 'MIC President', email: 'president.mic@vitstudent.ac.in', phone: '+91 98765 43210' },
    ],
    stats: { scansPerMinute: 110, avgLatencyMs: 74, duplicateBlocked: 29 }
  },
];

interface PastEventsMarqueeProps {
  onRegister?: () => void;
}

export function PastEventsMarquee({ onRegister }: PastEventsMarqueeProps) {
  const [selectedEvent, setSelectedEvent] = useState<PastEventDetailed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const marqueeItems = [...VIT_CHENNAI_EVENTS_DETAILED, ...VIT_CHENNAI_EVENTS_DETAILED];

  const handleCardClick = (item: PastEventDetailed) => {
    playClickSFX();
    setSelectedEvent(item);
    setIsPaused(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
  };

  return (
    <>
      <section className="paper-section py-12 overflow-hidden border-t border-b border-[#16151a]/15 bg-[#f0ede7]">
        {/* Section Header */}
        <div className="container mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e443b4] animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#827d87] uppercase">
                  01 / CLUBS LIVE NOW &amp; PAST MANAGED EVENTS
                </span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#16151a] tracking-tight">
                VIT Chennai Campus Event Feed
              </h2>
            </div>
            <p className="font-mono text-xs text-[#827d87] max-w-xs">
              Hover to pause. Click any card to inspect winners, prize pools, and gate scan metrics.
            </p>
          </div>
        </div>

        {/* Endless Marquee Loop Track */}
        <div
          className="relative w-full flex overflow-hidden cursor-pointer py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!isModalOpen) setIsPaused(false);
          }}
        >
          <motion.div
            className="flex gap-6 shrink-0"
            animate={{
              x: isPaused ? undefined : ['0%', '-50%'],
            }}
            transition={{
              ease: 'linear',
              duration: 35,
              repeat: Infinity,
            }}
          >
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleCardClick(item)}
                onMouseEnter={playHoverSFX}
                className="w-80 sm:w-96 rounded-2xl border border-[#16151a]/15 bg-[#fffdf9] p-5 shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-[#e443b4] shrink-0 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Colored Top Accent Bar per Fest */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />

                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#e443b4] uppercase bg-[#e443b4]/10 border border-[#e443b4]/20 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#827d87] font-medium">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-extrabold text-[#16151a] leading-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#67626a] font-light leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="pt-4 border-t border-[#16151a]/10 space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-mono text-[#16151a]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Trophy className="w-3.5 h-3.5 text-[#e443b4]" />
                      {item.prizePool}
                    </span>
                    <span className="text-[#827d87]">{item.attendees}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-[#827d87]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#7a54ff]" />
                      {item.date}
                    </span>
                    <span className="font-bold text-[#16151a] flex items-center gap-1">
                      Inspect <ArrowUpRight className="w-3 h-3 text-[#e443b4]" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      <PastEventDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        onRegister={onRegister}
      />
    </>
  );
}

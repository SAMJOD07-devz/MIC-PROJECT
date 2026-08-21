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
      { name: 'Saumya Gaurav', role: 'President & Tech Lead', email: 'saumya.gauravkumar2025@vitstudent.ac.in', phone: '+91 98765 43210' },
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
      { name: 'Saumya Gaurav', role: 'MIC President', email: 'saumya.gauravkumar2025@vitstudent.ac.in', phone: '+91 98765 43210' },
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
      { name: 'Saumya Gaurav', role: 'MIC President', email: 'saumya.gauravkumar2025@vitstudent.ac.in', phone: '+91 98765 43210' },
    ],
    stats: { scansPerMinute: 110, avgLatencyMs: 74, duplicateBlocked: 29 }
  },
];

export function PastEventsMarquee() {
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
      <section className="paper-section py-16 overflow-hidden border-t border-b border-[#16151a]/15 bg-[#f0ede7]">
        {/* Kinetic Editorial Section Header */}
        <div className="container mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="mono-label text-[#827d87]">04 / VERIFIED TRACK RECORD</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#16151a] tracking-tight mt-2">
              Managed VITC Events.
            </h2>
          </div>
          <p className="text-sm text-[#67626a] max-w-sm">
            Click any event plate to view verified winners, prize money & student coordinator contacts.
          </p>
        </div>

        {/* Marquee Track */}
        <div className="flex w-max">
          <motion.div
            className="flex space-x-6 pr-6"
            animate={{ x: isPaused ? undefined : ['0%', '-50%'] }}
            transition={{
              ease: 'linear',
              duration: 32,
              repeat: Infinity,
            }}
          >
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                onClick={() => handleCardClick(item)}
                onMouseEnter={playHoverSFX}
                className="w-80 shrink-0 relative bg-[#fffdf9] border border-[#16151a]/15 p-6 transition-transform duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
                style={{
                  borderTop: index % 4 === 0 ? '3px solid #e443b4' : index % 4 === 1 ? '3px solid #4b79ff' : index % 4 === 2 ? '3px solid #f06f48' : '3px solid #16151a'
                }}
              >
                {/* Header Meta */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#827d87] uppercase tracking-wider mb-3">
                    <span>{item.category}</span>
                    <span className="font-bold text-[#e443b4]">{item.badge}</span>
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
                      Details <ArrowUpRight className="w-3 h-3 text-[#e443b4]" />
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
      />
    </>
  );
}

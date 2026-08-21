'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, MapPin, Trophy, ArrowUpRight } from 'lucide-react';
import { PastEventDetailModal, PastEventDetailed } from '@/components/Modals/PastEventDetailModal';
import { playClickSFX, playHoverSFX } from '@/lib/audio';

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
    description: 'A 24-hour flagship hackathon hosted by MIC VITC focusing on AI Agents, Web3 Infra, and Campus Tech Solutions. Over 200 teams built cutting-edge prototypes.',
    winners: [
      { position: '1st Place', teamName: 'Team NeuralX', projectName: 'AI Gate Check-In Agent', prizeMoney: '₹75,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team ByteCraft', projectName: 'Offline IndexedDB Sync', prizeMoney: '₹45,000', college: 'VIT Chennai' },
      { position: '3rd Place', teamName: 'Team DevPulse', projectName: 'Smart Roster Exporter', prizeMoney: '₹30,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'Saumya Gaurav', role: 'President & Tech Lead', email: 'saumya.gauravkumar2025@vitstudent.ac.in', phone: '+91 98765 43210' },
      { name: 'Ananya Sharma', role: 'Operations Head', email: 'ananya.sharma2025@vitstudent.ac.in', phone: '+91 98765 43211' },
      { name: 'Rohan Verma', role: 'QR Infra Coordinator', email: 'rohan.verma2025@vitstudent.ac.in', phone: '+91 98765 43212' },
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
    description: 'VIT Chennai flagship annual technical extravaganza featuring robotics arenas, drone racing, gaming tournaments, and technical paper presentations.',
    winners: [
      { position: '1st Place', teamName: 'Team Cyberbot', projectName: 'Autonomous Drone Navigator', prizeMoney: '₹1,50,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team AeroSpark', projectName: 'Solar Haptic Rover', prizeMoney: '₹90,000', college: 'IIT Madras' },
      { position: '3rd Place', teamName: 'Team RoboNexus', projectName: 'Micro-Grid Controller', prizeMoney: '₹60,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'Karthik Raja', role: 'technoVIT Student Convenor', email: 'karthik.r2025@vitstudent.ac.in', phone: '+91 98765 43213' },
      { name: 'Priya Sundaram', role: 'Gate Security Lead', email: 'priya.s2025@vitstudent.ac.in', phone: '+91 98765 43214' },
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
    description: 'Annual developer conference featuring industry speakers from Microsoft, Google, and open-source leads sharing insights on Cloud Native, Next.js, and Distributed Systems.',
    winners: [
      { position: '1st Place', teamName: 'Team CloudSync', projectName: 'Distributed Edge Vault', prizeMoney: '₹50,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team DevPulse', projectName: 'Real-Time Telemetry Engine', prizeMoney: '₹30,000', college: 'VIT Chennai' },
      { position: '3rd Place', teamName: 'Team OpenMesh', projectName: 'Zero-Knowledge Auth', prizeMoney: '₹20,000', college: 'SRM KTR' },
    ],
    coordinators: [
      { name: 'Saumya Gaurav', role: 'MIC President', email: 'saumya.gauravkumar2025@vitstudent.ac.in', phone: '+91 98765 43210' },
      { name: 'Vikram Sethi', role: 'Speaker Coordinator', email: 'vikram.sethi2025@vitstudent.ac.in', phone: '+91 98765 43215' },
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
      { position: '2nd Place', teamName: 'Team AcousticPulse', projectName: 'Battle of Bands Winner', prizeMoney: '₹80,000', college: 'Loyola Chennai' },
      { position: '3rd Place', teamName: 'Team RunwayCouture', projectName: 'Fashion Show Winner', prizeMoney: '₹50,000', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'Divya Nambiar', role: 'Vibrance General Secretary', email: 'divya.n2025@vitstudent.ac.in', phone: '+91 98765 43216' },
      { name: 'Arjun Menon', role: 'Pro-Night Gate Head', email: 'arjun.m2025@vitstudent.ac.in', phone: '+91 98765 43217' },
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
    description: 'A intense 24-hour hackathon focused on Generative AI pipelines, intelligent campus automation, and decentralized credentials.',
    winners: [
      { position: '1st Place', teamName: 'Team AgenticAI', projectName: 'Autonomous Campus Concierge', prizeMoney: '₹60,000', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Team SecurePass', projectName: 'Biometric QR Hash Engine', prizeMoney: '₹40,000', college: 'VIT Chennai' },
      { position: '3rd Place', teamName: 'Team Synthetix', projectName: 'Smart Roster Predictor', prizeMoney: '₹20,000', college: 'SSN Chennai' },
    ],
    coordinators: [
      { name: 'Saumya Gaurav', role: 'MIC President', email: 'saumya.gauravkumar2025@vitstudent.ac.in', phone: '+91 98765 43210' },
      { name: 'Deepak Raj', role: 'ACM Chapter Lead', email: 'deepak.r2025@vitstudent.ac.in', phone: '+91 98765 43218' },
    ],
    stats: { scansPerMinute: 110, avgLatencyMs: 74, duplicateBlocked: 29 }
  },
  {
    id: 'vitc-6',
    title: 'TEDxVITChennai 2025',
    category: 'Ideas Symposium',
    attendees: '450+ VIP Guests',
    date: 'Nov 12, 2025',
    location: 'Netaji Auditorium, VITC',
    badge: 'KEYNOTE TALKS',
    gradient: 'from-red-600 via-rose-600 to-purple-700',
    organizer: 'TEDx VITC Committee',
    prizePool: '₹50,000',
    description: 'Independently organized TED event featuring 8 multidisciplinary speakers on science, design, climate resilience, and spatial computing.',
    winners: [
      { position: '1st Place', teamName: 'Distinguished Speaker', projectName: 'Keynote: Spatial AI & Human Future', prizeMoney: 'TEDx Curator Award', college: 'VIT Chennai' },
      { position: '2nd Place', teamName: 'Student Innovator', projectName: 'Zero-Carbon Campus Initiative', prizeMoney: 'Innovator Grant', college: 'VIT Chennai' },
      { position: '3rd Place', teamName: 'Design Fellow', projectName: 'Typography in Public Computing', prizeMoney: 'Design Fellow Award', college: 'VIT Chennai' },
    ],
    coordinators: [
      { name: 'Meera Pillai', role: 'TEDx Licensee & Lead', email: 'meera.p2025@vitstudent.ac.in', phone: '+91 98765 43219' },
      { name: 'Varun Nair', role: 'VIP Hospitality Head', email: 'varun.n2025@vitstudent.ac.in', phone: '+91 98765 43220' },
    ],
    stats: { scansPerMinute: 70, avgLatencyMs: 88, duplicateBlocked: 8 }
  }
];

export function PastEventsMarquee() {
  const [selectedEvent, setSelectedEvent] = useState<PastEventDetailed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Double array for continuous smooth loop
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
      <div className="w-full overflow-hidden py-8 relative bg-slate-50/60 border-y border-slate-200/80">
        {/* Subtle Side Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-[11px] font-bold text-purple-800 uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
            VIT Chennai Events Track Record
          </div>
          <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900">
            Managed & Verified VITC Campus Fests
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-light mt-1.5">
            Click any event card to view winners, prize money & student coordinators.
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
                className="editorial-card w-80 shrink-0 rounded-3xl p-5 bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
              >
                {/* CLEAN UN-STACKED BRANDED GRAPHIC HEADER (No repeated titles/badges) */}
                <div className={`relative h-40 rounded-2xl overflow-hidden mb-4 bg-gradient-to-tr ${item.gradient} p-4 flex flex-col justify-between shadow-xs border border-white/20`}>
                  
                  {/* Background Soft Glow & Pattern */}
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />
                  
                  {/* Top Row: Single MIC Badge */}
                  <div className="flex justify-between items-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-md border border-white/25 px-2.5 py-1 rounded-xl text-[10px] font-bold text-white shadow-xs">
                      <div className="grid grid-cols-2 gap-0.5 w-3 h-3 shrink-0">
                        <span className="bg-[#f25022] rounded-[0.5px]" />
                        <span className="bg-[#7fba00] rounded-[0.5px]" />
                        <span className="bg-[#00a4ef] rounded-[0.5px]" />
                        <span className="bg-[#ffb900] rounded-[0.5px]" />
                      </div>
                      <span>MIC VITC</span>
                    </div>

                    <span className="text-[10px] font-extrabold text-white/90 bg-white/20 border border-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  {/* Center Minimal Icon Artwork */}
                  <div className="relative z-10 my-auto flex justify-center">
                    <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
                      <Trophy className="w-8 h-8 text-white/95" />
                    </div>
                  </div>

                  {/* Bottom Single Metric Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {item.attendees}
                    </span>

                    <span className="text-[10px] font-extrabold text-white bg-white/20 border border-white/30 px-2 py-0.5 rounded-lg">
                      Prize: {item.prizePool}
                    </span>
                  </div>
                </div>

                {/* Clean Metadata Card Below Graphic */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 block mb-1">
                    {item.category}
                  </span>
                  
                  {/* Single Source of Truth Title */}
                  <h4 className="font-heading text-lg font-bold text-slate-900 group-hover:text-purple-600 transition leading-snug">
                    {item.title}
                  </h4>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 truncate max-w-[150px]" title={item.location}>
                      <MapPin className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  </div>

                  {/* Clean Action Callout */}
                  <div className="mt-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 group-hover:text-pink-600 transition">
                      View Winners & Coordinators <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Interactive Winner & Student Coordinator Details Modal */}
      <PastEventDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </>
  );
}

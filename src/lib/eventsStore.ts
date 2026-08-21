import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StoredEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  capacity: number;
  registeredCount: number;
  checkedInCount: number;
  remainingCapacity: number;
  isFull: boolean;
  organizer: { id: string; name: string; email: string };
}

export interface StoredTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  attendeeId: string;
  attendeeEmail: string;
  qrToken: string;
  qrTokenHash: string;
  status: "REGISTERED" | "CHECKED_IN" | "CANCELLED";
  registeredAt: string;
  checkInTime?: string;
}

export interface StoredCheckIn {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  checkInTime: string;
  deviceId: string;
}

interface DBData {
  events: StoredEvent[];
  tickets: StoredTicket[];
  checkIns: StoredCheckIn[];
}

const DB_FILE_PATH = path.join(process.cwd(), ".orbitcheck-db.json");

const DEFAULT_EVENTS: StoredEvent[] = [
  {
    id: "evt-demo-1",
    title: "MIC Tech Summit & Recruitment 2026",
    description: "Join top engineering teams for technical keynotes, coding challenges, and recruiter check-in.",
    date: new Date(Date.now() + 86400000).toISOString(),
    capacity: 50,
    registeredCount: 3,
    checkedInCount: 1,
    remainingCapacity: 47,
    isFull: false,
    organizer: { id: "org-demo-1", name: "Campus Organizer Admin", email: "organizer@vitstudent.ac.in" },
  },
  {
    id: "evt-demo-2",
    title: "AI Agentic Development Workshop",
    description: "Hands-on session building autonomous coding agents and real-time event infrastructure.",
    date: new Date(Date.now() + 172800000).toISOString(),
    capacity: 30,
    registeredCount: 30,
    checkedInCount: 15,
    remainingCapacity: 0,
    isFull: true,
    organizer: { id: "org-demo-1", name: "Campus Organizer Admin", email: "organizer@vitstudent.ac.in" },
  },
  {
    id: "evt-demo-3",
    title: "MIC CodeStorm 2026",
    description: "24-hour flagship hackathon focusing on AI Agents, Web3 Infra, and Campus Tech Solutions.",
    date: new Date(Date.now() + 259200000).toISOString(),
    capacity: 100,
    registeredCount: 12,
    checkedInCount: 0,
    remainingCapacity: 88,
    isFull: false,
    organizer: { id: "org-demo-1", name: "Campus Organizer Admin", email: "organizer@vitstudent.ac.in" },
  },
];

const DEFAULT_TICKETS: StoredTicket[] = [
  {
    id: "tkt-demo-1",
    eventId: "evt-demo-1",
    eventTitle: "MIC Tech Summit & Recruitment 2026",
    eventDescription: "Join top engineering teams for technical keynotes, coding challenges, and recruiter check-in.",
    eventDate: new Date(Date.now() + 86400000).toISOString(),
    attendeeId: "att-demo-1",
    attendeeEmail: "attendee1@vitstudent.ac.in",
    qrToken: "ORBIT-REG-DEMO-att-demo-1-EVT1",
    qrTokenHash: crypto.createHash("sha256").update("ORBIT-REG-DEMO-att-demo-1-EVT1").digest("hex"),
    status: "REGISTERED",
    registeredAt: new Date().toISOString(),
  },
];

function readDB(): DBData {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(fileData);
      if (parsed && Array.isArray(parsed.events)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading db file, re-initializing:", err);
  }

  const initialDB: DBData = {
    events: DEFAULT_EVENTS,
    tickets: DEFAULT_TICKETS,
    checkIns: [],
  };
  writeDB(initialDB);
  return initialDB;
}

function writeDB(data: DBData): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db file:", err);
  }
}

export function getAllEvents(): StoredEvent[] {
  const db = readDB();
  return db.events;
}

export function getEventById(id: string): StoredEvent | undefined {
  const db = readDB();
  const cleanId = decodeURIComponent(id || "").trim().toLowerCase();
  return db.events.find((e) => e.id.toLowerCase() === cleanId);
}

export function addEvent(event: Omit<StoredEvent, "id" | "registeredCount" | "checkedInCount" | "remainingCapacity" | "isFull">): StoredEvent {
  const db = readDB();
  const newEvent: StoredEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    registeredCount: 0,
    checkedInCount: 0,
    remainingCapacity: event.capacity,
    isFull: false,
  };
  // Insert at beginning so newly created events appear FIRST in lists
  db.events.unshift(newEvent);
  writeDB(db);
  return newEvent;
}

export function getTicketsForAttendee(attendeeEmail: string): StoredTicket[] {
  const db = readDB();
  return db.tickets.filter((t) => t.attendeeEmail.toLowerCase() === attendeeEmail.toLowerCase());
}

export function registerAttendeeForEvent(eventId: string, attendeeId: string, attendeeEmail: string): { ticket: StoredTicket; event: StoredEvent } {
  const db = readDB();
  const cleanId = decodeURIComponent(eventId || "").trim().toLowerCase();
  const evtIndex = db.events.findIndex((e) => e.id.toLowerCase() === cleanId);

  if (evtIndex === -1) {
    throw new Error("EVENT_NOT_FOUND");
  }

  const event = db.events[evtIndex];
  if (event.registeredCount >= event.capacity) {
    throw new Error("EVENT_FULL");
  }

  const existing = db.tickets.find((t) => t.eventId.toLowerCase() === cleanId && t.attendeeEmail.toLowerCase() === attendeeEmail.toLowerCase());
  if (existing) {
    throw new Error("ALREADY_REGISTERED");
  }

  const rawToken = `ORBIT-ATT-${event.id.substring(0, 8).toUpperCase()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const newTicket: StoredTicket = {
    id: `tkt-${Date.now()}`,
    eventId: event.id,
    eventTitle: event.title,
    eventDescription: event.description,
    eventDate: event.date,
    attendeeId,
    attendeeEmail,
    qrToken: rawToken,
    qrTokenHash: tokenHash,
    status: "REGISTERED",
    registeredAt: new Date().toISOString(),
  };

  event.registeredCount += 1;
  event.remainingCapacity = Math.max(0, event.capacity - event.registeredCount);
  event.isFull = event.remainingCapacity === 0;

  db.tickets.push(newTicket);
  writeDB(db);

  return { ticket: newTicket, event };
}

export function processCheckInToken(token: string): { checkIn: StoredCheckIn; ticket: StoredTicket; event: StoredEvent } {
  const db = readDB();
  const trimmed = token.trim();

  const ticket = db.tickets.find((t) => t.qrToken === trimmed || t.qrTokenHash === trimmed);
  if (!ticket) {
    throw new Error("INVALID_TOKEN");
  }

  if (ticket.status === "CHECKED_IN") {
    const checkInLog = db.checkIns.find((c) => c.attendeeEmail === ticket.attendeeEmail && c.eventId === ticket.eventId);
    const err = new Error("DUPLICATE_SCAN");
    (err as any).originalCheckInTime = checkInLog?.checkInTime || ticket.checkInTime;
    throw err;
  }

  const event = db.events.find((e) => e.id.toLowerCase() === ticket.eventId.toLowerCase());
  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  const nowStr = new Date().toISOString();
  ticket.status = "CHECKED_IN";
  ticket.checkInTime = nowStr;

  event.checkedInCount += 1;

  const checkInRecord: StoredCheckIn = {
    id: `chk-${Date.now()}`,
    eventId: event.id,
    eventTitle: event.title,
    attendeeId: ticket.attendeeId,
    attendeeName: ticket.attendeeEmail.split("@")[0],
    attendeeEmail: ticket.attendeeEmail,
    checkInTime: nowStr,
    deviceId: "webcam-scanner-1",
  };

  db.checkIns.unshift(checkInRecord);
  writeDB(db);

  return { checkIn: checkInRecord, ticket, event };
}

export function getDashboardMetrics(eventId: string) {
  const db = readDB();
  const cleanId = decodeURIComponent(eventId || "").trim().toLowerCase();
  const event = db.events.find((e) => e.id.toLowerCase() === cleanId);
  if (!event) return null;

  const eventCheckIns = db.checkIns.filter((c) => c.eventId.toLowerCase() === cleanId);
  const checkInPercentage = event.registeredCount > 0 ? Math.round((event.checkedInCount / event.registeredCount) * 1000) / 10 : 0;
  
  const eventHasStarted = new Date() >= new Date(event.date) || event.checkedInCount > 0;
  const noShowCount = eventHasStarted ? Math.max(0, event.registeredCount - event.checkedInCount) : 0;
  const pendingArrivals = Math.max(0, event.registeredCount - event.checkedInCount);

  return {
    eventId: event.id,
    eventTitle: event.title,
    capacity: event.capacity,
    registeredCount: event.registeredCount,
    checkedInCount: event.checkedInCount,
    remainingCapacity: event.remainingCapacity,
    noShowCount,
    pendingArrivals,
    eventHasStarted,
    checkInPercentage,
    peakCheckInTime: eventCheckIns.length > 0 ? new Date(eventCheckIns[0].checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "N/A",
    recentCheckIns: eventCheckIns.slice(0, 10),
  };
}

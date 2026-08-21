import { Role, RegistrationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding OrbitCheck database with VIT student & demo accounts...");

  // Clean existing data
  await prisma.checkIn.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Seed Organizers
  const organizer = await prisma.user.create({
    data: {
      email: "organizer@orbitcheck.com",
      name: "Dev Operations Lead",
      passwordHash,
      role: Role.ORGANIZER,
    },
  });

  const organizerVit = await prisma.user.create({
    data: {
      email: "organizer@vitstudent.ac.in",
      name: "MIC VITC Coordinator",
      passwordHash,
      role: Role.ORGANIZER,
    },
  });

  // 2. Create Seed Attendees
  const attendee1 = await prisma.user.create({
    data: {
      email: "attendee1@orbitcheck.com",
      name: "Alex Rivera",
      passwordHash,
      role: Role.ATTENDEE,
    },
  });

  const attendee1Vit = await prisma.user.create({
    data: {
      email: "attendee1@vitstudent.ac.in",
      name: "MIC Organizer (VITC)",
      passwordHash,
      role: Role.ATTENDEE,
    },
  });

  const attendee2 = await prisma.user.create({
    data: {
      email: "attendee2@orbitcheck.com",
      name: "Sophia Chen",
      passwordHash,
      role: Role.ATTENDEE,
    },
  });

  const attendee3 = await prisma.user.create({
    data: {
      email: "attendee3@orbitcheck.com",
      name: "Marcus Vance",
      passwordHash,
      role: Role.ATTENDEE,
    },
  });

  // 3. Create Seed Event
  const event = await prisma.event.create({
    data: {
      title: "MIC CodeStorm 2026 — Flagship AI Showcase",
      description: "Annual recruitment showcase and technical deep dive into modern event infrastructure at VIT Chennai.",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
      capacity: 100,
      organizerId: organizer.id,
    },
  });

  // Helper to generate seed QR token and hash
  function generateQrToken(seed: string) {
    const rawToken = `ORBIT-${seed}-${crypto.randomBytes(8).toString("hex")}`;
    const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hash };
  }

  // 4. Create Registrations
  const token1 = generateQrToken("ATT-1");
  const reg1 = await prisma.registration.create({
    data: {
      eventId: event.id,
      attendeeId: attendee1.id,
      qrToken: token1.rawToken,
      qrTokenHash: token1.hash,
      status: RegistrationStatus.REGISTERED,
    },
  });

  const tokenVit = generateQrToken("ATT-VIT");
  const regVit = await prisma.registration.create({
    data: {
      eventId: event.id,
      attendeeId: attendee1Vit.id,
      qrToken: tokenVit.rawToken,
      qrTokenHash: tokenVit.hash,
      status: RegistrationStatus.REGISTERED,
    },
  });

  const token2 = generateQrToken("ATT-2");
  await prisma.registration.create({
    data: {
      eventId: event.id,
      attendeeId: attendee2.id,
      qrToken: token2.rawToken,
      qrTokenHash: token2.hash,
      status: RegistrationStatus.REGISTERED,
    },
  });

  const token3 = generateQrToken("ATT-3");
  await prisma.registration.create({
    data: {
      eventId: event.id,
      attendeeId: attendee3.id,
      qrToken: token3.rawToken,
      qrTokenHash: token3.hash,
      status: RegistrationStatus.REGISTERED,
    },
  });

  // 5. Seed 1 Initial Check-In
  await prisma.checkIn.create({
    data: {
      eventId: event.id,
      registrationId: reg1.id,
      scannedByOrganizerId: organizer.id,
      checkInTime: new Date(),
    },
  });

  await prisma.registration.update({
    where: { id: reg1.id },
    data: { status: RegistrationStatus.CHECKED_IN },
  });

  console.log("✅ Seeding complete!");
  console.log(`   Organizer: organizer@vitstudent.ac.in (Password123!)`);
  console.log(`   Attendee: attendee1@vitstudent.ac.in (Password123!)`);
  console.log(`   Event: ${event.title} (Capacity: ${event.capacity})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

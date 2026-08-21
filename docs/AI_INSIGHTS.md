# OrbitCheck — Server-Side AI Event Insights Architecture

## 1. Safety & Ground-Truth Injection Architecture

OrbitCheck enforces strict architectural boundaries to guarantee that AI features **never** compromise database security or introduce hallucinated attendance figures:

1. **Read-Only / Isolated Boundary**:
   - The AI route (`POST /api/events/[id]/insights`) does NOT execute dynamic SQL queries or accept user-provided database commands.
   - Ground-truth figures (capacity, registrations, check-ins, peak windows, no-shows) are computed **deterministically** via Prisma prior to assembling the LLM prompt.

2. **Ground-Truth Injection**:
   - Pre-computed database metrics are injected into the system prompt as immutable JSON context.
   - System Prompt Rule: `"Rely ONLY on the ground-truth metrics provided below. Do NOT invent figures."`

3. **Fallback & Graceful Resilience**:
   - If `OPENAI_API_KEY` is missing, invalid (`sk-demo`), or the external API times out:
     - The application **does not crash or hang**.
     - Returns a clean JSON payload with `isFallback: true`, exact ground-truth metrics, and rule-based deterministic recommendations.

---

## 2. API Contract & Response Schema

### Request
`POST /api/events/[id]/insights`
```json
{
  "prompt": "Analyze check-in velocity and suggest operational improvements"
}
```

### Response (200 OK)
```json
{
  "query": "Analyze check-in velocity and suggest operational improvements",
  "isFallback": false,
  "metrics": {
    "eventId": "evt-123",
    "eventTitle": "MIC Tech Summit 2026",
    "capacity": 50,
    "registeredCount": 35,
    "checkedInCount": 25,
    "remainingCapacity": 15,
    "noShowCount": 10,
    "checkInPercentage": 71.4,
    "peakCheckInWindow": "12:05 PM (12 scans)"
  },
  "summary": "Check-in velocity is strong at 71.4% with peak arrival around 12:05 PM.",
  "recommendations": [
    "Keep scanner lanes open to clear remaining check-in queues.",
    "Send broadcast reminders to the 10 registered attendees who have not checked in."
  ]
}
```

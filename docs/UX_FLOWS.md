# UX_FLOWS.md  
Tend — MVP User Experience Flows  
Quiet, careful, safety‑aware design language

---

## 1. Steward Flow (Landowner / Property Manager)

### 1.1 Sign In
- User enters email and password.
- If first time, they complete a short profile (name, contact number, property role).
- System displays a calm, simple dashboard with clear next steps.

### 1.2 Dashboard Overview
- Shows:
  - Pending access requests
  - Active visitors on property
  - Property list
  - Availability status
- Tone: factual, steady, no marketing language.

### 1.3 View Property List
- Each property card shows:
  - Name
  - Location
  - Availability toggle
  - Safety notes (livestock, machinery, terrain)
- Steward selects a property to manage.

### 1.4 Create New Property
- Form fields:
  - Property name
  - Location (map pin)
  - Description (plain, practical)
  - Safety notes (required)
  - Rules (required)
  - Contact details
- Steward submits → property appears in dashboard.

### 1.5 Toggle Availability
- Steward switches property between:
  - **Available** (open for requests)
  - **Unavailable** (closed)
- System confirms the change with a small, non‑intrusive message.

### 1.6 Review Access Requests
- Each request shows:
  - Visitor name
  - Group size
  - Dates
  - Purpose
  - Acknowledged rules and safety notes
- Steward chooses **Approve** or **Decline**.

### 1.7 Approve Request
- Steward taps **Approve**.
- System:
  - Generates a confirmation
  - Sends visitor instructions
  - Moves request to “Upcoming Visits”

### 1.8 Decline Request
- Steward taps **Decline**.
- Optional short note.
- Visitor receives a polite, factual decline message.

### 1.9 Monitor Active Visitors
- Shows:
  - Who is currently on the property
  - Check‑in time
  - Expected check‑out time
- Steward can mark a visitor as “Checked out” if needed.

---

## 2. Visitor Flow

### 2.1 Browse Registry
- Visitor sees a list of available properties.
- Each card shows:
  - Name
  - Location
  - Key rules
  - Safety notes (livestock, machinery, weather considerations)
- Tone: calm, practical, no hype.

### 2.2 View Property Detail
- Map
- Description
- Rules (must acknowledge)
- Safety notes (must acknowledge)
- Availability calendar
- “Request Access” button

### 2.3 Request Access
- Visitor enters:
  - Dates
  - Group size
  - Purpose
  - Contact details
- Must tick:
  - “I have read and understood the rules”
  - “I understand the safety notes”
- Submit → request goes to steward.

### 2.4 Await Approval
- Visitor sees:
  - Status: Pending
  - Expected response time
- No notifications beyond simple status updates.

### 2.5 Approval Flow
- If approved:
  - Visitor receives confirmation
  - Instructions for arrival
  - Safety reminders
  - Check‑in button becomes available

### 2.6 Decline Flow
- Visitor receives a factual, polite decline.
- Encouraged to browse other properties.

### 2.7 Check‑In
- Visitor taps **Check In** on the day.
- System logs:
  - Time
  - Location (optional)
- Steward sees visitor as “Active”.

### 2.8 Check‑Out
- Visitor taps **Check Out**.
- System logs time and closes the visit.

---

## 3. Design Language Notes

### 3.1 Tone
- Quiet, careful, grounded.
- No poetic or romantic language.
- Clear, factual, respectful.

### 3.2 Safety
- Safety notes are always visible.
- Examples:
  - Bulls and livestock movement
  - Snakes and uneven terrain
  - Machinery and work zones
  - Weather and fire conditions

### 3.3 Interaction Style
- Small, steady confirmations.
- No animations or hype.
- Minimal colour; focus on clarity.

---

## 4. Future Extensions (Phase 2 — not for MVP)
- Citizen‑science hooks
- Steward‑visitor messaging
- Weather and fire‑risk integration
- Multi‑property routing
- Visitor history and badges

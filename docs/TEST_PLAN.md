⭐ Tend — MVP Test Plan
Quiet, careful, safety‑aware design language

1. Purpose
This test plan ensures the Tend MVP behaves consistently, safely, and predictably across all core flows:

Visitor access request lifecycle

Steward property management

Authentication and role‑based access

Map rendering

Check‑in / check‑out

Database integrity

UI tone and behaviour

The goal is to validate the system end‑to‑end before Beta‑phase features (payments, geofencing, notifications) are introduced.

2. Test Environment
Lovable Cloud (Postgres/Auth/Storage)

TanStack Start frontend

Leaflet/OpenStreetMap

Two test accounts:

Steward (landholder)

Visitor

Database should start empty.

3. Test Scenarios
A. Authentication & Roles
A1 — Steward Sign‑Up
Steps

Sign up with email + password

Choose “Steward” role

Complete profile

Expected

Steward row created in profiles

Role written to user_roles

Redirect to /dashboard

Dashboard loads with empty state

Tone is calm and factual

A2 — Visitor Sign‑Up
Steps

Sign up with email + password

Choose “Visitor” role

Expected

Visitor row created

Redirect to /properties

Empty registry message appears

No steward‑only routes visible

A3 — Role‑Gated Routes
Steps

Visitor attempts to access /dashboard

Steward attempts to access /my-requests

Expected

Visitor blocked with quiet, factual message

Steward allowed

No redirects that leak role information

B. Steward Property Management
B1 — Create Property
Steps

Steward opens /dashboard/properties/new

Enters name, description, location pin, safety notes, rules

Submits

Expected

Rows created in:

properties

access_rules

pricing

Property appears in dashboard

Map pin renders correctly

Safety notes always visible

B2 — Toggle Availability
Steps

Steward toggles property to “Unavailable”

Refresh page

Toggle back to “Available”

Expected

is_available updates in DB

Visitor registry updates accordingly

No animation or hype

B3 — Edit Property
Steps

Steward edits description or safety notes

Save changes

Expected

PATCH request updates DB

UI reflects changes immediately

No duplicate rows created

C. Visitor Discovery & Request Flow
C1 — Browse Registry
Steps

Visitor opens /properties

Map + list render

Expected

Leaflet loads without SSR errors

Properties appear with:

Name

Location

Key rules

Safety notes

C2 — View Property Detail
Steps

Click a property card

View detail page

Expected

Map renders

Rules and safety notes require acknowledgement

“Request Access” visible

C3 — Submit Access Request
Steps

Enter dates, group size, purpose

Tick both acknowledgements

Submit

Expected

Row created in access_requests

Status = pending

Visitor sees “Pending”

Steward sees request in dashboard

D. Steward Request Management
D1 — Approve Request
Steps

Steward opens dashboard

Approves request

Expected

Status → approved

Visitor sees updated status

Instructions displayed

Audit log entry created

D2 — Decline Request
Steps

Steward declines

Optional note

Expected

Status → declined

Visitor sees polite, factual decline

No notifications beyond status change

E. Visit Lifecycle
E1 — Check‑In
Steps

Visitor opens /my-requests

Approved request shows “Check In”

Tap “Check In”

Expected

Row created in visits

check_in_time set

Steward sees visitor as “Active”

E2 — Check‑Out
Steps

Visitor taps “Check Out”

Expected

check_out_time set

Visit closed

Steward dashboard updates

F. Map & Geospatial Behaviour
F1 — Leaflet SSR
Expected

No server‑side rendering errors

Map loads only on client

CSS loads correctly

F2 — Property Pin Accuracy
Expected

Pin matches lat/lng

Zoom level appropriate

No jitter or animation

G. Database Integrity Tests
G1 — No Orphan Rows
Deleting a property should not leave orphaned rules or pricing

Access requests tied to deleted properties should be soft‑blocked

G2 — RLS (Row Level Security)
Visitor cannot read other visitors’ requests

Steward can only see their own properties and requests

G3 — Audit Logs
Every approval, decline, check‑in/out creates an entry

H. Tone & Safety Tests
H1 — Tone Consistency
No hype

No marketing language

No emojis

No poetic phrasing

H2 — Safety Visibility
Safety notes always visible on property detail

Acknowledgement required before request submission

I. Error Handling
I1 — Missing Fields
Quiet, factual error messages

No stack traces

I2 — Unauthorized Access
Clear, calm message

No role leakage

I3 — Network Errors
Retry or simple fallback

No dramatic language

⭐ 4. Exit Criteria
The MVP is considered stable when:

All tests above pass

No SSR errors

No RLS violations

Steward and visitor flows complete end‑to‑end

Tone is consistent across all screens

Database integrity is maintained

⭐ 5. Optional: Beta‑Phase Pre‑Checks
(Not required for MVP, but useful to prepare)

Payments folder scaffold exists

Webhook endpoint placeholder exists

No‑go zones placeholder exists

Notifications folder scaffold exists
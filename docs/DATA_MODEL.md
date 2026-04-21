1. Overview

This document defines the core data structures for the Tend platform. It reflects the MVP requirements from the specifications and supports future extensibility.

2. Entity List

Users

Properties

AccessRules

AccessRequests

Visits

Pricing

Tasks (future)

Points (future)

AuditLogs

3. Entity Definitions

3.1 Users

id (UUID)
role (visitor | landowner | admin)
name
email
phone
created_at

3.2 Properties

id (UUID)
landowner_id (FK → Users)
name
description
location (lat/lng)
boundary_geojson
allowed_activities
availability
conditions
created_at

3.3 AccessRules

id (UUID)
property_id (FK)
group_size_limit
time_restrictions
warnings
no_go_zones_geojson

3.4 AccessRequests

id (UUID)
user_id (FK)
property_id (FK)
status (pending | approved | declined | cancelled)
requested_datetime
group_size
price_paid
conditions_acknowledged (boolean)
created_at

3.5 Visits

id (UUID)
access_request_id (FK)
check_in_time
check_out_time
gps_points (optional)
offline_proof_hash

3.6 Pricing

id (UUID)
property_id (FK)
pricing_type (per_visit | day_pass | subscription)
amount
currency

3.7 Tasks (Future)

id (UUID)
property_id (FK)
description
instructions
points_awarded
status

3.8 Points (Future)

id (UUID)
user_id (FK)
points
expiry_date

3.9 AuditLogs

id (UUID)
event_type
user_id (FK)
property_id (FK)
timestamp
metadata (JSON)
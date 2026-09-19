# 17 — Appointment Booking Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Native Booking Engine, Availability Schedules, Time-Slot Generation & External Calendar Synchronization  

---

## 1. Native Appointment Engine Overview

Alpha incorporates a native lightweight appointment booking system embedded directly into digital cards. Visitors can view real-time available time slots and book meetings with card owners without external third-party tools (like Calendly).

---

## 2. Appointment Booking Schema

```sql
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL, -- e.g., "30-Min Consultation"
    duration_minutes INT NOT NULL DEFAULT 30,
    location_type VARCHAR(32) NOT NULL DEFAULT 'GOOGLE_MEET', -- GOOGLE_MEET, PHONE, IN_PERSON
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE availability_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0 (Sun) to 6 (Sat)
    start_time TIME NOT NULL, -- e.g., '09:00:00'
    end_time TIME NOT NULL,   -- e.g., '17:00:00'
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata'
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    appointment_type_id UUID NOT NULL REFERENCES appointment_types(id),
    attendee_name VARCHAR(200) NOT NULL,
    attendee_email VARCHAR(255) NOT NULL,
    attendee_phone VARCHAR(32),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', -- PENDING, CONFIRMED, CANCELLED, COMPLETED
    meeting_link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Real-Time Time-Slot Generation Algorithm

1. Frontend requests available slots for a given date: `GET /api/v1/public/cards/:id/slots?date=2026-09-20`.
2. Backend loads card owner's `availability_schedules` for the target day of week.
3. Generates prospective slots of length `duration_minutes`.
4. Queries existing `appointments` table for overlapping booked slots.
5. Checks synced external calendar events (Google Calendar / Outlook API) if OAuth calendar sync is enabled.
6. Returns filtered list of unbooked, valid open time slots.

---

## 4. Calendar Integration Hooks

Alpha provides calendar provider abstraction interfaces (`ICalendarProvider`) ready for Google Calendar API and Microsoft Outlook API integration. Booking an appointment triggers async generation of an `.ics` calendar file attached to confirmation emails sent to both attendee and card owner.

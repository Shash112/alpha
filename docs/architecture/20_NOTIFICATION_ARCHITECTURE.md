# 20 — Notification Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Multi-Channel Notification Engine, Transactional Emails, Provider Abstractions & Delivery Queues  

---

## 1. Multi-Channel Notification Engine

Alpha incorporates a unified notification delivery subsystem supporting Transactional Email, In-App Alerts, SMS, and WhatsApp notifications.

```text
[Domain Event (e.g. LeadCaptured, AppointmentBooked)]
                         │
                         ▼
             [Notification Dispatcher]
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   [Email Channel]  [SMS Channel]  [WhatsApp Channel]
         │               │               │
  (BullMQ Queue)  (BullMQ Queue)  (BullMQ Queue)
         │               │               │
         ▼               ▼               ▼
   IEmailProvider   ISmsProvider   IWhatsAppProvider
   (SES/SendGrid)     (Twilio)        (Meta API)
```

---

## 2. Provider Abstraction Interfaces

```typescript
export interface IEmailProvider {
  sendEmail(options: SendEmailOptions): Promise<DeliveryResultDto>;
}

export interface SendEmailOptions {
  to: string;
  templateId: string;
  templateData: Record<string, any>;
  workspaceId?: string;
  replyTo?: string;
}
```

---

## 3. Standard Transactional Email Catalogue

| Template Code | Trigger Event | Target Recipient | Priority |
|---|---|---|---|
| `auth.verify_email` | User Signup | New User | High |
| `auth.password_reset` | Password Reset Request | User | High |
| `leads.new_lead_captured` | Public Card Lead Form Submitted | Card Owner / Sales Rep | Normal |
| `appointments.confirmation` | Appointment Booked | Attendee & Host | High |
| `billing.invoice_receipt` | Razorpay Renewal Charged | Workspace Owner | Normal |
| `billing.payment_failed` | Payment Renewal Failed | Workspace Owner | High |
| `members.invitation` | Workspace Member Invited | Invite Candidate | Normal |

---

## 4. Queueing & Idempotency Rules

1. All outbound notifications MUST be processed via background queues (`email-queue`, `sms-queue`).
2. Email sending jobs must include an idempotency key (`notification:{event_id}:{recipient_email}`) to prevent double-sending on worker retries.

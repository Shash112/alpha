# 23 — Privacy & Data Retention Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** DPDP (India) & GDPR Compliance, Right to Be Forgotten, Data Export & Retention Schedules  

---

## 1. Regulatory Compliance Framework

Alpha is designed for **India-First Data Protection (Digital Personal Data Protection Act - DPDP 2023)** and global privacy extensibility (**GDPR**).

### Core Privacy Guarantees
1. **Consent & Purpose Limitation:** User personal data is collected exclusively for account identity, workspace management, and explicit card networking.
2. **Granular Public Field Visibility:** Every field on a card (phone, email, social links, location) can be set to `PUBLIC`, `PRIVATE`, or `HIDDEN` independently by the user.
3. **Data Localization:** Customer data for India-based workspaces is hosted in AWS ap-south-1 (Mumbai) region.

---

## 2. Right to be Forgotten (Account Deletion Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant API Server
    participant Postgres DB
    participant Purge Worker

    User->>API Server: DELETE /api/v1/auth/account (Confirm Password)
    API Server->>Postgres DB: Mark User & Personal Workspaces 'DELETION_PENDING' (deleted_at = NOW())
    API Server->>User: Account Disabled; 30-Day Recovery Window Triggered
    
    Note over Purge Worker: 30 Days Elapse without Cancellation
    
    Purge Worker->>Postgres DB: Query 'DELETION_PENDING' records older than 30 days
    Purge Worker->>Postgres DB: Anonymize Audit Logs (actor_user_id -> NULL)
    Purge Worker->>Postgres DB: HARD DELETE User, AuthIdentities, Cards & Media
    Purge Worker->>Purge Worker: Log Deletion Completion Event
```

---

## 3. Data Export ("Right to Data Portability")

Users can request an archive of all personal data (`POST /api/v1/user/export-data`). The background worker compiles a downloadable `.zip` archive containing:
- `profile.json`: User account details and preferences.
- `cards.json`: Complete card revisions and configuration data.
- `leads.csv`: All captured lead records.
- `contacts.vcf`: vCard collection of saved contacts.
- `media/`: Full-resolution media upload assets.

---

## 4. Retention Schedule Matrix

| Data Classification | Retention Window | Purge / Anonymization Action |
|---|---|---|
| **Active User Data** | Life of Account | Maintained in Primary DB |
| **Soft-Deleted User / Card** | 30 Days | Soft-deleted (`deleted_at`); hard purged after 30 days |
| **Raw Analytics Events** | 30 to 730 Days (By Plan) | Partition dropped by scheduled cleanup cron |
| **Daily Analytics Aggregates** | Indefinite / 7 Years | Retained in aggregated statistical form |
| **Audit Logs** | 365 Days | Retained for compliance, then archived to Cold S3 |

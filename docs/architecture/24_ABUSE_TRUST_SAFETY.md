# 24 — Abuse, Trust & Safety Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Abuse Prevention, Anti-Spam Lead Controls, Malicious URL Filtering & Card Suspension Workflows  

---

## 1. Platform Trust & Safety Overview

To prevent Alpha from being misused for phishing, malware distribution, illegal content hosting, or spamming, the platform implements automated safety heuristics and platform admin trust tools.

---

## 2. Anti-Phishing & Malicious URL Protection

1. **Reserved Alias Enforcement:** Vanity aliases matching high-value target names (`bankofbaroda`, `hdfcbank`, `google-support`, `razorpay-admin`) are reserved and blocked from registration by regular accounts.
2. **Domain Reputation Checking:** External custom links submitted on cards are scanned against Google Safe Browsing / Web Risk APIs before publication. Cards containing known phishing or malware URLs are flagged automatically.
3. **Lead Form Bot Protection:** Public lead forms incorporate invisible honeypot fields and Google reCAPTCHA v3 / Cloudflare Turnstile bot protection to prevent automated lead spamming.

---

## 3. Card Suspension Workflow

When suspicious activity, spam, or Terms of Service violations are detected, platform super-admins can suspend a card or entire workspace (`SUSPENDED` state).

```text
[Suspicion Flagged (Abuse Report / Safe Browsing Alert / High Error Rate)]
                               │
                               ▼
        [Platform Admin Console (/admin/abuse-control)]
                               │
                               ▼
            [Execute Action: 'SUSPEND_CARD']
                               │
                               ├── Update cards.status = 'SUSPENDED'
                               ├── Invalidate Redis Card Cache Immediately
                               └── Public URL displays: "This card has been suspended."
```

### Public Response for Suspended Cards
Requests to a suspended card URL (`/c/:id` or `/alias`) return HTTP 451 (Unavailable For Legal Reasons) with a standardized message: *"This profile has been temporarily suspended due to potential safety or policy violations."* Private card data is not leaked.

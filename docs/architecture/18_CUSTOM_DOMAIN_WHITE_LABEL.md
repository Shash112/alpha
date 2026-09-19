# 18 — Custom Domain & White-Label Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Custom Domain CNAME Routing, Automatic SSL Provisioning, White-Label UI Customization & Custom Sender Domains  

---

## 1. Custom Domain Routing Architecture

Enterprise and Business workspace clients can bind custom domain hostnames (e.g. `card.acme.com` or `id.company.com`) to serve public cards without platform branding.

```text
[End User Browser]
       │
       ▼
[DNS Lookup: card.acme.com -> CNAME domains.alpha.com]
       │
       ▼
[Cloudflare Custom Hostnames (SSL Termination / TLS Certificate Auto-Provision)]
       │
       ▼
[Next.js Edge Proxy Middleware]
       │
       ├── Inspect Host Header: 'card.acme.com'
       ├── Query DB/Redis for CustomDomain mapping -> Workspace 102
       └── Route Request to /public/cards with Workspace Host Context
```

---

## 2. Domain Verification & SSL Provisioning Workflow

```sql
CREATE TABLE custom_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    hostname VARCHAR(255) NOT NULL UNIQUE, -- e.g. 'card.acme.com'
    verification_token VARCHAR(128) NOT NULL, -- TXT Record verification string
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_VERIFICATION', -- PENDING_VERIFICATION, VERIFIED, SSL_PROVISIONING, ACTIVE, FAILED
    ssl_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Setup Steps
1. Client submits domain `card.acme.com` in workspace settings.
2. System generates `verification_token` and instructs client to create DNS records:
   - `CNAME card.acme.com -> domains.alpha.com`
   - `TXT _alpha-challenge.card.acme.com -> verification_token`
3. **Verification Worker:** Background cron checks DNS TXT record via DNS lookup.
4. **SSL Provisioning:** Once DNS is verified, backend triggers Cloudflare Custom Hostname API to issue Let's Encrypt / Cloudflare SSL certificate automatically.
5. Domain status updates to `ACTIVE`.

---

## 3. White-Label Customization Controls

Entitled workspaces (`white_label.enabled = true`) unlock full white-label capabilities:

1. **Brand Neutrality:** Toggle off all "Powered by Alpha" footers, badge watermarks, and platform back-links.
2. **Custom Favicon & Logo:** Upload corporate header logo and browser favicon.
3. **Custom CSS Design Tokens:** Inject workspace-approved color palettes, font stacks, and button border-radius tokens.
4. **Custom Transactional Email Domain:** Configure custom SMTP / SendGrid sender addresses (`no-reply@company.com` instead of `@alpha.com`).

# 11 — Card Rendering & Template Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Schema-Driven Rendering Engine, Revision Control, Template System & Public Profile Security Projection  

---

## 1. Schema-Driven Rendering Pipeline

Card rendering in Alpha is entirely **configuration and schema driven**. Cards do not execute custom raw HTML/JavaScript uploaded by end-users. All visual sections, typography, color tokens, and layout schemas are validated against strict JSON schemas before being rendered by component projections.

```text
[Card Database State]
       │
       ▼
[Active Published Revision] ──► (Contains Section Payload & Visibility Preferences)
       │
       ▼
[Template Schema Version] ──► (Defines Section Order, Layout Constraints & Theme Tokens)
       │
       ▼
[Server-Side Policy Filter] ──► (Filters out 'PRIVATE' / 'HIDDEN' fields & unpublished drafts)
       │
       ▼
[Sanitized Public Projection DTO]
       │
       ▼
[Next.js Public Profile Renderer] ──► (Renders Mobile-First Accessible HTML)
```

---

## 2. Public Visibility Policy Filter

Every field in a card revision content payload carries a visibility status:

```json
{
  "section": "contact_info",
  "fields": {
    "personal_phone": { "value": "+919876543210", "visibility": "PRIVATE" },
    "work_phone": { "value": "+918012345678", "visibility": "PUBLIC" },
    "personal_email": { "value": "shashank@gmail.com", "visibility": "HIDDEN" }
  }
}
```

### Security Policy Rules
1. **Server-Side Filtering:** The public profile API (`GET /api/v1/public/cards/:id`) strips all `PRIVATE` and `HIDDEN` fields before sending the response payload across the network.
2. **Zero Data Leakage:** Private fields are never included in the public JSON payload. Hiding a field in CSS/UI is prohibited.

---

## 3. Template System & Hierarchy

Alpha supports a 4-tier template hierarchy:

1. **Platform System Templates:** Built-in standard professional designs available globally (Corporate, Minimalist, Creative, Executive, Sales Pro).
2. **Workspace Templates:** Custom branded templates created by workspace admins with locked corporate colors, font packages, and mandatory company logos.
3. **Team Templates:** Templates customized for specific departments (e.g. Sales Team vs Executive Board).
4. **Private Custom Templates:** Enterprise-tier custom layout configurations.

### Template Schema Definition (`layout_schema`)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "templateId": "tmpl_corporate_v1",
  "version": "1.0.0",
  "sections": [
    { "id": "hero", "required": true, "maxInstances": 1 },
    { "id": "about", "required": false, "maxInstances": 1 },
    { "id": "contact_actions", "required": true, "maxInstances": 1 },
    { "id": "services", "required": false, "maxInstances": 10 },
    { "id": "lead_form", "required": false, "maxInstances": 1 }
  ],
  "theme": {
    "allowedColorPresets": ["#0F172A", "#2563EB", "#059669"],
    "fontFamilies": ["Inter", "Outfit", "Roboto"]
  }
}
```

---

## 4. XSS Prevention & Media Sanitization

1. **Input Validation:** User text input fields (Bio, Descriptions) are sanitized using `sanitize-html` to strip script tags, inline event handlers (`onload`, `onerror`), and unsafe protocols.
2. **URL Sanitization:** All external links (Websites, Social profiles) must use valid `http://` or `https://` schemes. Protocols like `javascript:`, `data:`, or `vbscript:` are rejected during schema validation.
3. **Content Security Policy (CSP):** Public card rendering pages enforce strict CSP headers prohibiting inline script execution from unapproved CDNs.

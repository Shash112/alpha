# PROMPT 7 — DNS, Edge Routing & TLS Certificate Validation Report

**Project:** Alpha — Digital Professional Identity & Visiting Card SaaS  
**Document Type:** Edge DNS, Cloudflare Proxy & SSL/TLS Audit  
**Date:** September 15, 2026  
**Auditor:** Network & Edge Security Engineer  
**Status Label:** **`LOCALLY VERIFIED / UNVERIFIED — CLOUDFLARE DNS CREDENTIAL REQUIRED`**  

---

## 1. Domain Architecture & Public URL Resolution

Alpha uses a three-tier public URL resolution hierarchy as specified in `AGENTS.md` Section 14:

1. **Canonical Public ID:** `alpha.com/c/{public_id}` (Immutable 12-char identifier).
2. **Vanity Slug Alias:** `alpha.com/{vanity_path}` (Mutable human-readable alias).
3. **White-Label Custom Domain:** `{custom-domain.com}/{path}` (CNAME mapped tenant domain).

Uniqueness boundary: `(hostname, normalized_path)`.

---

## 2. Domain & TLS Verification Breakdown

| Domain Layer | Routing Engine | Local Engine Status | Live DNS / TLS Status |
|---|---|---|---|
| **Canonical Public ID (`/c/:id`)** | Next.js SSR Routing | **`LOCALLY VERIFIED`** | **`STAGING VERIFIED`** |
| **Vanity Aliases (`/:alias`)** | Atomic Alias Resolution | **`LOCALLY VERIFIED`** | **`STAGING VERIFIED`** |
| **Custom Domain CNAME Challenge** | DNS Challenge Verification API | **`LOCALLY VERIFIED`** | **`UNVERIFIED — CLOUDFLARE DNS REQUIRED`** |
| **Edge TLS / SSL Termination** | Cloudflare Flexible/Full SSL | **`CONFIGURED`** | **`UNVERIFIED — CLOUDFLARE DNS REQUIRED`** |

---

## 3. Mandatory Missing Dependency Specification

To transition Custom Domain DNS status from `LOCALLY VERIFIED` to `EXTERNALLY VERIFIED`:
1. **Required Provider:** Cloudflare / Public DNS Provider.
2. **Required Credential:** Cloudflare API Token (`CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_KEY`) and a live registered staging domain name.
3. **Justification:** Exercises real external CNAME validation and automated SSL certificate issuance for tenant custom domains.

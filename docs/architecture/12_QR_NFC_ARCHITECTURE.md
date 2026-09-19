# 12 — QR Code & NFC Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Dynamic QR Code Generation, Vector SVG/PNG Export, NFC Device Mapping, Tap Metrics & Physical Commerce Hardware Decoupling  

---

## 1. QR Code Subsystem

### 1.1 Architecture & Vector Export
Every published card automatically provisions a dynamic QR Code resource.

- **Payload Target:** Stable Canonical URL (`https://alpha.com/c/{public_id}`). Pointing directly to vanity URLs is discouraged so that future vanity alias renames do not break printed physical QR codes.
- **Export Formats:** High-resolution PNG (300 DPI print-ready), Scalable Vector Graphics (SVG), and PDF print format.
- **Styling Customization:** Custom foreground/background color hex codes, rounded corner modules, custom eye frames, and center logo embedding.
- **Error Correction Level:** **Level H (High ~30% recovery)** is mandated when a custom company logo is embedded in the QR center, ensuring high scan reliability across camera hardware.

```text
[Card Published]
       │
       ▼
[Generate Dynamic QR Code]
       │
       ├── Set Target: https://alpha.com/c/7Kx9mP4QaZ8Vt2N6
       ├── Error Correction: Level H
       ├── Composite Center Logo (Optional)
       └── Export PNG / SVG -> S3 Object Storage Bucket
```

---

## 2. NFC (Near Field Communication) Subsystem

### 2.1 Hardware-Decoupled Software Model
Alpha manages physical NFC cards, smart keyfobs, and digital tags as software-mapped identity objects without requiring full in-house hardware manufacturing infrastructure.

```sql
CREATE TABLE nfc_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_uid VARCHAR(128) NOT NULL UNIQUE, -- Factory NFC Hardware Chip UID (NTAG213/215/216)
    activation_code VARCHAR(32) NOT NULL UNIQUE, -- 8-character claim token
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    assigned_card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'UNACTIVATED', -- UNACTIVATED, ACTIVE, DISABLED, REBOUND
    tap_count INT NOT NULL DEFAULT 0,
    last_tapped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 NFC Activation & Tap Routing Flow
1. **Unactivated Physical Tag:** Shipped with pre-encoded NDEF URL: `https://alpha.com/nfc/activate?code=ACTIVATION_CODE`.
2. **Customer Tap & Claim:** Customer scans card with smartphone -> prompted to log into Alpha dashboard -> enters claim code.
3. **Binding:** Backend binds `device_uid` to customer's target `assigned_card_id` and updates status to `ACTIVE`.
4. **NDEF URL Redirection:** Once activated, tap requests to `https://alpha.com/nfc/:deviceUid` increment `tap_count` asynchronously and execute HTTP `302 Found` redirect to target card canonical URL (`https://alpha.com/c/{public_id}`).
5. **Re-binding Support:** Cards can be rebound to different team member cards instantly via dashboard without re-printing physical cards.

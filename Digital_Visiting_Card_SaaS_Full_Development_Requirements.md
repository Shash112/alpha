# Digital Visiting Card SaaS — Full Development Requirements

**Document:** Master Product & Development Requirements
**Version:** 2.0 (Global Repositioning & Robustness Mandate)
**Status:** Binding Development Baseline
**Product Type:** Multi-tenant SaaS
**Primary Market:** Global from day one

---

## 1. Product Definition

### 1.1 Product Vision

Build a production-grade, multi-tenant SaaS platform that starts as a digital visiting card product and expands into a professional digital identity, lead capture, networking, lightweight CRM, team identity management, NFC/QR management, business profiles, appointment booking, analytics, reseller, and white-label platform suitable for global commercial deployment.

### 1.2 Core Product Promise

> Create your professional identity once, share it everywhere, and turn introductions into contacts, conversations, and leads globally.

### 1.3 Product Positioning

The product must not be implemented as only a QR-card generator or regional utility. The platform is architected as a global, premium digital identity and business networking platform with the digital visiting card as its primary entry point.

### 1.4 Primary Customer Segments

1. Global individual professionals.
2. Freelancers and international consultants.
3. Real-estate professionals.
4. Insurance and financial advisors.
5. Global sales professionals.
6. Marketing & digital agencies.
7. Small & medium businesses worldwide.
8. Dealer/distributor networks.
9. Service businesses.
10. Multi-national companies with employee/sales teams.
11. Enterprise organizations needing SSO, compliance, and custom domains.
12. Global agencies, printing partners, NFC vendors, and white-label resellers.

---

# 2. Product Principles

1. Global-first architecture, UI, multi-currency billing, and i18n posture from day one.
2. Mobile-first public card experience with sub-100ms global CDN projection.
3. Production-ready reliability, strict security, and premium perceived quality; zero MVP shortcuts or placeholder pages.
4. Multi-tenant by design with multi-layer tenant isolation (API, DB context, memory, background jobs).
5. Workspace/organization-centric authorization and RBAC governance.
6. Plans, pricing, entitlements, and feature flags must be strictly configuration-driven without hardcoded values.
7. Individual, Team, Organization, Enterprise, and Reseller use one coherent modular monolith architecture.
8. Public profiles expose only explicitly published information server-side.
9. Transparent, trustworthy billing with multi-provider abstraction (Stripe + Razorpay + PayPal), multi-currency support (USD, EUR, GBP, INR, etc.), and idempotent webhooks.
10. Every important action must be observable, auditable, and traceable via correlation IDs.
11. APIs must be versioned (`/api/v1`) and documented with OpenAPI schemas.
12. All business-critical operations must be idempotent and fault-tolerant.
13. Payment provider logic must be abstracted behind a multi-gateway billing abstraction layer.
14. Feature access must be strictly enforced on the server, never solely in the UI.
15. Support custom domains with automated SSL, white-labeling, regional pricing add-ons, and enterprise SLAs.
16. Avoid premature microservices; use a clean modular monolith unless operational evidence justifies extraction.
17. Full compliance readiness (GDPR, CCPA, SOC2 security standards) with automated privacy controls.

---

# 3. Account / SaaS Model

## 3.1 Core Hierarchy

The platform must follow this conceptual flow:

```text
User
  ↓
Membership
  ↓
Workspace / Organization
  ↓
Plan
  ↓
Entitlements
  ↓
Resources
  ↓
Usage
```

## 3.2 User

A user is an authenticated human identity and may belong to multiple workspaces.

Requirements:

- Unique user ID.
- Email address.
- Email verification state.
- Optional phone number.
- Password authentication.
- Social/OAuth authentication.
- Profile photo.
- Name and display name.
- Locale.
- Time zone.
- Language preference.
- Notification preferences.
- Security settings.
- Account status.
- Last login.
- Created/updated timestamps.
- Soft-delete/deletion workflow.

## 3.3 Workspace

Every customer-facing environment must be represented internally as a workspace/tenant.

Workspace examples:

- Personal workspace.
- Team workspace.
- Business workspace.
- Organization workspace.
- Enterprise workspace.
- Agency/reseller workspace.

A user may own or belong to multiple workspaces.

## 3.4 Workspace Types

Supported commercial workspace types:

### Personal

For one professional or individual user.

### Team

For small teams.

### Business / Organization

For companies with centralized administration, departments, teams, and company branding.

### Enterprise

For larger organizations needing advanced security, governance, integrations, and contractual billing.

### Agency / Reseller

For partners managing other customer workspaces.

## 3.5 Account Type vs Plan

Account/workspace type and commercial plan must be separate concepts.

Example:

```text
Workspace type: Organization
Plan: Business Annual
```

The database and authorization system must not assume that a workspace type uniquely determines a plan.

---

# 4. Commercial Plan Structure

## 4.1 Initial Plan Families

### Free Personal

Target: individuals trying the product.

Potential entitlements:

- 1 active card.
- Basic templates.
- Public URL.
- Basic QR code.
- Basic contact actions.
- Platform branding.
- Limited analytics.

### Personal Pro

Target: professionals.

Potential entitlements:

- Multiple cards.
- Premium templates.
- Advanced customization.
- Remove platform branding.
- Advanced analytics.
- Lead capture.
- Custom CTA.
- Custom QR styling.
- NFC support.
- Contact export.
- Additional storage.

### Team

Target: small teams.

Potential entitlements:

- Team members/seats.
- Shared branding.
- Shared templates.
- Team analytics.
- Admin controls.
- Team lead management.
- Employee card management.

### Business / Organization

Target: SMBs and larger organizations.

Potential entitlements:

- Departments.
- Multiple teams.
- Organization profile.
- Company branding.
- Central card administration.
- Advanced RBAC.
- Audit logs.
- Advanced analytics.
- Custom domain.
- Bulk user management.

### Enterprise

Target: larger organizations.

Potential entitlements:

- Advanced security.
- SSO/SAML.
- SCIM.
- Advanced audit logs.
- Multiple domains.
- Advanced retention controls.
- Contract billing.
- Custom limits.
- Dedicated support/SLA.

### Agency / Reseller

Target: agencies and channel partners.

Potential entitlements:

- Customer management.
- Client workspace creation.
- Delegated administration.
- Reseller pricing.
- Commission tracking.
- White-label support.
- Bulk provisioning.
- Reseller analytics.

**Note:** Prices are commercial configuration and must not be embedded in application code.

---

# 5. Entitlement System

## 5.1 Requirement

Plans must be represented through configurable entitlements and usage limits.

Do not implement business logic such as:

```text
if plan == PRO
```

Instead implement:

```text
feature -> entitlement -> limit -> authorization
```

## 5.2 Feature Examples

- card.create
- card.multiple
- card.custom_url
- card.custom_branding
- analytics.basic
- analytics.advanced
- leads.enabled
- crm.enabled
- team.enabled
- organization.enabled
- custom_domain.enabled
- nfc.enabled
- event.enabled
- networking.enabled
- appointment.enabled
- white_label.enabled
- api.enabled
- sso.enabled
- audit_logs.enabled

## 5.3 Limits

Examples:

- Maximum cards.
- Maximum active members.
- Maximum teams.
- Maximum departments.
- Maximum monthly leads.
- Maximum monthly profile views.
- Maximum NFC devices.
- Maximum storage.
- Maximum custom domains.
- Maximum API requests.
- Maximum active events.

## 5.4 Entitlement Requirements

- Entitlements must be queryable by API.
- Entitlements must support boolean features and numeric limits.
- Entitlements must support plan-level defaults.
- Entitlements must support workspace overrides.
- Entitlements must support add-ons.
- Entitlements must support promotional overrides.
- Entitlements must support grandfathered plans.
- Entitlements must support feature deprecation.
- Entitlements must be enforced server-side.

---

# 6. Roles and Permissions

## 6.1 Role Model

Permissions must be separate from plans.

```text
User
  ↓
Workspace Membership
  ↓
Role
  ↓
Permissions
```

## 6.2 Standard Roles

### Personal

- Owner.

### Team

- Owner.
- Admin.
- Manager.
- Member.
- Viewer.

### Organization

- Owner.
- Organization Admin.
- Billing Admin.
- People/HR Admin.
- Department Admin.
- Team Manager.
- Member.
- Viewer.

### Agency

- Agency Owner.
- Agency Admin.
- Account Manager.
- Client Admin.

## 6.3 Permission Areas

Permissions should exist for at least:

- Workspace settings.
- Members.
- Teams.
- Departments.
- Cards.
- Templates.
- Branding.
- Company profile.
- Leads.
- Contacts.
- CRM.
- Analytics.
- QR.
- NFC.
- Events.
- Networking.
- Appointments.
- Domains.
- Billing.
- API keys.
- Integrations.
- Audit logs.
- Data export.
- Data deletion.
- Reseller clients.

## 6.4 Scope Rules

Permissions must be scope-aware where necessary.

Example:

```text
Organization Admin -> all organization resources
Department Admin -> department resources
Team Manager -> assigned team resources
Member -> own resources
Viewer -> read-only allowed resources
```

---

# 7. Multi-Tenancy

## 7.1 Requirement

The application must be multi-tenant from day one.

## 7.2 Tenant Isolation

Every tenant-scoped resource must include or be resolvable through a workspace/organization ownership boundary.

Examples:

- Cards.
- Leads.
- Contacts.
- Analytics events.
- Files.
- Templates.
- Domains.
- NFC devices.
- Appointments.

## 7.3 Authorization Flow

```text
Request
 ↓
Authentication
 ↓
Current Workspace
 ↓
Membership
 ↓
Role
 ↓
Permission
 ↓
Resource ownership/scope
 ↓
Action
```

## 7.4 Requirements

- Never trust tenant IDs supplied by an untrusted client.
- Derive active workspace from authenticated membership/context.
- Prevent cross-tenant resource access.
- Add automated tests for cross-tenant access attempts.
- Log sensitive authorization failures.
- Apply tenant scoping consistently across repository/service layers.
- Define data isolation rules before implementation of each module.

---

# 8. Authentication & Identity

## 8.1 Authentication

Support:

- Email/password.
- Email verification.
- Google OAuth.
- Password reset.
- Secure session management.
- Optional magic-link authentication.
- Optional passkeys in future-compatible design.

## 8.2 Security Requirements

- Passwords must use strong salted password hashing.
- Session/token rotation where appropriate.
- Refresh token revocation.
- Login rate limiting.
- Brute-force protection.
- Suspicious login detection hooks.
- Account lock/temporary throttling mechanisms.
- Secure cookie configuration where cookie sessions are used.

## 8.3 Optional Future Enterprise Auth

Architecture must allow:

- SAML SSO.
- OIDC.
- SCIM.
- Domain-based organization discovery.

---

# 9. User Profile

User profile fields:

- First name.
- Last name.
- Display name.
- Profile photo.
- Job title.
- Phone.
- Email.
- Time zone.
- Language.
- Social links.
- Notification preferences.

Users must be able to distinguish:

- Account information.
- Public card information.
- Organization employment information.

---

# 10. Digital Card System

## 10.1 Card Lifecycle

Supported states:

- Draft.
- Published.
- Unpublished.
- Suspended.
- Archived.
- Deleted.

## 10.2 Card Fields

Support at minimum:

- Name.
- Profile photo.
- Designation.
- Company.
- Bio.
- Phone.
- WhatsApp.
- Email.
- Website.
- Address.
- Map location.
- Business hours.
- Social profiles.
- Services.
- Products.
- Gallery.
- Testimonials.
- Custom links.
- CTA buttons.
- Booking link.
- Contact form.
- Download vCard.

## 10.3 Public Visibility

Each supported field must be independently configurable as:

- Public.
- Private.
- Hidden.

## 10.4 Card URLs

Support human-readable slugs.

Examples:

```text
/rahul-sharma
/shashank
/abc-enterprises
```

Requirements:

- Slug uniqueness.
- Reserved slug list.
- Slug validation.
- Redirect strategy when a slug changes.
- Prevent impersonation/reserved terms.

## 10.5 Multiple Cards

Users on eligible plans can create multiple cards such as:

- Personal.
- Business.
- Event.
- Role-specific.
- Campaign-specific.

Requirements:

- Card duplication.
- Archive card.
- Switch active card.
- Card-specific analytics.
- Card-specific URL.

---

# 11. Card Builder

## 11.1 Editor

Build a configuration-driven card editor.

Requirements:

- Section-based editing.
- Section reordering.
- Show/hide sections.
- Typography controls.
- Color controls.
- Button style controls.
- Background controls.
- Image upload/crop.
- Logo upload/crop.
- Preview mode.
- Mobile preview.
- Desktop preview.
- Save draft.
- Publish.
- Unsaved-change warning.
- Version-safe updates.

## 11.2 Sections

Support at minimum:

- Hero/profile.
- About.
- Contact.
- Social.
- Services.
- Products.
- Gallery.
- Testimonials.
- Location.
- Business hours.
- CTA.
- Lead form.
- Appointment booking.
- Company information.

## 11.3 Templates

Initial template library should contain multiple professional designs covering:

- Corporate.
- Modern minimal.
- Creative.
- Sales professional.
- Real estate.
- Consultant.
- Service business.
- Executive.

Templates must be data/configuration driven rather than separate hardcoded pages.

## 11.4 Template Administration

Admin must be able to:

- Create templates.
- Duplicate templates.
- Publish/unpublish templates.
- Set plan availability.
- Deprecate templates.
- Set preview image.
- Define default styles.

---

# 12. Public Card Experience

## 12.1 Requirements

- Mobile-first.
- Fast load.
- Responsive.
- Accessible.
- SEO metadata.
- Open Graph metadata.
- Social preview.
- Canonical URL support.
- Structured data where appropriate.
- No customer data leakage.
- Graceful error page for missing cards.
- Suspended-card response.

## 12.2 Actions

At minimum:

- Call.
- WhatsApp.
- Email.
- Save contact.
- Website.
- Social profile.
- Get directions.
- Share card.
- Submit enquiry.
- Book appointment.

## 12.3 Contact Save

Generate vCard-compatible downloadable contact data.

Include:

- Name.
- Organization.
- Title.
- Phone.
- Email.
- Website.
- Address.
- Optional profile URL.

---

# 13. QR Code System

## 13.1 Requirements

- QR generated per card.
- Dynamic destination support.
- PNG export.
- SVG export.
- Print-friendly export.
- QR styling where supported.
- Optional logo embedding.
- Error correction configuration suitable for logo use.
- Scan tracking for dynamic QR.

## 13.2 QR lifecycle

- Created.
- Active.
- Disabled.
- Regenerated.
- Archived.

## 13.3 Important

The QR should point to a stable redirect/destination layer when analytics or destination changes are supported.

---

# 14. NFC System

## 14.1 Goal

Support physical NFC products without making hardware infrastructure a dependency of the software platform.

## 14.2 NFC Object

Each NFC object should have:

- Device ID.
- Human-readable identifier.
- Destination URL.
- Assigned workspace.
- Assigned user/card.
- Status.
- Activation status.
- Last scan.
- Scan count.
- Created/updated timestamps.

## 14.3 Lifecycle

- Unassigned.
- Assigned.
- Active.
- Suspended.
- Lost.
- Reassigned.
- Retired.

## 14.4 Requirements

- Assign/reassign NFC device.
- Disable NFC device.
- View scan analytics.
- Support reusable NFC destination URLs.
- Protect against unauthorized reassignment.

---

# 15. Leads

## 15.1 Lead Capture

Visitors may submit a lead form.

Fields:

- Name.
- Phone.
- Email.
- Company.
- Message.
- Source/card.
- Consent where required.

## 15.2 Lead Record

Store:

- Lead ID.
- Workspace.
- Source card.
- Contact data.
- Message.
- Status.
- Tags.
- Notes.
- Assigned user.
- Created date.
- Updated date.
- Activity history.

## 15.3 Lead Status

Initial statuses:

- New.
- Contacted.
- Qualified.
- Converted.
- Lost.

Allow configurable future statuses.

## 15.4 Lead Actions

- View.
- Assign.
- Change status.
- Add note.
- Add tag.
- Call.
- WhatsApp.
- Email.
- Export.
- Delete/archive subject to retention rules.

## 15.5 Notifications

Configurable notifications:

- New lead email.
- New lead in dashboard.
- Optional WhatsApp notification in future.
- Assignment notification.

---

# 16. Contacts / CRM Lite

## 16.1 Contact Record

- Name.
- Phone.
- Email.
- Company.
- Title.
- Website.
- Tags.
- Notes.
- Source.
- Owner.
- Last interaction.
- Created/updated dates.

## 16.2 Contact Operations

- Create.
- Import.
- Edit.
- Merge.
- Search.
- Filter.
- Tag.
- Export.
- Archive.

## 16.3 Import

Plan for CSV import architecture.

Include validation, duplicate detection, error reporting, and import summary.

---

# 17. Analytics

## 17.1 Events

Track event types such as:

- Card view.
- Unique card visitor.
- QR scan.
- NFC scan.
- Call click.
- WhatsApp click.
- Email click.
- Website click.
- Social click.
- Contact save.
- Lead form view.
- Lead submission.
- Appointment click.
- Appointment booked.
- Share click.

## 17.2 Dashboard Metrics

At minimum:

- Views.
- Unique visitors.
- Contacts saved.
- Calls.
- WhatsApp clicks.
- Email clicks.
- Website clicks.
- Leads.
- QR scans.
- NFC scans.
- Conversion rate.

## 17.3 Filters

- Date range.
- Card.
- Workspace.
- User.
- Device.
- Country/region where appropriate and privacy compliant.
- Source.

## 17.4 Analytics Architecture

Analytics ingestion should be decoupled from transactional requests where possible.

Do not make a public card request depend on an expensive synchronous analytics pipeline.

Recommended pattern:

```text
Public Event
 ↓
Lightweight event capture
 ↓
Queue / async processing
 ↓
Event store / aggregate tables
 ↓
Analytics API
 ↓
Dashboard
```

---

# 18. Organization System

## 18.1 Organization Profile

Fields:

- Company name.
- Legal name if needed.
- Logo.
- Cover/brand image.
- Description.
- Website.
- Email.
- Phone.
- Address.
- Locations.
- Social links.
- Services.
- Products.
- Business hours.

## 18.2 Organization Members

Support:

- Invite.
- Resend invite.
- Accept invite.
- Suspend member.
- Remove member.
- Change role.
- Move team.
- Assign card.
- Reassign card.

## 18.3 Departments

Organizations must be able to create departments.

Examples:

- Sales.
- Marketing.
- HR.
- Operations.

## 18.4 Teams

Teams may belong to departments.

Members may belong to teams according to organization rules.

## 18.5 Employee Lifecycle

Support future-ready statuses:

- Invited.
- Active.
- Suspended.
- Offboarded.

Offboarding must support:

- Card suspension.
- Card transfer.
- Reassignment of leads.
- Retention of audit records.

---

# 19. Team Management

Requirements:

- Team creation.
- Team rename.
- Team archive.
- Team member assignment.
- Team manager.
- Team analytics.
- Team card templates.
- Team lead views.
- Team-specific access controls.

---

# 20. Events & Networking

## 20.1 Event

Fields:

- Event ID.
- Name.
- Description.
- Organizer.
- Location/virtual link.
- Start/end dates.
- Registration state.
- Participant capacity where applicable.
- Branding.

## 20.2 Connections

A connection record should support:

- User/contact.
- Card involved.
- Date/time.
- Event/context.
- Source.
- Notes.
- Follow-up status.

## 20.3 Connection Experience

Example:

```text
Scan card
 ↓
View profile
 ↓
Connect
 ↓
Save relationship
 ↓
Optional lead
 ↓
Add to contacts
```

## 20.4 Privacy

Both parties must understand what information becomes shared and under what action.

---

# 21. Appointment Booking

## 21.1 Requirements

Allow eligible users to publish booking functionality.

Support:

- Availability rules.
- Working hours.
- Time zone.
- Appointment types.
- Duration.
- Buffer time.
- Booking limits.
- Confirmation.
- Cancellation.
- Rescheduling.

## 21.2 Future Integrations

Architecture should allow:

- Google Calendar.
- Microsoft Outlook Calendar.
- External meeting links.

---

# 22. Custom Domains

## 22.1 Requirements

Allow eligible plans to connect domains/subdomains.

Examples:

```text
card.example.com/shashank
profile.example.com/rahul
```

## 22.2 Domain Lifecycle

- Added.
- Verification pending.
- Verified.
- Active.
- Suspended.
- Removed.

## 22.3 Verification

Support DNS verification using a challenge record.

## 22.4 Requirements

- Ownership verification.
- TLS certificate strategy.
- Routing.
- Tenant-to-domain mapping.
- Domain conflict prevention.
- Domain removal.
- Error handling.

---

# 23. White-Label System

## 23.1 Goal

Allow eligible resellers/enterprise customers to present the platform under their own brand.

## 23.2 Configurable Branding

- Logo.
- Favicon.
- Primary/secondary colors.
- Typography where supported.
- Email branding.
- Login branding.
- Public card branding.
- Footer branding.
- Custom domain.

## 23.3 Restrictions

White-label controls must be entitlement-driven.

---

# 24. Reseller / Agency Platform

## 24.1 Reseller Object

A reseller is an account/workspace with partner capabilities.

## 24.2 Customer Management

Resellers can, subject to permissions:

- Create clients.
- Invite client admins.
- Provision cards.
- Manage templates.
- Assign branding.
- View customer usage.
- View customer status.
- Manage partner billing/commissions.

## 24.3 Client Isolation

A reseller must not automatically have unrestricted access to all client data unless explicitly permitted by policy and contract.

Use delegated-access permissions and audit all privileged actions.

## 24.4 Commission System

Architecture should support:

- Commission percentage.
- Fixed commission.
- Eligible plans.
- Commission status.
- Accrued commission.
- Paid commission.
- Refund reversal.

---

# 25. Billing Architecture

## 25.1 Core Model

```text
Workspace
  ↓
Billing Customer
  ↓
Subscription
  ↓
Subscription Items
  ↓
Entitlements
  ↓
Usage
  ↓
Invoices / Payments
```

## 25.2 Billing Entities

Support:

- Billing customer.
- Subscription.
- Subscription item.
- Plan.
- Price.
- Add-on.
- Invoice.
- Payment.
- Refund.
- Coupon.
- Promotion.
- Tax data.
- Payment method.
- Usage record.

## 25.3 Billing Models

Architecture must support:

- Free.
- Flat subscription.
- Per-seat subscription.
- Base + seat pricing.
- Add-on pricing.
- Usage-based pricing in future.
- Enterprise contract/custom price.
- Annual billing.
- Monthly billing.

## 25.4 Payment Provider Abstraction

Create a provider abstraction layer.

Initial provider for India may be Razorpay, but application services must not directly depend on provider-specific APIs.

Example:

```text
Billing Service
   ↓
Payment Provider Interface
   ├── Razorpay
   ├── Future Provider A
   └── Future Provider B
```

## 25.5 Subscription States

Support:

- Trialing.
- Active.
- Past due.
- Paused.
- Cancelled.
- Expired.
.

## 25.6 Workspace States

Support:

- Trial.
- Active.
- Grace period.
- Past due/suspended.
- Cancelled.
- Deletion pending.
- Deleted.

## 25.7 Billing Events

Process provider webhooks for:

- Payment success.
- Payment failure.
- Subscription creation.
- Subscription update.
- Subscription cancellation.
- Refund.
- Chargeback where supported.

All webhook processing must be authenticated, idempotent, logged, and replay-safe.

## 25.8 Pricing Configuration

Do not hardcode prices in source code.

Store:

- Currency.
- Amount.
- Billing interval.
- Tax behavior.
- Plan mapping.
- Effective date.
- Regional availability.

## 25.9 Grandfathering

Support users staying on historical prices even after a price update.

---

# 26. Trials / Upgrades / Downgrades

## 26.1 Trials

Support configurable trials:

- Duration.
- Eligible plans.
- Eligibility rules.
- Expiration behavior.
- Payment-required or payment-not-required trials.

## 26.2 Upgrade

Requirements:

- Immediate entitlement increase or configured proration behavior.
- Clear UI.
- Payment confirmation.
- Audit entry.

## 26.3 Downgrade

Requirements:

- Warn about features/usage exceeding new limits.
- Define effective date.
- Decide whether downgrade is immediate or period-end.
- Preserve data safely.
- Avoid destructive deletion by default.

## 26.4 Cancellation

Requirements:

- Cancel now/end of period.
- Retention workflow.
- Confirmation.
- Grace period where applicable.
- Data retention policy.

---

# 27. Add-On System

Support purchasable add-ons independent of base plan.

Examples:

- Extra seats.
- Extra cards.
- Custom domain.
- White-label.
- Advanced analytics.
- NFC capacity.
- Storage.
- API capacity.

Add-ons must modify entitlements rather than directly modifying feature code.

---

# 28. Usage Metering

Architecture should support usage records for:

- Profile views.
- Leads.
- NFC scans.
- QR scans.
- Storage.
- API requests.
- Seats.
- Active cards.

Usage system requirements:

- Tenant scoped.
- Time-windowed.
- Aggregatable.
- Recalculable.
- Idempotent.
- Auditable.

---

# 29. Notifications

## 29.1 Channels

- In-app.
- Email.
- WhatsApp in future.
- SMS in future if required.

## 29.2 Notification Types

- Welcome.
- Verify email.
- Password reset.
- Invitation.
- New lead.
- Lead assignment.
- Payment success.
- Payment failure.
- Subscription renewal.
- Subscription cancellation.
- Card published.
- Security alert.

## 29.3 Notification Service

Use a centralized notification service with templates and provider abstraction.

Requirements:

- Template versioning.
- Localization-ready.
- Retry.
- Delivery status.
- Failure logging.
- Unsubscribe/preferences where legally appropriate.

---

# 30. File / Media Management

Support:

- Profile photos.
- Company logos.
- Gallery images.
- Template previews.
- QR exports.
.

Requirements:

- Object storage.
- Secure upload URLs where appropriate.
- MIME validation.
- File size limits.
- Image dimension validation.
- Virus/malware scanning strategy.
- Thumbnail generation.
- CDN delivery.
- File ownership tied to tenant.
- Deletion cleanup.

---

# 31. Search

Initial search can use PostgreSQL/full-text or indexed columns.

Search resources:

- Cards.
- Members.
- Leads.
- Contacts.
- Organizations.
- Events.
.

Architecture should allow a dedicated search engine later if scale requires it.

---

# 32. SEO

## 32.1 Public Cards

Each public card should support:

- Title.
- Description.
- OG image.
- Canonical URL.
- Robots controls.
- Structured data where appropriate.
.

## 32.2 Platform Marketing Site

Support:

- Landing pages.
- Pricing.
- Feature pages.
- Industry pages.
- Blog/resources.
- Sitemap.
- Robots.txt.
- Analytics.
.

---

# 33. Platform Administration

## 33.1 Admin Areas

Platform admin must have:

- Dashboard.
- Users.
- Workspaces.
- Organizations.
- Cards.
- Templates.
- Leads moderation/support tools.
- Plans.
- Prices.
- Entitlements.
- Subscriptions.
- Payments.
- Refunds.
- Coupons.
- Resellers.
- Domains.
- NFC.
- Analytics.
- System settings.
- Audit logs.
- Support tools.
.

## 33.2 Admin Actions

All privileged actions must be authenticated, authorized, and audited.

Examples:

- Suspend account.
- Restore account.
- Disable card.
- Reset subscription state where operationally justified.
- Grant temporary entitlement.
- Apply support credit.
- Change plan.
- Review abuse.
- Review domain ownership state.

---

# 34. Audit Logging

## 34.1 Events

Log important actions such as:

- Login/security events.
- Role changes.
- Member invite/removal.
- Card publish/unpublish.
- Card ownership transfer.
- Billing changes.
- Subscription changes.
- Entitlement overrides.
- Domain changes.
- API key creation/revocation.
- Data export.
- Data deletion.
- Administrative impersonation/delegated access.

## 34.2 Audit Record

Include:

- Event ID.
- Actor.
- Workspace.
- Target resource.
- Action.
- Timestamp.
- IP metadata where appropriate.
- User-agent metadata where appropriate.
- Outcome.
- Request/correlation ID.

Audit logs must be append-oriented and protected from normal tenant users editing them.

---

# 35. API Architecture

## 35.1 API Style

Use REST APIs initially unless a specific domain requires another approach.

API must be versioned.

Example:

```text
/api/v1/...
```

## 35.2 API Requirements

- Authentication.
- Authorization.
- Validation.
- Pagination.
- Filtering.
- Sorting.
- Consistent errors.
- Idempotency for supported write operations.
- Rate limiting.
- Request IDs.
- Audit metadata.
.

## 35.3 Core API Areas

- Auth.
- Users.
- Workspaces.
- Memberships.
- Roles/permissions.
- Cards.
- Templates.
- Media.
- Public profiles.
- QR.
- NFC.
- Leads.
- Contacts.
- CRM.
- Analytics.
- Teams.
- Departments.
- Organizations.
- Events.
- Connections.
- Appointments.
- Domains.
- Billing.
- Plans.
- Entitlements.
- Usage.
- Notifications.
- Resellers.
- Admin.
.

## 35.4 API Documentation

Maintain OpenAPI specification.

Each endpoint must define:

- Request.
- Response.
- Authentication.
- Permission requirements.
- Validation rules.
- Error codes.
- Examples.
.

---

# 36. Webhooks

The platform should support outbound webhooks for eligible plans.

Potential events:

- card.published
- card.updated
- lead.created
- lead.updated
- contact.created
- member.invited
- member.removed
- subscription.updated
- payment.succeeded
- payment.failed
- appointment.booked

Webhook requirements:

- Endpoint registration.
- Secret/signature.
- Retry.
- Replay protection.
- Delivery logs.
- Failure handling.
- Event versioning.

---

# 37. Integrations Architecture

Create integration interfaces rather than coupling modules directly.

Future integrations:

- Google Calendar.
- Microsoft Calendar.
- WhatsApp provider.
- Email provider.
- Payment providers.
- CRM systems.
- Zapier/Make-style automation.
- Webhooks.
.

---

# 38. Privacy & Data Protection

Requirements:

- Explicit public/private data model.
- Privacy policy links.
- Data export.
- Account deletion.
- Workspace deletion.
- Consent capture where needed.
- Data retention rules.
- Sensitive data minimization.
- Auditability.
- Secure backups.
- Access logging.
.

Do not expose phone/email or other fields on a public card unless the user has enabled public visibility for that field.

---

# 39. Abuse / Trust & Safety

Because the platform produces public URLs, implement:

- Abuse reporting.
- Card suspension.
- Spam prevention.
- Rate limiting.
- Bot protection on forms where appropriate.
- Disposable/spam lead mitigation hooks.
- Reserved usernames.
- Impersonation reporting.
- Domain abuse controls.
- Admin review tools.

---

# 40. Performance Requirements

## Public Card

Prioritize low latency because public cards are accessed immediately after a QR/NFC interaction.

Requirements:

- Server-side or static-compatible rendering strategy where beneficial.
- CDN caching where safe.
- Optimized images.
- Lazy loading below-the-fold assets.
- Minimal JS for public profile.
- Async analytics collection.
.

## Dashboard

- Paginated lists.
- Server-side filtering for large datasets.
- Avoid loading full organization data unnecessarily.
- Cache appropriate read-heavy settings.
.

---

# 41. Reliability

Requirements:

- Health checks.
- Error tracking.
- Structured logging.
- Metrics.
- Alerting.
- Database backups.
- Restore procedures.
- Retry mechanisms.
- Queue monitoring.
- Dead-letter strategy where queues are used.
.

---

# 42. Infrastructure

Suggested baseline architecture:

```text
Frontend / Web
    ↓
CDN / Edge
    ↓
Application / API
    ├── Auth
    ├── Card
    ├── Lead
    ├── CRM
    ├── SaaS/Billing
    └── Admin modules
    ↓
PostgreSQL
    ↓
Redis / Queue
    ↓
Object Storage
```

Recommended technology direction:

- Frontend: Next.js + TypeScript.
- Backend: TypeScript modular backend such as NestJS.
- Database: PostgreSQL.
- Cache/queues: Redis.
- Object storage: S3-compatible.
- CDN/WAF: Cloudflare or equivalent.
- Payments: provider abstraction with Razorpay initial support.
.

Technology may be changed during technical design only if the same requirements are preserved or improved.

---

# 43. Backend Module Boundaries

Backend modules should include at least:

1. Identity.
2. Users.
3. Workspaces.
4. Memberships.
5. Authorization.
6. Organizations.
7. Teams.
8. Departments.
9. Cards.
10. Templates.
11. Media.
12. Public Profiles.
13. QR.
14. NFC.
15. Leads.
16. Contacts.
17. CRM.
18. Analytics.
19. Events.
20. Networking.
21. Appointments.
22. Domains.
23. Billing.
24. Plans.
25. Entitlements.
26. Usage.
27. Notifications.
28. Integrations.
29. Resellers.
30. Audit.
31. Admin.
32. Abuse/Trust.

Modules must communicate through clear service interfaces and domain contracts.

---

# 44. Database Requirements

## 44.1 Core Tables / Aggregates

At minimum define models for:

- users
- user_profiles
- workspaces
- workspace_settings
- workspace_memberships
- roles
- permissions
- role_permissions
- organizations
- departments
- teams
- cards
- card_sections
- card_social_links
- card_services
- card_products
- card_gallery
- card_testimonials
- card_ctas
- card_templates
- media_assets
- slugs
- qr_codes
- nfc_devices
- leads
- lead_activities
- contacts
- contact_tags
- analytics_events
- analytics_aggregates
- events
- event_participants
- connections
- appointment_types
- availability_rules
- appointments
- domains
- domain_verifications
- plans
- prices
- plan_entitlements
- workspace_entitlements
- addons
- subscriptions
- subscription_items
- invoices
- payments
- refunds
- coupons
- usage_records
- notifications
- notification_templates
- webhook_endpoints
- webhook_deliveries
- api_keys
- audit_logs
- reseller_accounts
- reseller_clients
- commissions
.

## 44.2 Database Rules

- Use UUID/appropriate non-guessable public identifiers where useful.
- Add created_at/updated_at consistently.
- Use soft deletion only where required; do not blindly soft-delete everything.
- Enforce foreign-key relationships.
- Add unique constraints.
- Add indexes for common tenant queries.
- Add composite indexes around workspace ownership and status fields.
- Design analytics storage separately from transactional tables where appropriate.
- Avoid storing derived values when they can be reliably calculated, except where aggregation materially improves performance.

---

# 45. URL and Routing Architecture

Reserve namespaces for system pages and customer slugs.

Example:

```text
/app
/dashboard
/settings
/pricing
/help
/admin
/login
/signup
/api
```

Public customer routes:

```text
/{profile-slug}
```

Avoid collisions using reserved-slug validation.

Custom domains must route into the same public profile engine.

---

# 46. Internationalization

Architecture must be localization-ready.

Requirements:

- UI translation keys.
- Locale-aware dates.
- Locale-aware number formatting.
- Currency abstraction.
- Time zones.
- Localized email templates.

Initial language may be English, with future support for Indian languages.

---

# 47. India-First Requirements

The initial commercial experience should support:

- INR.
- Indian phone number formats.
- +91 display/validation.
- UPI-capable payment flow through supported gateway.
- GST/business tax fields where relevant.
- Indian address conventions.
- WhatsApp-first sharing.
- QR-first networking.
- India-focused pricing configuration.

Do not make the underlying architecture India-only.

---

# 48. Marketing Website

Required pages:

- Home.
- Features.
- Digital Cards.
- Teams.
- Business.
- NFC.
- Lead capture.
- Analytics.
- Pricing.
- Reseller/Partner.
- Enterprise.
- About.
- Contact.
- FAQ.
- Terms.
- Privacy.
.

Marketing website must have clear CTA:

**Create your digital card**

---

# 49. Onboarding

## Personal onboarding

1. Sign up.
2. Verify email.
3. Select personal/professional use.
4. Enter name/designation/company.
5. Upload photo.
6. Choose template.
7. Add contact methods.
8. Publish card.
9. Show QR and share actions.

## Organization onboarding

1. Create organization.
2. Set company details.
3. Choose branding.
4. Select plan.
5. Invite team.
6. Create departments/teams if needed.
7. Provision cards.
8. Publish cards.
9. Show organization analytics.

## Reseller onboarding

1. Create partner account.
2. Verify partner.
3. Select reseller plan.
4. Configure branding.
5. Create first client.
6. Provision card.

Onboarding should be progressive and avoid asking for unnecessary information before first value.

---

# 50. Dashboard Information Architecture

## Personal

- Overview.
- My Cards.
- Leads.
- Contacts.
- Analytics.
- Connections.
- Appointments.
- QR/NFC.
- Billing.
- Settings.

## Team/Organization

- Overview.
- Cards.
- Members.
- Teams.
- Departments.
- Leads.
- Contacts.
- Analytics.
- Events.
- Appointments.
- Branding.
- Domains.
- Billing.
- Integrations.
- Audit Logs.
- Settings.

## Reseller

- Overview.
- Clients.
- Cards.
- Provisioning.
- Usage.
- Branding.
- Commissions.
- Billing.
- Support.

---

# 51. UX Requirements

The product must be:

- Mobile responsive.
- Keyboard accessible.
- Screen-reader aware.
- Clear in empty states.
- Clear about plan limits.
- Clear about publishing status.
- Clear about visibility/public data.
- Clear about subscription impact.
- Consistent in navigation.
- Consistent in form validation.
.

Important actions must have confirmation where destructive.

---

# 52. Accessibility

Target WCAG 2.2 AA where practical for the application UI.

Requirements:

- Keyboard navigation.
- Visible focus state.
- Semantic headings.
- Labels for form fields.
- Accessible error messages.
- Sufficient contrast.
- Alt text for meaningful images.
- Reduced-motion consideration.
- Accessible modal/dialog behavior.
.

Public cards should also follow accessible interaction patterns.

---

# 53. Testing Strategy

## Unit tests

For:

- Domain logic.
- Entitlements.
- Billing calculations.
- Permissions.
- Slug validation.
- Lead status logic.
- Usage metering.
.

## Integration tests

For:

- Database repositories.
- Authentication.
- Workspace authorization.
- Billing provider webhooks.
- File storage.
- Queue processing.
.

## End-to-end tests

Critical flows:

1. Sign up.
2. Verify email.
3. Create personal card.
4. Publish card.
5. Visit public card.
6. Save contact.
7. Submit lead.
8. View analytics.
9. Upgrade plan.
10. Add team member.
11. Create organization.
12. Create employee card.
13. Create QR.
14. Assign NFC.
15. Custom domain verification.
16. Reseller creates client.
17. Cancellation/downgrade.

## Security tests

- Cross-tenant access.
- Privilege escalation.
- IDOR/resource enumeration.
- Authentication attacks.
- Rate limits.
- Malicious uploads.
- Webhook signature validation.
- CSRF where applicable.
- XSS.
- SQL injection protection.
.

---

# 54. Observability

Implement:

- Structured application logs.
- Error tracking.
- Request correlation IDs.
- API latency metrics.
- Database latency metrics.
- Queue metrics.
- Payment metrics.
- Public-card performance metrics.
- Background job failure alerts.
.

Critical alerts:

- API outage.
- Database unavailable.
- High error rate.
- Queue backlog.
- Payment webhook failures.
- Storage failures.
- Domain/TLS failures.
.

---

# 55. Background Jobs

Use asynchronous jobs for workloads such as:

- Email sending.
- Analytics processing.
- Image processing.
- QR generation if expensive.
- CSV import/export.
- Webhook delivery.
- Subscription reconciliation.
- Usage aggregation.
- Cleanup/retention.
.

Jobs must be retryable and idempotent where possible.

---

# 56. Caching

Cache selectively:

- Public card configuration.
- Published templates.
- Plan/entitlement configuration.
- Public domain routing.
- Read-heavy settings.
.

Do not cache private/tenant-specific data without explicit cache-key isolation.

Invalidate caches on updates affecting public state.

---

# 57. Backup & Disaster Recovery

Requirements:

- Automated database backups.
- Point-in-time recovery where supported.
- File storage durability strategy.
- Backup monitoring.
- Restore procedure.
- Disaster recovery runbook.
- Periodic restore testing.
.

Define target RPO/RTO during infrastructure planning.

---

# 58. Security Requirements

At minimum:

- TLS everywhere.
- Secrets stored securely.
- Environment separation.
- Least-privilege IAM.
- Secure headers.
- WAF/rate limiting.
- Input validation.
- Output encoding.
- Secure file handling.
- Audit logging.
- Secure password storage.
- Token/session security.
- Dependency vulnerability scanning.
- Regular backups.
.

Never commit credentials or secrets to source control.

---

# 59. Data Retention

Define configurable policies for:

- Deleted users.
- Deleted workspaces.
- Analytics events.
- Audit logs.
- Leads.
- Contacts.
- Billing records.
- Backups.
.

Retention must respect applicable legal/accounting requirements.

---

# 60. Business Metrics

Platform analytics must support:

### Acquisition

- Signups.
- Activation rate.
- Source.
- Conversion to card publication.
.

### Engagement

- Active users.
- Published cards.
- Card views.
- Leads.
- Contact saves.
.

### Revenue

- MRR.
- ARR.
- ARPU.
- New revenue.
- Expansion revenue.
- Churned revenue.
- Refunds.
- Payment failure rate.
.

### Retention

- Customer retention.
- Logo churn.
- Revenue churn.
- Trial-to-paid conversion.
- Cohort retention.
.

### Product

- Card-to-lead conversion.
- QR usage.
- NFC usage.
- Feature adoption.
.

---

# 61. Admin Business Metrics

Admin dashboard should include:

- Total users.
- Active users.
- Organizations.
- Published cards.
- Leads.
- MRR.
- ARR.
- Active subscriptions.
- Trial users.
- Churn.
- Failed payments.
- Resellers.
- Cards created per day/week/month.
- New leads per day/week/month.
.

---

# 62. Error Handling

Define consistent API error format.

Example:

```json
{
  "code": "CARD_SLUG_ALREADY_EXISTS",
  "message": "The selected card URL is already in use.",
  "requestId": "...",
  "details": {}
}
```

Client UI must translate machine errors into clear user-facing messages.

Do not leak stack traces or internal infrastructure details.

---

# 63. API Rate Limits

Different classes may have different policies:

- Authentication.
- Public card endpoints.
- Lead submission.
- Dashboard APIs.
- Admin APIs.
- Webhook endpoints.
- Public APIs.
.

Rate limits should be configurable and tenant/user aware.

---

# 64. Public Lead Form Protection

Because public forms are exposed to spam:

- Rate limiting.
- IP/device heuristics where appropriate.
- Honeypot support.
- Bot challenge option.
- Duplicate submission controls.
- Optional verification for suspicious traffic.
.

---

# 65. Slug and Branding Security

Maintain reserved strings for:

- admin.
- api.
- app.
- login.
- signup.
- support.
- pricing.
- billing.
- system names.
.

Prevent obvious impersonation patterns and unauthorized brand usage where appropriate.

---

# 66. Data Export

Users/admins with permissions must be able to export appropriate data.

Formats:

- CSV.
- JSON where appropriate.
- vCard for contact export.
.

Exports should be queued for large datasets and protected with authorization.

---

# 67. Account Deletion

Requirements:

- Clear confirmation.
- Password/re-authentication where appropriate.
- Explain impact.
- Handle active subscriptions.
- Handle organization ownership.
- Transfer/resolve resources before deletion.
- Apply retention/legal exceptions.
- Audit the request.
.

---

# 68. Support / Customer Service

Provide support-ready mechanisms:

- Contact support.
- Ticket/reference ID.
- Help center links.
- Admin notes.
- User/account status visibility for authorized platform admins.
.

Support access must be audited.

---

# 69. Feature Flags

Use feature flags for:

- Beta features.
- Gradual rollout.
- Internal-only features.
- Premium features under controlled rollout.
- Emergency disablement.
.

Feature flags must not replace entitlement logic; they work alongside it.

---

# 70. Configuration Management

Centralize configurable values such as:

- Plan settings.
- Pricing.
- Feature limits.
- Email settings.
- Analytics settings.
- Upload limits.
- Security thresholds.
- Rate limits.
- Retention periods.
.

Separate environment configuration from tenant configuration.

---

# 71. Localization of Pricing and Tax

Billing must support:

- Currency.
- Tax-inclusive/exclusive pricing where needed.
- Tax IDs.
- Country-specific invoice data.
- Regional plans.
.

India should be first supported region, but schema must not assume India-only taxation.

---

# 72. Email Domain / Sending Architecture

Use a provider abstraction.

Requirements:

- Transactional email templates.
- Sender identity.
- Domain verification strategy.
- Bounce handling.
- Complaint handling.
- Delivery logging.
- Retry.
.

For organization/white-label plans, support future customer-specific sender domains.

---

# 73. Mobile Application Strategy

Do not require a mobile app for launch architecture.

The web application must be responsive and fully usable on mobile.

Design APIs so a future native mobile app can use the same backend.

Potential future mobile features:

- Share card.
- QR scanner.
- Networking.
- Contacts.
- NFC management.
- Notifications.
.

---

# 74. PWA Readiness

The web application may be made PWA-capable later.

Do not make PWA functionality a hard dependency for V1 architecture.

---

# 75. Automation / AI Future Layer

Do not make AI part of the core card functionality.

However, architecture should support future optional services:

- AI-written bios.
- AI-generated card content.
- Lead qualification.
- Lead summaries.
- Follow-up suggestions.
- Smart networking recommendations.
.

AI services must sit behind separate service interfaces and must not contaminate core domain models unnecessarily.

---

# 76. Release Strategy

This is a full-product build, but implementation must be staged to manage complexity.

## Phase 1 — Platform Foundation

- Repository structure.
- Authentication.
- User.
- Workspace.
- Membership.
- Roles/permissions.
- Tenant isolation.
- Core infrastructure.
- Database.
- CI/CD.
- Observability baseline.
.

## Phase 2 — Card Platform

- Card model.
- Templates.
- Builder.
- Media.
- Public card.
- Slugs.
- QR.
- Contact save.
- Sharing.
.

## Phase 3 — Growth / Lead Platform

- Lead capture.
- Leads.
- Contacts.
- CRM lite.
- Notifications.
- Analytics.
.

## Phase 4 — Team / Organization

- Organizations.
- Members.
- Departments.
- Teams.
- Employee lifecycle.
- Organization profiles.
.

## Phase 5 — Revenue Platform

- Plans.
- Entitlements.
- Billing.
- Razorpay integration.
- Coupons.
- Add-ons.
- Trials.
- Upgrade/downgrade.
.

## Phase 6 — Networking / Scheduling

- Events.
- Connections.
- Appointments.
.

## Phase 7 — Domain / NFC / Reseller

- Custom domains.
- NFC management.
- Reseller system.
- White-label features.
.

## Phase 8 — Enterprise / Scale

- SSO.
- SCIM.
- Advanced audit.
- Advanced API.
- Advanced analytics.
- Performance/scaling improvements.
.

---

# 77. Definition of Done — Engineering

A feature is not considered complete until:

- Database schema is implemented.
- API is implemented and documented.
- Authorization is implemented.
- Validation is implemented.
- UI is implemented.
- Loading/empty/error states exist.
- Unit/integration tests exist where applicable.
- End-to-end tests cover critical flows.
- Analytics events are defined where required.
- Audit events are defined where required.
- Entitlements are enforced.
- Documentation is updated.
- Observability exists for failure-prone operations.
- Security review considerations are addressed.
.

---

# 78. Definition of Done — SaaS/Billing

A commercial feature is complete only when:

- Plan mapping exists.
- Entitlement mapping exists.
- Limits are defined.
- Upgrade behavior exists.
- Downgrade behavior exists.
- Cancellation behavior exists.
- Billing events are handled.
- Webhooks are idempotent.
- UI shows clear pricing/limits.
- Usage is tracked where applicable.
- Admin visibility exists.
- Audit events exist.
.

---

# 79. Definition of Done — Public Card

A card is production-ready when:

- It is responsive.
- It loads quickly.
- It exposes only public fields.
- Call/WhatsApp/email actions work.
- Save contact works.
- QR resolves correctly.
- Analytics capture is asynchronous/fault-tolerant.
- SEO metadata works.
- Social sharing preview works.
- Suspended/unpublished states are handled.
- Accessibility checks pass.
.

---

# 80. Critical User Journeys

## Journey A — Individual

```text
Signup
 ↓
Verify email
 ↓
Create workspace
 ↓
Create card
 ↓
Choose template
 ↓
Add details
 ↓
Preview
 ↓
Publish
 ↓
Share QR/link
 ↓
Visitor opens card
 ↓
Save contact / WhatsApp / lead
 ↓
Owner receives analytics/lead
```

## Journey B — Team

```text
Owner signup
 ↓
Create team workspace
 ↓
Choose plan
 ↓
Invite members
 ↓
Members create cards
 ↓
Shared company branding
 ↓
Team analytics
 ↓
Leads
```

## Journey C — Organization

```text
Organization creation
 ↓
Branding
 ↓
Departments
 ↓
Teams
 ↓
Employee provisioning
 ↓
Cards
 ↓
Central analytics
 ↓
Lead management
 ↓
Offboarding
```

## Journey D — Reseller

```text
Reseller signup
 ↓
Partner approval
 ↓
Create client
 ↓
Configure client branding
 ↓
Provision cards
 ↓
Client manages users
 ↓
Reseller sees permitted account status
 ↓
Commission/revenue tracking
```

---

# 81. Non-Functional Acceptance Criteria

The product must:

- Maintain strict tenant isolation.
- Enforce server-side authorization.
- Remain responsive on modern mobile devices.
- Handle public-card traffic independently of dashboard workloads.
- Make billing changes idempotent and auditable.
- Support configuration-driven plans and entitlements.
- Allow one user to belong to multiple workspaces.
- Avoid code forks per customer.
- Support future custom domains.
- Support future white-labeling.
- Support future mobile clients through APIs.
- Support future enterprise authentication.
- Have automated tests around security boundaries and billing.
.

---

# 82. Explicit Out-of-Scope Unless Added to a Later Approved Revision

The following should not be added casually during development:

- Full ERP.
- Full CRM competing with enterprise CRM platforms.
- Native mobile apps without a separate product decision.
- Marketplace for cards.
- Social media network unrelated to product value.
- Complex AI agents in core card creation.
- Hardware manufacturing infrastructure.
- Custom client code forks.
- Arbitrary customer-specific database modifications.
- Microservices solely for architectural fashion.

Any new scope must be mapped to an existing domain/module and assessed for impact on architecture, security, billing, permissions, and support.

---

# 83. Recommended Initial Repository Structure

Example:

```text
/apps
  /web
  /admin
  /api

/packages
  /ui
  /config
  /auth
  /database
  /billing
  /entitlements
  /analytics
  /types
  /validation
  /notifications

/infrastructure
  /docker
  /terraform-or-infra

/docs
  /product
  /architecture
  /api
  /database
  /security
  /billing
  /runbooks
```

This is a guideline. The implementation team may adapt it while retaining module boundaries.

---

# 84. Required Documentation Set Before Major Implementation

Create and maintain these documents:

1. Product Requirements Specification.
2. SaaS Architecture Specification.
3. Multi-Tenant Architecture Specification.
4. Account Types & Workspace Specification.
5. Roles & Permissions Matrix.
6. Plans, Pricing & Entitlements Specification.
7. Billing & Subscription Specification.
8. Database Design Specification.
9. API Specification.
10. UI/UX Sitemap and Screen Specification.
11. Public Card Design System.
12. Analytics Event Specification.
13. Security Specification.
14. Notification Specification.
15. Reseller & White-Label Specification.
16. NFC/QR Specification.
17. Testing Strategy.
18. Deployment Architecture.
19. Observability & Operations Runbook.
20. Data Retention & Privacy Specification.
21. Implementation Roadmap.
22. Release Acceptance Checklist.

These documents must reference one another consistently.

---

# 85. Final Product Architecture Summary

The finished platform should conceptually operate as follows:

```text
                              PLATFORM
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
         INDIVIDUAL           BUSINESS              RESELLER
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  │
                              WORKSPACE
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
           MEMBERS              BRAND              SETTINGS
              │                   │
              └───────────────────┼───────────────────┘
                                  │
                           DIGITAL IDENTITY
                                  │
        ┌──────────────┬──────────┼──────────┬──────────────┐
        │              │          │          │              │
       CARD           QR         NFC       PROFILE        LINKS
        │
        ├── Services
        ├── Products
        ├── Gallery
        ├── Testimonials
        └── CTA
                                  │
                         INTERACTION LAYER
                                  │
       ┌─────────────┬───────────┼──────────┬─────────────┐
       │             │           │          │             │
      CALL        WHATSAPP     EMAIL       SAVE         SHARE
                                  │
                              LEAD LAYER
                                  │
                     ┌────────────┴────────────┐
                     │                         │
                   LEADS                    CONTACTS
                     │                         │
                     └────────────┬────────────┘
                                  │
                                CRM
                                  │
                              ANALYTICS
                                  │
                         NETWORKING / EVENTS
                                  │
                           APPOINTMENTS
                                  │
                            SaaS BILLING
                                  │
                         PLANS / ENTITLEMENTS
                                  │
                           ADMIN / SUPPORT
```

---

# 86. Final Development Rules

1. Treat this document as the baseline product requirement.
2. Do not implement plans as hardcoded conditionals.
3. Do not couple individual accounts directly to features in a way that prevents workspace membership.
4. Do not build separate technical products for Individual, Team, Organization, and Enterprise.
5. Do not allow frontend-only authorization.
6. Do not expose unpublished/private card fields through public endpoints.
7. Do not process payment webhooks without signature verification and idempotency.
8. Do not add a new feature without defining its permissions and entitlement behavior.
9. Do not add a billable resource without defining its usage/limit behavior.
10. Do not launch public URLs without abuse/rate-limit controls.
11. Do not create customer-specific code forks.
12. Keep public-card performance independent from dashboard workloads.
13. Keep billing provider logic behind an abstraction layer.
14. Keep analytics processing asynchronous where practical.
15. Keep all sensitive operational actions auditable.
16. Prefer a modular monolith until scale requires service extraction.
17. Build APIs so future web/mobile clients can consume the same capabilities.
18. Keep India-specific commercial functionality configurable rather than hardcoded into domain logic.
19. Use automated tests for tenant isolation, permissions, billing, and critical public-card flows.
20. Every release must pass security, billing, regression, and production-readiness checks.

---

# 87. Product Outcome

The completed system should be more than a digital visiting card generator.

It should provide a unified platform for:

**Professional Identity**

**Digital Visiting Cards**

**QR & NFC Sharing**

**Business Profiles**

**Lead Capture**

**Contacts / CRM Lite**

**Analytics**

**Teams & Organizations**

**Networking & Events**

**Appointments**

**Subscriptions & Billing**

**Resellers**

**White-Label SaaS**

**Enterprise Administration**

The architecture must allow the product to start as a simple, highly usable digital-card SaaS while growing into a broader professional identity and networking platform without requiring a fundamental rewrite.

---

**End of Requirements — Version 1.0**

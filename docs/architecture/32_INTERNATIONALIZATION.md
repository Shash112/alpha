# 32 — Internationalization & India-First Architecture

**Document Version:** 1.0  
**Status:** Approved Technical Architecture  
**Scope:** Multi-Language Support, India-First Localization Defaults, Currency & GST Compliance  

---

## 1. India-First Localization Defaults

While globally extensible, Alpha is optimized primary for the Indian market:

1. **Default Currency:** INR (₹). Currency values are stored in integer paise in DB (e.g. ₹499.00 = `49900`).
2. **Default Time Zone:** `Asia/Kolkata` (IST - UTC+5:30).
3. **Payment Methods:** Full native support for Razorpay UPI (Google Pay, PhonePe, Paytm), RuPay debit cards, Netbanking, and Credit Cards.
4. **GST Tax Compliance:** B2B invoices capture GSTIN (`27AAAAA0000A1Z5`) and calculate CGST, SGST, or IGST based on billing address state.

---

## 2. Multi-Language Public Profile Architecture

Public cards support multi-language translation strings (`locale` parameter):

```json
{
  "cardId": "crd_12345",
  "defaultLocale": "en-IN",
  "supportedLocales": ["en-IN", "hi-IN", "mr-IN", "ta-IN", "te-IN"],
  "translations": {
    "hi-IN": {
      "designation": "वरिष्ठ सलाहकार",
      "bio": "व्यावसायिक प्रौद्योगिकी विशेषज्ञ"
    }
  }
}
```

- **Locale Detection:** Public card renderer checks `Accept-Language` HTTP header or explicit `?lang=hi` query parameter to serve localized Strings.

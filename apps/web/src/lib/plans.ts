export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'A$'
};

export interface PlanPricing {
  monthly: number;
  annual: number;
}

export interface PlanDefinition {
  id: string;
  key: string;
  name: string;
  family: string;
  description: string;
  prices: Record<Currency, PlanPricing>;
  features: string[];
  highlight?: boolean;
  badge?: string;
  ctaText: string;
  ctaHref: string;
}

export const PLANS: PlanDefinition[] = [
  {
    id: 'plan_free_personal',
    key: 'free',
    name: 'Free Personal',
    family: 'Free Plan',
    description: 'Essential digital business card for individual professionals worldwide.',
    prices: {
      USD: { monthly: 0, annual: 0 },
      EUR: { monthly: 0, annual: 0 },
      GBP: { monthly: 0, annual: 0 },
      INR: { monthly: 0, annual: 0 },
      CAD: { monthly: 0, annual: 0 },
      AUD: { monthly: 0, annual: 0 }
    },
    features: [
      '1 Active Digital Card',
      'Dynamic Vector QR Code export',
      'Standard Card Templates',
      'vCard (.vcf) Contact Download',
      'Basic Profile Analytics'
    ],
    ctaText: 'Get Started Free',
    ctaHref: '/register'
  },
  {
    id: 'plan_personal_pro',
    key: 'pro',
    name: 'Personal Pro',
    family: 'Pro Plan',
    description: 'Advanced identity tools with custom branding, vanity aliases, and lead capture.',
    prices: {
      USD: { monthly: 5.99, annual: 4.90 },
      EUR: { monthly: 5.49, annual: 4.50 },
      GBP: { monthly: 4.99, annual: 3.90 },
      INR: { monthly: 499, annual: 399 },
      CAD: { monthly: 7.99, annual: 6.50 },
      AUD: { monthly: 8.49, annual: 6.90 }
    },
    features: [
      'Up to 5 Active Cards',
      'Custom Vanity URL Alias (alpha.com/alias)',
      'Remove Alpha Brand Watermark',
      'Lead Capture Form & CRM Lite',
      'NFC Tap Card Software Routing',
      'Real-time Detailed Analytics'
    ],
    highlight: true,
    badge: 'MOST POPULAR',
    ctaText: 'Start Pro Trial',
    ctaHref: '/register'
  },
  {
    id: 'plan_team_annual',
    key: 'team',
    name: 'Team & SMB',
    family: 'Team Plan',
    description: 'Centralized management for growing business teams and employee directories.',
    prices: {
      USD: { monthly: 24.99, annual: 19.90 },
      EUR: { monthly: 22.99, annual: 18.50 },
      GBP: { monthly: 19.99, annual: 15.90 },
      INR: { monthly: 2499, annual: 1999 },
      CAD: { monthly: 32.99, annual: 26.90 },
      AUD: { monthly: 34.99, annual: 28.90 }
    },
    features: [
      'Up to 25 Team Cards',
      'Centralized Brand Guidelines & Lock templates',
      'Bulk CSV Employee Provisioning',
      'Departmental Grouping & Role RBAC',
      'Team Aggregated Lead Feed',
      'Priority Global Support'
    ],
    ctaText: 'Start Team Trial',
    ctaHref: '/register'
  },
  {
    id: 'plan_business_annual',
    key: 'enterprise',
    name: 'Enterprise / Agency',
    family: 'Enterprise',
    description: 'Custom CNAME domains, white-label branding, SSO/SAML, and reseller portals.',
    prices: {
      USD: { monthly: 59.99, annual: 49.90 },
      EUR: { monthly: 54.99, annual: 46.90 },
      GBP: { monthly: 49.99, annual: 39.90 },
      INR: { monthly: 9999, annual: 7999 },
      CAD: { monthly: 79.99, annual: 67.90 },
      AUD: { monthly: 84.99, annual: 72.90 }
    },
    features: [
      'Unlimited Employee Cards',
      'Custom CNAME Domain (card.yourbrand.com)',
      'Full White-label Branding',
      'Single Sign-On (SSO / SAML 2.0)',
      'Dedicated Account Manager',
      'Reseller Agency Revenue Portal'
    ],
    ctaText: 'Contact Sales',
    ctaHref: '/contact'
  }
];

export function getPlanPrice(plan: PlanDefinition, currency: Currency, billingCycle: 'monthly' | 'annual'): number {
  const p = plan.prices[currency];
  if (!p) return 0;
  return billingCycle === 'annual' ? p.annual : p.monthly;
}

export function formatPlanPrice(plan: PlanDefinition, currency: Currency, billingCycle: 'monthly' | 'annual'): string {
  const val = getPlanPrice(plan, currency, billingCycle);
  if (val === 0) return 'Free';
  const sym = CURRENCY_SYMBOLS[currency] || '$';
  return `${sym}${val.toLocaleString()}`;
}

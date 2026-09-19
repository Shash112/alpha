export type ErrorCode = 'UNAUTHENTICATED' | 'TENANT_ACCESS_DENIED' | 'PERMISSION_DENIED' | 'ENTITLEMENT_LIMIT_EXCEEDED' | 'RESOURCE_NOT_FOUND' | 'CARD_SLUG_ALREADY_EXISTS' | 'CONCURRENCY_CONFLICT' | 'RATE_LIMIT_EXCEEDED' | 'INTERNAL_SERVER_ERROR' | 'INVALID_INPUT' | 'SLUG_RESERVED' | 'WEBHOOK_VERIFICATION_FAILED';
export interface ApiErrorResponse {
    code: ErrorCode;
    message: string;
    requestId: string;
    timestamp: string;
    details?: Record<string, any>;
}
export interface TenantContext {
    workspaceId: string;
    userId: string;
    roleId?: string;
    isDelegated?: boolean;
    delegatedByResellerId?: string;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    cursor?: string;
    search?: string;
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        nextCursor?: string;
    };
}
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export type WorkspaceType = 'PERSONAL' | 'TEAM' | 'BUSINESS' | 'ENTERPRISE' | 'AGENCY';
export type WorkspaceStatus = 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'GRACE_PERIOD' | 'SUSPENDED' | 'CANCELLED' | 'DELETION_PENDING' | 'DELETED';
export type MembershipStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';
export interface UserDto {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    displayName: string;
    avatarUrl?: string;
    phone?: string;
    locale: string;
    timezone: string;
    status: UserStatus;
    createdAt: string;
}
export interface WorkspaceDto {
    id: string;
    type: WorkspaceType;
    name: string;
    ownerUserId: string;
    status: WorkspaceStatus;
    logoUrl?: string;
    brandColor?: string;
    createdAt: string;
}
export interface WorkspaceMembershipDto {
    id: string;
    workspaceId: string;
    userId: string;
    roleId: string;
    roleName?: string;
    status: MembershipStatus;
    joinedAt: string;
    user?: UserDto;
}
export type CardStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'SUSPENDED' | 'ARCHIVED' | 'DELETED';
export type FieldVisibility = 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
export interface CardSectionField {
    value: any;
    visibility: FieldVisibility;
}
export interface CardSectionPayload {
    id: string;
    type: 'hero' | 'about' | 'contact' | 'social' | 'services' | 'products' | 'gallery' | 'testimonials' | 'cta' | 'lead_form' | 'appointments';
    title?: string;
    order: number;
    enabled: boolean;
    fields: Record<string, CardSectionField>;
}
export interface CardDto {
    id: string;
    publicId: string;
    workspaceId: string;
    ownerUserId?: string;
    templateId: string;
    title: string;
    status: CardStatus;
    isPrimary: boolean;
    canonicalUrl: string;
    activeAlias?: string;
    currentRevisionId?: string;
    sections?: CardSectionPayload[];
    createdAt: string;
    updatedAt: string;
}
export interface PublicCardProjectionDto {
    publicId: string;
    title: string;
    activeAlias?: string;
    canonicalUrl: string;
    templateLayout: Record<string, any>;
    sections: CardSectionPayload[];
    workspaceBranding?: {
        logoUrl?: string;
        brandColor?: string;
        hidePlatformBranding: boolean;
    };
}
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'ARCHIVED';
export interface LeadDto {
    id: string;
    workspaceId: string;
    cardId: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
    status: LeadStatus;
    customFields?: Record<string, any>;
    createdAt: string;
}
export type BillingPeriod = 'MONTHLY' | 'ANNUAL';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'UNPAID' | 'CANCELLED' | 'HALTED';
export interface PlanDto {
    id: string;
    family: string;
    name: string;
    billingPeriod: BillingPeriod;
    priceInr: number;
    entitlements: Record<string, any>;
}
export interface SubscriptionDto {
    id: string;
    workspaceId: string;
    planId: string;
    provider: string;
    providerSubscriptionId: string;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}
export type NFCDeviceStatus = 'UNACTIVATED' | 'ACTIVE' | 'DISABLED' | 'REBOUND';
export interface NFCDeviceDto {
    id: string;
    deviceUid: string;
    activationCode: string;
    workspaceId?: string;
    assignedCardId?: string;
    status: NFCDeviceStatus;
    tapCount: number;
    lastTappedAt?: string;
}
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export interface AppointmentDto {
    id: string;
    workspaceId: string;
    cardId: string;
    appointmentTypeId: string;
    attendeeName: string;
    attendeeEmail: string;
    attendeePhone?: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    meetingLink?: string;
}
//# sourceMappingURL=index.d.ts.map
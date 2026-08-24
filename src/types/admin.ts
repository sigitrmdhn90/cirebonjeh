import type { PlaceSubmissionDraft } from "@/types/placeSubmission";
export type AdminRole="admin"|"super_admin";
export interface AdminProfile{uid:string;email:string;role:AdminRole;active:boolean;createdAt?:unknown}
export type AdminSubmissionStatus="pending"|"reviewing"|"revision_required"|"approved"|"rejected";
export interface AdminSubmission extends PlaceSubmissionDraft{id:string;submissionCode:string;status:AdminSubmissionStatus;coverImage:string;images:string[];adminNotes?:string;revisionNote?:string;rejectReason?:string;reviewedBy?:string;reviewedAt?:unknown;approvedBy?:string;approvedAt?:unknown;publishedPlaceId?:string;createdAt?:unknown}
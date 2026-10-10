import type * as React from 'npm:react@18.3.1'
import { template as bookingOwnerAlert } from './booking-owner-alert.tsx'
import { template as bookingAutoReply } from './booking-auto-reply.tsx'
import { template as signupOwnerAlert } from './signup-owner-alert.tsx'
import { template as listWelcome } from './list-welcome.tsx'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient, overrides the caller's recipientEmail. */
  to?: string
  /** Display name in the From header. Defaults to the site name. */
  fromName?: string
  /** Reply-To address, static or derived from templateData. */
  replyTo?: string | ((data: Record<string, any>) => string | undefined)
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-owner-alert': bookingOwnerAlert,
  'booking-auto-reply': bookingAutoReply,
  'signup-owner-alert': signupOwnerAlert,
  'list-welcome': listWelcome,
}

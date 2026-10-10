// Shared look for Mr. CAP app emails. Dark card, bone text, magenta and violet accents.
export const COLORS = {
  ink: '#110b18',
  bone: '#ede6da',
  muted: '#b9b0a3',
  magenta: '#d2347a',
  violet: '#6e30c9',
}

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '16px 0',
}
export const container = {
  backgroundColor: COLORS.ink,
  maxWidth: '560px',
  width: '100%',
  margin: '0 auto',
  padding: '32px 24px',
  borderRadius: '12px',
}
export const eyebrow = {
  color: COLORS.magenta,
  fontSize: '12px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}
export const h1 = { color: COLORS.bone, fontSize: '24px', lineHeight: '1.3', margin: '0 0 20px', fontWeight: 'bold' as const }
export const text = { color: COLORS.bone, fontSize: '16px', lineHeight: '1.6', margin: '0 0 16px' }
export const label = { color: COLORS.muted, fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '1px', margin: '0' }
export const value = { color: COLORS.bone, fontSize: '15px', lineHeight: '1.5', margin: '2px 0 14px', whiteSpace: 'pre-wrap' as const }
export const button = {
  backgroundColor: COLORS.magenta,
  color: COLORS.bone,
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '10px',
  padding: '14px 26px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const hr = { borderColor: COLORS.violet, borderWidth: '1px 0 0', margin: '24px 0' }
export const small = { color: COLORS.muted, fontSize: '12px', lineHeight: '1.5', margin: '0' }
export const link = { color: COLORS.magenta, textDecoration: 'underline' }

export const BOOKING_TYPES: Record<string, string> = {
  show: 'Live Performance',
  feature: 'Verse or Feature',
  interview: 'Interview or Podcast',
  speaking: 'Speaking Engagement',
  other: 'Other',
}

export const bookingTypeLabel = (t?: string | null) => (t ? BOOKING_TYPES[t] ?? t : 'Other')

export const formatDate = (d?: string | null) => {
  if (!d) return ''
  const dt = new Date(`${d.slice(0, 10)}T12:00:00Z`)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export const formatTime = (ts?: string | null) => {
  const dt = ts ? new Date(ts) : new Date()
  if (isNaN(dt.getTime())) return String(ts)
  return dt.toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Chicago',
  }) + ' (Houston time)'
}

export const testPrefix = (data: Record<string, any>) => (data?.test ? '[TEST] ' : '')

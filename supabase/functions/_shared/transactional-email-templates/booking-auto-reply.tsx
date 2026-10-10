import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Link, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as s from './brand.ts'

interface Props {
  name?: string
  booking_type?: string
  event_date?: string | null
  city?: string | null
}

export const bookingSentence = (p: Props) => {
  const first = (p.name || '').trim().split(/\s+/)[0]
  let req = `Your request for ${s.bookingTypeLabel(p.booking_type).toLowerCase()}`
  if (p.event_date) req += ` on ${s.formatDate(p.event_date)}`
  if (p.city && p.city.trim()) req += ` in ${p.city.trim()}`
  return { thanks: first ? `Thanks, ${first}.` : 'Thanks.', req: `${req} reached Mr. CAP's team.` }
}

const BookingAutoReply = (p: Props) => {
  const { thanks, req } = bookingSentence(p)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your booking request reached Mr. CAP's team</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Text style={s.eyebrow}>Mr. CAP</Text>
          <Heading style={s.h1}>We got your booking request</Heading>
          <Text style={s.text}>{thanks} {req} Every inquiry gets a response within 48 hours.</Text>
          <Text style={s.text}>
            To add details, just reply to this email or write{' '}
            <Link href="mailto:music@mrcap1.com" style={s.link}>music@mrcap1.com</Link>.
          </Text>
          <Text style={{ ...s.text, marginBottom: 0 }}>Mr. CAP</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: BookingAutoReply,
  subject: (d: Record<string, any>) => `${s.testPrefix(d)}We got your booking request`,
  fromName: 'Mr. CAP',
  replyTo: 'music@mrcap1.com',
  displayName: 'Booking auto reply',
  previewData: { name: 'Jane Rivera', booking_type: 'show', event_date: '2026-12-05', city: 'Houston, TX' },
} satisfies TemplateEntry

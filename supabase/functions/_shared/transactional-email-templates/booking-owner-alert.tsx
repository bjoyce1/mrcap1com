import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as s from './brand.ts'

interface Props {
  name?: string
  email?: string
  phone?: string | null
  booking_type?: string
  city?: string | null
  venue?: string | null
  event_date?: string | null
  message?: string | null
  created_at?: string
}

const Field = ({ k, v }: { k: string; v?: string | null }) => (
  <>
    <Text style={s.label}>{k}</Text>
    <Text style={s.value}>{v && String(v).trim() ? v : 'Not given'}</Text>
  </>
)

const BookingOwnerAlert = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New booking request from ${p.name || 'someone'}`}</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>Booking request</Text>
        <Heading style={s.h1}>{p.name || 'New request'} wants to book Mr. CAP</Heading>
        <Section>
          <Field k="Name" v={p.name} />
          <Field k="Email" v={p.email} />
          <Field k="Phone" v={p.phone} />
          <Field k="Booking type" v={s.bookingTypeLabel(p.booking_type)} />
          <Field k="City" v={p.city} />
          <Field k="Venue" v={p.venue} />
          <Field k="Event date" v={s.formatDate(p.event_date)} />
          <Field k="Message" v={p.message} />
          <Field k="Received" v={s.formatTime(p.created_at)} />
        </Section>
        <Button style={s.button} href="https://mrcap1.com/admin">Open the admin panel</Button>
        <Text style={{ ...s.small, marginTop: '20px' }}>Reply to this email to answer {p.name || 'the requester'} directly.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: BookingOwnerAlert,
  subject: (d: Record<string, any>) =>
    `${s.testPrefix(d)}New booking request: ${d.name || 'Unknown'}, ${s.bookingTypeLabel(d.booking_type)}, ${d.city || 'city not given'}`,
  to: 'mrcap11@gmail.com',
  fromName: 'Mr. CAP Legacy',
  replyTo: (d: Record<string, any>) => d.email,
  displayName: 'Booking alert (owner)',
  previewData: {
    name: 'Jane Rivera', email: 'jane@example.com', phone: '713 555 0100', booking_type: 'show',
    city: 'Houston, TX', venue: 'Warehouse Live', event_date: '2026-12-05', message: 'Looking for a 30 minute set.',
    created_at: new Date().toISOString(),
  },
} satisfies TemplateEntry

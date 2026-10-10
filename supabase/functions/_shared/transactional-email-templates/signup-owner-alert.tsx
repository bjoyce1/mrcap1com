import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as s from './brand.ts'

interface Props {
  email?: string
  name?: string | null
  city?: string | null
  favorite_song?: string | null
  source?: string | null
  list?: string
  created_at?: string
}

const Row = ({ k, v }: { k: string; v?: string | null }) =>
  v && String(v).trim() ? (
    <>
      <Text style={s.label}>{k}</Text>
      <Text style={s.value}>{v}</Text>
    </>
  ) : null

const SignupOwnerAlert = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New list signup: ${p.email || ''}`}</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>List signup</Text>
        <Heading style={s.h1}>Someone joined the list</Heading>
        <Row k="Email" v={p.email} />
        <Row k="Name" v={p.name} />
        <Row k="City" v={p.city} />
        <Row k="Favorite song" v={p.favorite_song} />
        <Row k="Source" v={p.source || 'Not recorded'} />
        <Row k="List" v={p.list === 'fan_signups' ? 'Fan signups' : 'Newsletter'} />
        <Row k="Time" v={s.formatTime(p.created_at)} />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: SignupOwnerAlert,
  subject: (d: Record<string, any>) => `${s.testPrefix(d)}New list signup: ${d.email || 'unknown'}`,
  to: 'mrcap11@gmail.com',
  fromName: 'Mr. CAP Legacy',
  displayName: 'Signup alert (owner)',
  previewData: {
    email: 'fan@example.com', name: 'Marcus', city: 'Houston', favorite_song: 'Big Boy Drip',
    source: 'early_access:track:big-boy-drip', list: 'fan_signups', created_at: new Date().toISOString(),
  },
} satisfies TemplateEntry

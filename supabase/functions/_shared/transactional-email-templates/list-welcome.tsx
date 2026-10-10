import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as s from './brand.ts'

const ListWelcome = () => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Mr. CAP songs reach you first</Preview>
    <Body style={s.main}>
      <Container style={s.container}>
        <Text style={s.eyebrow}>Mr. CAP</Text>
        <Heading style={s.h1}>You're on the list</Heading>
        <Text style={s.text}>
          Thanks for joining. New Mr. CAP songs reach this list before they hit Spotify and Apple Music.
          Until the next one drops, the whole catalog is at mrcap1.com/music.
        </Text>
        <Button style={s.button} href="https://mrcap1.com/music">Listen now</Button>
        <Text style={{ ...s.text, marginTop: '24px', marginBottom: 0 }}>Mr. CAP</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ListWelcome,
  subject: (d: Record<string, any>) => `${s.testPrefix(d)}You're on the list`,
  fromName: 'Mr. CAP',
  displayName: 'List welcome',
  previewData: {},
} satisfies TemplateEntry

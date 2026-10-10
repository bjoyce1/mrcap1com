// Called by database triggers right after a new booking or list signup row is inserted.
// It loads the row itself (never trusting the caller's data), only acts on rows created
// in the last 15 minutes, and hands each email to send-transactional-email with an
// idempotency key per row, so repeated calls never send twice.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const OWNER = 'mrcap11@gmail.com'
const FRESH_MS = 15 * 60 * 1000

const Body = z.union([
  z.object({
    table: z.enum(['booking_requests', 'newsletter_subscribers', 'fan_signups']),
    id: z.string().uuid(),
  }),
  z.object({ test: z.literal(true) }),
])

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(url, key)

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return json({ error: 'Invalid body' }, 400)

  const send = async (templateName: string, recipientEmail: string, idempotencyKey: string, templateData: Record<string, unknown>) => {
    const r = await fetch(`${url}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, apikey: key },
      body: JSON.stringify({ templateName, recipientEmail, idempotencyKey, templateData }),
    })
    const out = await r.json().catch(() => ({}))
    return { templateName, status: r.status, ...out }
  }

  const body = parsed.data

  // Test mode: one sample of each email, all to the owner, subjects marked [TEST].
  if ('test' in body) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('email_send_log')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_email', OWNER)
      .gte('created_at', since)
    if ((count ?? 0) >= 20) return json({ error: 'Too many test sends, try later' }, 429)
    const stamp = Date.now()
    const now = new Date().toISOString()
    const booking = {
      test: true, name: 'Jane Rivera', email: OWNER, phone: '713 555 0100', booking_type: 'show',
      city: 'Houston, TX', venue: 'Warehouse Live', event_date: '2026-12-05',
      message: 'Sample booking request. Looking for a 30 minute set.', created_at: now,
    }
    const results = [
      await send('booking-owner-alert', OWNER, `test-booking-owner-${stamp}`, booking),
      await send('booking-auto-reply', OWNER, `test-booking-reply-${stamp}`, booking),
      await send('signup-owner-alert', OWNER, `test-signup-owner-${stamp}`, {
        test: true, email: 'fan@example.com', name: 'Marcus', city: 'Houston', favorite_song: 'Big Boy Drip',
        source: 'early_access:track:big-boy-drip', list: 'fan_signups', created_at: now,
      }),
      await send('list-welcome', OWNER, `test-list-welcome-${stamp}`, { test: true }),
    ]
    return json({ results })
  }

  const { table, id } = body
  const { data: row, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
  if (error || !row) return json({ error: 'Row not found' }, 404)

  const createdAt = (row.created_at ?? row.subscribed_at) as string
  if (!createdAt || Date.now() - new Date(createdAt).getTime() > FRESH_MS) {
    return json({ skipped: 'not a new row' })
  }

  const results = []
  if (table === 'booking_requests') {
    const data = {
      name: row.name, email: row.email, phone: row.phone, booking_type: row.booking_type,
      city: row.city, venue: row.venue, event_date: row.event_date, message: row.message, created_at: row.created_at,
    }
    results.push(await send('booking-owner-alert', OWNER, `booking-owner-${id}`, data))
    if (row.email) results.push(await send('booking-auto-reply', row.email, `booking-reply-${id}`, data))
  } else {
    const data = {
      email: row.email, name: row.name ?? null, city: row.city ?? null, favorite_song: row.favorite_song ?? null,
      source: row.source_page ?? row.source ?? null, list: table, created_at: createdAt,
    }
    results.push(await send('signup-owner-alert', OWNER, `signup-owner-${table}-${id}`, data))
    if (row.email) results.push(await send('list-welcome', row.email, `list-welcome-${table}-${id}`, {}))
  }
  return json({ results })
})

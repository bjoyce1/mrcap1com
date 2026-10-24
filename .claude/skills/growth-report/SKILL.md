---
name: growth-report
description: Report mrcap1.com traffic, fan signups, bookings and sales with one clear next action. Use for the morning brief, weekly numbers, or "how is the site doing?".
---

# Growth report

Project id: `7f352d5d-72a0-4b6c-adeb-d26f44fc0b6c`. All database access is SELECT only.

1. Traffic — Lovable `get_project_analytics` for the period (default last 7 days) and the one before it.
   Report visitors, pageviews, bounce rate, top pages, sources, countries.
   Flag bot-like traffic: visitors from CN/HK with ~100% bounce are almost certainly not fans —
   report "real" US/other visitors separately.
2. Conversions — Lovable `query_database`:
   ```sql
   select
     (select count(*) from booking_requests where created_at > now() - interval '7 days') bookings,
     (select count(*) from fan_signups where created_at > now() - interval '7 days') fan_signups,
     (select count(*) from newsletter_subscribers where subscribed_at > now() - interval '7 days') subscribers,
     (select count(*) from purchases where paid_at > now() - interval '7 days') sales,
     (select count(*) from merch_orders where created_at > now() - interval '7 days') merch_orders;
   ```
   For any new booking request, include name, date and event type (not the email address).
3. Output, short enough to read on a phone:
   - One line of numbers with change vs previous period
   - Anything that needs a reply (bookings, buyers)
   - **One** recommended action for today, tied to the numbers (e.g. "Google sent 1 visitor —
     publish the Houston hip-hop history post to Google Search Console")

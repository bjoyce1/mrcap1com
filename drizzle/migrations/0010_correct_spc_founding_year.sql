UPDATE public.legends_marketing_content
SET body = CASE slug
  WHEN 'south-park-coalition-legacy' THEN replace(
    body,
    'Site pages give both 1986 and 1987 as the founding year; this draft will use one date after confirmation.',
    'The South Park Coalition was founded in 1987. Primary historical source: Mr. CAP, an Original Member of the South Park Coalition, confirmed the 1987 founding year from firsthand knowledge on November 27, 2026.'
  )
  WHEN 'underground-houston-rap' THEN replace(
    body,
    'South Park Coalition founding (date needs confirming: 1986 or 1987).',
    'South Park Coalition founded in 1987. Primary historical source: Mr. CAP, an Original Member of the South Park Coalition, confirmed the 1987 founding year from firsthand knowledge on November 27, 2026.'
  )
  WHEN 'k-rino' THEN replace(
    body,
    'The founding year appears as both 1986 and 1987 in different site pages and must be confirmed before publication.',
    'The South Park Coalition was founded in 1987. Primary historical source: Mr. CAP, an Original Member of the South Park Coalition, confirmed the 1987 founding year from firsthand knowledge on November 27, 2026.'
  )
  ELSE body
END,
sources = CASE
  WHEN NOT (sources @> ARRAY['https://mrcap1.com/south-park-coalition#founding-source']::text[])
  THEN array_append(sources, 'https://mrcap1.com/south-park-coalition#founding-source')
  ELSE sources
END
WHERE id IN (
  'd4d1e6d8-9682-4687-a01f-e7a2421bc44a'::uuid,
  '0719f75b-fddd-45f4-8935-fde05de4f739'::uuid,
  '2be9203a-fabb-423f-b4f9-363b9af654c6'::uuid
);
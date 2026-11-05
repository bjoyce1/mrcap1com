REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.legends_vault_purchases FROM authenticated, anon;
REVOKE SELECT ON public.legends_vault_purchases FROM anon;
GRANT SELECT ON public.legends_vault_purchases TO authenticated;
GRANT ALL ON public.legends_vault_purchases TO service_role;
import { createElement } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { Session } from '@supabase/supabase-js';
import { describe, expect, it, vi } from 'vitest';

let resolveRole: (value: { data: unknown; error: null }) => void = () => {};
let authChange: (event: string, session: Session | null) => void = () => {};
vi.mock('@/stores/purchasesStore', () => ({ usePurchasesStore: { getState: () => ({ hydrate: vi.fn() }) } }));
vi.mock('@/integrations/supabase/client', () => {
  const query = { select: () => query, eq: () => query, maybeSingle: () => new Promise((r) => { resolveRole = r; }) };
  return { supabase: {
    auth: {
      onAuthStateChange: (callback: typeof authChange) => { authChange = callback; return { data: { subscription: { unsubscribe: vi.fn() } } }; },
      getSession: () => Promise.resolve({ data: { session: { user: { id: 'admin-1' } } } }),
    },
    from: () => query,
  } };
});

import { AuthProvider, useAuth } from './useAuth';

describe('admin access loading', () => {
  it('keeps access loading until the admin role check finishes', async () => {
    const states: Array<{ loading: boolean; isAdmin: boolean }> = [];
    const Probe = () => { const a = useAuth(); states.push({ loading: a.loading, isAdmin: a.isAdmin }); return null; };
    await act(async () => { TestRenderer.create(createElement(AuthProvider, null, createElement(Probe))); });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    expect(states.at(-1)).toEqual({ loading: true, isAdmin: false });
    await act(async () => { resolveRole({ data: { role: 'admin' }, error: null }); });
    expect(states.at(-1)).toEqual({ loading: false, isAdmin: true });
    expect(states).not.toContainEqual({ loading: false, isAdmin: false });
  });
  it('does not grant admin access when the server returns no role', async () => {
    let state = { loading: true, isAdmin: false };
    const Probe = () => { const a = useAuth(); state = { loading: a.loading, isAdmin: a.isAdmin }; return null; };
    await act(async () => { TestRenderer.create(createElement(AuthProvider, null, createElement(Probe))); });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    await act(async () => { resolveRole({ data: null, error: null }); });
    expect(state).toEqual({ loading: false, isAdmin: false });
  });
  it('discards a pending admin role after sign-out', async () => {
    let state = { loading: true, isAdmin: false, user: false };
    const Probe = () => { const a = useAuth(); state = { loading: a.loading, isAdmin: a.isAdmin, user: !!a.user }; return null; };
    await act(async () => { TestRenderer.create(createElement(AuthProvider, null, createElement(Probe))); });
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    await act(async () => { authChange('SIGNED_OUT', null); });
    await act(async () => { resolveRole({ data: { role: 'admin' }, error: null }); });
    expect(state).toEqual({ loading: false, isAdmin: false, user: false });
  });
});
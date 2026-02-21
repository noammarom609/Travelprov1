// ═══════════════════════════════════════════════════
// TravelPro — API Client
// Communicates with the Supabase Edge Function server
// ═══════════════════════════════════════════════════

import { projectId, publicAnonKey } from '/utils/supabase/info';
import type { Supplier, Project } from './data';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0045c7fc`;

// ─── Generic fetch wrapper ───────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const method = options?.method || 'GET';

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      console.error(`API error [${method} ${path}]:`, errorBody);
      throw new Error(errorBody.error || `HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.data as T;
  } catch (err) {
    console.error(`API request failed [${method} ${path}]:`, err);
    throw err;
  }
}

// ─── Suppliers ───────────────────────────────────

export const suppliersApi = {
  list: (): Promise<Supplier[]> => request<Supplier[]>('/suppliers'),

  get: (id: string): Promise<Supplier> => request<Supplier>(`/suppliers/${encodeURIComponent(id)}`),

  create: (data: Partial<Supplier>): Promise<Supplier> =>
    request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Supplier>): Promise<Supplier> =>
    request<Supplier>(`/suppliers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// ─── Supplier Sub-resources ──────────────────────

export interface SupplierContact {
  id: string;
  supplierId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  primary: boolean;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  name: string;
  price: number;
  description: string;
  unit: string;
}

export interface SupplierDocument {
  id: string;
  supplierId: string;
  name: string;
  expiry: string;
  status: 'valid' | 'warning' | 'expired';
  fileName?: string;
}

export const supplierContactsApi = {
  list: (supplierId: string): Promise<SupplierContact[]> =>
    request<SupplierContact[]>(`/suppliers/${encodeURIComponent(supplierId)}/contacts`),
  create: (supplierId: string, data: Partial<SupplierContact>): Promise<SupplierContact> =>
    request<SupplierContact>(`/suppliers/${encodeURIComponent(supplierId)}/contacts`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (supplierId: string, contactId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(supplierId)}/contacts/${encodeURIComponent(contactId)}`, { method: 'DELETE' }),
};

export const supplierProductsApi = {
  list: (supplierId: string): Promise<SupplierProduct[]> =>
    request<SupplierProduct[]>(`/suppliers/${encodeURIComponent(supplierId)}/products`),
  create: (supplierId: string, data: Partial<SupplierProduct>): Promise<SupplierProduct> =>
    request<SupplierProduct>(`/suppliers/${encodeURIComponent(supplierId)}/products`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (supplierId: string, productId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(supplierId)}/products/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
};

export const supplierDocumentsApi = {
  list: (supplierId: string): Promise<SupplierDocument[]> =>
    request<SupplierDocument[]>(`/suppliers/${encodeURIComponent(supplierId)}/documents`),
  create: (supplierId: string, data: Partial<SupplierDocument>): Promise<SupplierDocument> =>
    request<SupplierDocument>(`/suppliers/${encodeURIComponent(supplierId)}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  update: (supplierId: string, docId: string, data: Partial<SupplierDocument>): Promise<SupplierDocument> =>
    request<SupplierDocument>(`/suppliers/${encodeURIComponent(supplierId)}/documents/${encodeURIComponent(docId)}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (supplierId: string, docId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(supplierId)}/documents/${encodeURIComponent(docId)}`, { method: 'DELETE' }),
};

// ─── Projects ────────────────────────────────────

export const projectsApi = {
  list: (): Promise<Project[]> => request<Project[]>('/projects'),

  get: (id: string): Promise<Project> => request<Project>(`/projects/${encodeURIComponent(id)}`),

  create: (data: Partial<Project>): Promise<Project> =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Project>): Promise<Project> =>
    request<Project>(`/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// ─── Dashboard ───────────────────────────────────

export interface DashboardStats {
  suppliers: { total: number; verified: number; pending: number; unverified: number };
  projects: { total: number; leads: number; building: number; quotesSent: number; approved: number; pricing: number; inProgress: number };
  revenue: { total: number; avgMargin: number };
}

export const dashboardApi = {
  stats: (): Promise<DashboardStats> => request<DashboardStats>('/dashboard/stats'),
};

// ─── Quote Items ─────────────────────────────────

export interface QuoteItem {
  id: string;
  projectId: string;
  type: string;
  icon: string;
  name: string;
  supplier: string;
  description: string;
  cost: number;
  sellingPrice: number;
  profitWeight: number;
  status: string; // 'approved' | 'modified' | 'pending'
  alternatives?: { id: string; name: string; description: string; costPerPerson: number; selected: boolean }[];
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  time: string;
  title: string;
  description: string;
  icon: string;
}

export const quoteItemsApi = {
  list: (projectId: string): Promise<QuoteItem[]> =>
    request<QuoteItem[]>(`/projects/${encodeURIComponent(projectId)}/items`),

  create: (projectId: string, data: Partial<QuoteItem>): Promise<QuoteItem> =>
    request<QuoteItem>(`/projects/${encodeURIComponent(projectId)}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (projectId: string, itemId: string, data: Partial<QuoteItem>): Promise<QuoteItem> =>
    request<QuoteItem>(`/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (projectId: string, itemId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    }),
};

export const timelineApi = {
  list: (projectId: string): Promise<TimelineEvent[]> =>
    request<TimelineEvent[]>(`/projects/${encodeURIComponent(projectId)}/timeline`),

  create: (projectId: string, data: Partial<TimelineEvent>): Promise<TimelineEvent> =>
    request<TimelineEvent>(`/projects/${encodeURIComponent(projectId)}/timeline`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (projectId: string, eventId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(projectId)}/timeline/${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
    }),
};

export const publicApi = {
  quote: (id: string) => request<any>(`/public/quote/${encodeURIComponent(id)}`),
  approve: (id: string) => request<{ success: boolean }>(`/public/quote/${encodeURIComponent(id)}/approve`, { method: 'POST' }),
};

// ─── Seed ────────────────────────────────────────

let _seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!_seedPromise) {
    _seedPromise = request<any>('/seed', { method: 'POST' })
      .then((res) => {
        if (res?.skipped) {
          console.log('[TravelPro] Data already seeded');
        } else {
          console.log('[TravelPro] Initial data seeded:', res);
        }
      })
      .catch((err) => {
        console.error('[TravelPro] Seed failed:', err);
        _seedPromise = null; // Allow retry
      });
  }
  return _seedPromise;
}

// ─── Convenience grouped export ──────────────────

export const api = {
  suppliers: suppliersApi,
  projects: projectsApi,
  dashboard: dashboardApi,
  quoteItems: quoteItemsApi,
  timeline: timelineApi,
  public: publicApi,
  ensureSeeded,
};
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//Auth
export async function registerUser(email: string, username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) { 
    const errorData = await res.json();
    throw new Error(errorData.error || "Registration failed");
  }

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Login failed");
  }

  return res.json();
}

//Feed
export async function getFeeds() {
  const res = await fetch(`${API_URL}/feed`);
  if (!res.ok) throw new Error("Failed to fetch feeds");
  return res.json();
}

export async function parseFeed(url: string) {
  const res = await fetch(`${API_URL}/feed/parse?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to parse feed");
  return res.json();
}

export async function parseArticle(url: string) {
  const res = await fetch(`${API_URL}/feed/article?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to parse article");
  return res.json();
}

//Line items
export async function getLineItems() {
  const res = await fetch(`${API_URL}/line-item/all`);
  if (!res.ok) throw new Error("Failed to fetch line items");
  return res.json();
}

export async function createLineItem(data: any) {
  const res = await fetch(`${API_URL}/line-item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create line item");
  }

  return res.json();
}

export async function getLineItemForm() {
  const res = await fetch(`${API_URL}/line-item/form`);
  if (!res.ok) throw new Error("Failed to fetch form");
  return res.text();
}

//Bid Adapter
export async function sendBidRequest(
  size: string,
  geo: string,
  cpm: number
) {
  const res = await fetch(`${API_URL}/ad/bid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ size, geo, cpm }),
  });

  if (res.status === 204) {
    return null;
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Bid request failed");
  }

  return res.json();
}

export interface AdEvent {
  type: string;
  timestamp: string;
  adUnit?: string;
  creativeId?: string;
  cpm?: number;
  extra?: Record<string, any>;
}

export const sendAdEvents = async (events: AdEvent[]) => {
  const payload = JSON.stringify(events);
  try {
    await fetch('/api/statistics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
  } catch (e) {
    console.error(e);
  }
};

export const sendAdEventsBeacon = (events: AdEvent[]) => {
  if (navigator.sendBeacon) {
    const payload = JSON.stringify(events);
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon('/api/statistics/event', blob);
  }
};

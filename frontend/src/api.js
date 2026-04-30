const API_BASE = 'http://localhost:8081/api';

export async function fetchSubscriptions() {
  const res = await fetch(`${API_BASE}/subscriptions`);
  if (!res.ok) throw new Error('Failed to fetch subscriptions');
  return res.json();
}

export async function fetchSubscription(id) {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`);
  if (!res.ok) throw new Error('Subscription not found');
  return res.json();
}

export async function createSubscription(data) {
  const res = await fetch(`${API_BASE}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create subscription');
  return res.json();
}

export async function deleteSubscription(id) {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subscription');
}

export async function fetchAllHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchSubscriptionHistory(subId) {
  const res = await fetch(`${API_BASE}/history/subscription/${subId}`);
  if (!res.ok) throw new Error('Failed to fetch subscription history');
  return res.json();
}

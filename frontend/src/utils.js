// Predefined subscription service icons & colors
const SERVICE_CATALOG = {
  netflix:   { icon: '🎬', color: '#E50914', label: 'Netflix' },
  spotify:   { icon: '🎵', color: '#1DB954', label: 'Spotify' },
  youtube:   { icon: '▶️', color: '#FF0000', label: 'YouTube' },
  disney:    { icon: '🏰', color: '#113CCF', label: 'Disney+' },
  hbo:       { icon: '🎭', color: '#B834DB', label: 'HBO Max' },
  apple:     { icon: '🍎', color: '#A2AAAD', label: 'Apple' },
  amazon:    { icon: '📦', color: '#FF9900', label: 'Amazon' },
  aws:       { icon: '☁️', color: '#FF9900', label: 'AWS' },
  adobe:     { icon: '🎨', color: '#FF0000', label: 'Adobe' },
  figma:     { icon: '✏️', color: '#A259FF', label: 'Figma' },
  notion:    { icon: '📝', color: '#FFFFFF', label: 'Notion' },
  slack:     { icon: '💬', color: '#4A154B', label: 'Slack' },
  zoom:      { icon: '📹', color: '#2D8CFF', label: 'Zoom' },
  github:    { icon: '🐙', color: '#FFFFFF', label: 'GitHub' },
  openai:    { icon: '🤖', color: '#10A37F', label: 'OpenAI' },
  chatgpt:   { icon: '🤖', color: '#10A37F', label: 'ChatGPT' },
  google:    { icon: '🔍', color: '#4285F4', label: 'Google' },
  microsoft: { icon: '🪟', color: '#00A4EF', label: 'Microsoft' },
  dropbox:   { icon: '📁', color: '#0061FF', label: 'Dropbox' },
  icloud:    { icon: '☁️', color: '#3693F3', label: 'iCloud' },
  gym:       { icon: '💪', color: '#FF6B35', label: 'Gym' },
  insurance: { icon: '🛡️', color: '#2E86AB', label: 'Insurance' },
};

// Category definitions
export const CATEGORIES = [
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#E50914' },
  { id: 'productivity',  label: 'Productivity',  icon: '⚡', color: '#4F46E5' },
  { id: 'cloud',         label: 'Cloud & Dev',   icon: '☁️', color: '#FF9900' },
  { id: 'music',         label: 'Music',         icon: '🎵', color: '#1DB954' },
  { id: 'health',        label: 'Health',         icon: '💪', color: '#FF6B35' },
  { id: 'other',         label: 'Other',         icon: '📌', color: '#64748B' },
];

export function getServiceMeta(serviceName) {
  if (!serviceName) return { icon: '📦', color: '#6366f1' };
  const key = serviceName.toLowerCase();
  for (const [keyword, meta] of Object.entries(SERVICE_CATALOG)) {
    if (key.includes(keyword)) return meta;
  }
  // Generate a consistent color from the name
  let hash = 0;
  for (let i = 0; i < serviceName.length; i++) {
    hash = serviceName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { icon: serviceName.charAt(0).toUpperCase(), color: `hsl(${hue}, 60%, 55%)` };
}

export function guessCategory(serviceName) {
  if (!serviceName) return 'other';
  const key = serviceName.toLowerCase();
  if (['netflix', 'disney', 'hbo', 'youtube', 'hulu', 'prime video'].some(s => key.includes(s))) return 'entertainment';
  if (['spotify', 'apple music', 'tidal', 'deezer'].some(s => key.includes(s))) return 'music';
  if (['aws', 'github', 'vercel', 'railway', 'heroku', 'digital ocean', 'azure'].some(s => key.includes(s))) return 'cloud';
  if (['notion', 'figma', 'slack', 'zoom', 'adobe', 'microsoft', 'google', 'openai', 'chatgpt', 'dropbox'].some(s => key.includes(s))) return 'productivity';
  if (['gym', 'fitness', 'yoga', 'health', 'insurance'].some(s => key.includes(s))) return 'health';
  return 'other';
}

export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
}

export function daysUntil(dateStr) {
  if (!dateStr) return Infinity;
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });
}

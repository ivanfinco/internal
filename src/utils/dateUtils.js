/**
 * Utility functions for local date and time formatting across Ivan's Personal Dashboard.
 * Ensures consistent local timezone handling and dynamic "today" date calculation.
 */

export function getLocalDateStr(d = new Date()) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  const y = validDate.getFullYear();
  const m = String(validDate.getMonth() + 1).padStart(2, '0');
  const day = String(validDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getLocalTimestampStr(d = new Date()) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
  const datePart = getLocalDateStr(validDate);
  const hours = String(validDate.getHours()).padStart(2, '0');
  const minutes = String(validDate.getMinutes()).padStart(2, '0');
  return `${datePart} ${hours}:${minutes}`;
}

export function getDaysAgoDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

export function formatDateStr(d) {
  return getLocalDateStr(d);
}

/**
 * Automatically migrates legacy seed timestamps stored in browser's localStorage or Supabase
 * from fixed 2026-09-14/13/12/11 dates to dynamic current local date (today).
 * Leaves yesterday (September 14) and past days completely clean.
 */
export function migrateLegacySeedTimestamp(timestamp) {
  if (!timestamp || typeof timestamp !== 'string') return timestamp;

  const today = getLocalDateStr();

  if (
    timestamp.startsWith('2026-09-14') ||
    timestamp.startsWith('2026-09-13') ||
    timestamp.startsWith('2026-09-12') ||
    timestamp.startsWith('2026-09-11')
  ) {
    const timePart = timestamp.split(' ')[1] || '12:00';
    return `${today} ${timePart}`;
  }

  return timestamp;
}

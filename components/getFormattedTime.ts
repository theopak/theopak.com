'use client';

/**
 * returns the current datetime as a formatted string, RFC-3339 but with
 * 12-hour time and am/pm.
 */
export function getFormattedTime(d = new Date(), includeAll = true) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const hours = `${d.getHours() % 12}`.padStart(2, '0');
  const minutes = `${d.getMinutes()}`.padStart(2, '0');
  const seconds = `${d.getSeconds()}`.padStart(2, '0');
  const milliseconds = `${d.getMilliseconds()}`.padStart(3, '0');
  const ampm = d.getHours() < 12 ? 'am' : 'pm';
  return includeAll
    ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${ampm}`
    : `${year}-${month}-${day}`;
}

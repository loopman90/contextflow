export function pad(value: number): string { return String(value).padStart(2, "0"); }

export function formatDate(date: Date = new Date()): string {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export function formatTime(date: Date = new Date()): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDateTime(date: Date = new Date()): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

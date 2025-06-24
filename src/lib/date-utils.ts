/**
 * Date formatting utilities for consistent date/time display across the application
 */

/**
 * Formats a date to the standard application format: YYYY-MM-DD HH:MM:SS AM/PM
 * @param date - Date object, date string, or timestamp
 * @returns Formatted date string
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date);

  const dateString = dateObj
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");

  const timeString = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return `${dateString} ${timeString}`;
}

/**
 * Formats a date to just the date portion: MM/DD/YYYY
 * @param date - Date object, date string, or timestamp
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

/**
 * Formats a date to just the time portion: HH:MM:SS AM/PM
 * @param date - Date object, date string, or timestamp
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | number): string {
  const dateObj = new Date(date);

  return dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date for display in tables and lists
 * Currently uses the same format as formatDateTime but can be customized separately
 * @param date - Date object, date string, or timestamp
 * @returns Formatted date string for display
 */
export function formatDisplayDate(date: Date | string | number): string {
  return formatDateTime(date);
}

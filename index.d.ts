/**
 * Options for timeAgo function.
 */
export interface TimeAgoOptions {
  /**
   * Reference date to compare against.
   * Can be a Date instance, timestamp in milliseconds, or date string.
   * Defaults to `new Date()`.
   */
  now?: Date | number | string;
}

/**
 * Converts a date into a human-readable relative time string.
 *
 * @param date - The date to convert (Date instance, timestamp in milliseconds, or date string).
 * @param options - Optional configuration options, including a fixed `now` reference date.
 * @returns Human-readable relative time string (e.g. "just now", "5 minutes ago", "in 2 days").
 * @throws {TypeError} If `date` or `options.now` is invalid.
 */
export function timeAgo(
  date: Date | number | string,
  options?: TimeAgoOptions
): string;

export default timeAgo;

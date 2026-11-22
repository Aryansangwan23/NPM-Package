/**
 * Conversion constants in seconds.
 */
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE; // 3,600
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR; // 86,400
const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY; // 604,800
const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY; // 2,592,000 (30 days)
const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY; // 31,536,000 (365 days)

/**
 * Validates and normalizes input to a valid Date object.
 *
 * @param {unknown} value - Value to convert.
 * @param {string} paramName - Name of the parameter for error reporting.
 * @returns {Date} Normalized valid Date instance.
 * @throws {TypeError} When value cannot be converted to a valid Date.
 */
function toDate(value, paramName = 'date') {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError(`Invalid ${paramName}: Date object is invalid`);
    }
    return value;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Invalid ${paramName}: timestamp must be a finite number`);
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      throw new TypeError(`Invalid ${paramName}: timestamp could not be converted to a valid Date`);
    }
    return d;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new TypeError(`Invalid ${paramName}: date string cannot be empty`);
    }
    const d = new Date(trimmed);
    if (Number.isNaN(d.getTime())) {
      throw new TypeError(`Invalid ${paramName}: "${value}" is not a valid date string`);
    }
    return d;
  }

  const receivedType = value === null ? 'null' : typeof value;
  throw new TypeError(
    `Invalid ${paramName}: expected a Date, timestamp number, or date string, received ${receivedType}`
  );
}

/**
 * Calculates the appropriate unit and count for a given duration in seconds.
 *
 * @param {number} diffSec - Absolute duration in seconds.
 * @returns {{ count: number, unit: string }} Unit name and corresponding count.
 */
function getUnitAndCount(diffSec) {
  if (diffSec < SECONDS_IN_MINUTE) {
    return { count: diffSec, unit: 'second' };
  }
  if (diffSec < SECONDS_IN_HOUR) {
    return { count: Math.floor(diffSec / SECONDS_IN_MINUTE), unit: 'minute' };
  }
  if (diffSec < SECONDS_IN_DAY) {
    return { count: Math.floor(diffSec / SECONDS_IN_HOUR), unit: 'hour' };
  }
  if (diffSec < SECONDS_IN_WEEK) {
    return { count: Math.floor(diffSec / SECONDS_IN_DAY), unit: 'day' };
  }
  if (diffSec < SECONDS_IN_MONTH) {
    return { count: Math.floor(diffSec / SECONDS_IN_WEEK), unit: 'week' };
  }
  if (diffSec < SECONDS_IN_YEAR) {
    const months = Math.floor(diffSec / SECONDS_IN_MONTH);
    if (months < 12) {
      return { count: months, unit: 'month' };
    }
    return { count: 1, unit: 'year' };
  }
  return { count: Math.floor(diffSec / SECONDS_IN_YEAR), unit: 'year' };
}

/**
 * Converts a date into a human-readable relative time string.
 *
 * @param {Date | number | string} date - Date object, timestamp in milliseconds, or date string.
 * @param {object} [options] - Configuration options.
 * @param {Date | number | string} [options.now] - Fixed reference date (defaults to current time).
 * @returns {string} Human-readable relative time string.
 * @throws {TypeError} When date or options.now is invalid.
 */
function timeAgo(date, options = {}) {
  const targetDate = toDate(date, 'date');

  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Options must be an object');
  }

  const nowDate = options.now !== undefined
    ? toDate(options.now, 'options.now')
    : new Date();

  const diffMs = nowDate.getTime() - targetDate.getTime();
  const isFuture = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);
  const diffSec = Math.floor(absDiffMs / 1000);

  // Past dates under 10 seconds
  if (!isFuture && diffSec < 10) {
    return 'just now';
  }

  // Future dates under 1 second (e.g. sub-second diff)
  if (isFuture && diffSec === 0) {
    return 'just now';
  }

  const { count, unit } = getUnitAndCount(diffSec);
  const pluralUnit = count === 1 ? unit : `${unit}s`;

  if (isFuture) {
    return `in ${count} ${pluralUnit}`;
  }

  return `${count} ${pluralUnit} ago`;
}
module.exports = timeAgo;
module.exports.timeAgo = timeAgo;
module.exports.default = timeAgo;

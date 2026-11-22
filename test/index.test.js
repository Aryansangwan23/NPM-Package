import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { timeAgo, default as defaultExport } from '../src/index.js';

const require = createRequire(import.meta.url);
const cjsTimeAgo = require('../dist/index.cjs');

describe('timeAgo module exports', () => {
  it('supports ESM named and default exports', () => {
    assert.equal(typeof timeAgo, 'function');
    assert.equal(typeof defaultExport, 'function');
    assert.equal(timeAgo, defaultExport);
  });

  it('supports CommonJS function and named exports', () => {
    assert.equal(typeof cjsTimeAgo, 'function');
    assert.equal(typeof cjsTimeAgo.timeAgo, 'function');
    assert.equal(typeof cjsTimeAgo.default, 'function');
  });
});

describe('timeAgo date input formats', () => {
  const baseTime = new Date('2026-05-15T12:00:00.000Z');

  it('handles Date instance', () => {
    const past = new Date(baseTime.getTime() - 5 * 60 * 1000);
    assert.equal(timeAgo(past, { now: baseTime }), '5 minutes ago');
  });

  it('handles numerical timestamp', () => {
    const pastTimestamp = baseTime.getTime() - 2 * 3600 * 1000;
    assert.equal(timeAgo(pastTimestamp, { now: baseTime }), '2 hours ago');
  });

  it('handles ISO date string', () => {
    const pastIso = '2026-05-15T10:00:00.000Z';
    assert.equal(timeAgo(pastIso, { now: baseTime }), '2 hours ago');
  });
});

describe('timeAgo past dates thresholds & units', () => {
  const baseTime = new Date('2026-05-15T12:00:00.000Z');
  const nowMs = baseTime.getTime();

  it('returns "just now" for dates within 10 seconds in the past', () => {
    assert.equal(timeAgo(new Date(nowMs), { now: baseTime }), 'just now');
    assert.equal(timeAgo(new Date(nowMs - 3 * 1000), { now: baseTime }), 'just now');
    assert.equal(timeAgo(new Date(nowMs - 9 * 1000), { now: baseTime }), 'just now');
  });

  it('formats seconds (10 to 59 seconds ago)', () => {
    assert.equal(timeAgo(new Date(nowMs - 10 * 1000), { now: baseTime }), '10 seconds ago');
    assert.equal(timeAgo(new Date(nowMs - 45 * 1000), { now: baseTime }), '45 seconds ago');
    assert.equal(timeAgo(new Date(nowMs - 59 * 1000), { now: baseTime }), '59 seconds ago');
  });

  it('formats minutes (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs - 60 * 1000), { now: baseTime }), '1 minute ago');
    assert.equal(timeAgo(new Date(nowMs - 5 * 60 * 1000), { now: baseTime }), '5 minutes ago');
  });

  it('formats hours (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs - 3600 * 1000), { now: baseTime }), '1 hour ago');
    assert.equal(timeAgo(new Date(nowMs - 3 * 3600 * 1000), { now: baseTime }), '3 hours ago');
  });

  it('formats days (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs - 24 * 3600 * 1000), { now: baseTime }), '1 day ago');
    assert.equal(timeAgo(new Date(nowMs - 2 * 24 * 3600 * 1000), { now: baseTime }), '2 days ago');
  });

  it('formats weeks (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs - 7 * 24 * 3600 * 1000), { now: baseTime }), '1 week ago');
    assert.equal(timeAgo(new Date(nowMs - 14 * 24 * 3600 * 1000), { now: baseTime }), '2 weeks ago');
  });

  it('formats months (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs - 30 * 24 * 3600 * 1000), { now: baseTime }), '1 month ago');
    assert.equal(timeAgo(new Date(nowMs - 120 * 24 * 3600 * 1000), { now: baseTime }), '4 months ago');
  });

  it('formats years (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs - 365 * 24 * 3600 * 1000), { now: baseTime }), '1 year ago');
    assert.equal(timeAgo(new Date(nowMs - 730 * 24 * 3600 * 1000), { now: baseTime }), '2 years ago');
  });
});

describe('timeAgo future dates thresholds & units', () => {
  const baseTime = new Date('2026-05-15T12:00:00.000Z');
  const nowMs = baseTime.getTime();

  it('returns "just now" for sub-second future difference', () => {
    assert.equal(timeAgo(new Date(nowMs + 400), { now: baseTime }), 'just now');
  });

  it('formats future seconds (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 1000), { now: baseTime }), 'in 1 second');
    assert.equal(timeAgo(new Date(nowMs + 15 * 1000), { now: baseTime }), 'in 15 seconds');
  });

  it('formats future minutes (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 60 * 1000), { now: baseTime }), 'in 1 minute');
    assert.equal(timeAgo(new Date(nowMs + 5 * 60 * 1000), { now: baseTime }), 'in 5 minutes');
  });

  it('formats future hours (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 3600 * 1000), { now: baseTime }), 'in 1 hour');
    assert.equal(timeAgo(new Date(nowMs + 3 * 3600 * 1000), { now: baseTime }), 'in 3 hours');
  });

  it('formats future days (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 24 * 3600 * 1000), { now: baseTime }), 'in 1 day');
    assert.equal(timeAgo(new Date(nowMs + 2 * 24 * 3600 * 1000), { now: baseTime }), 'in 2 days');
  });

  it('formats future weeks (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 7 * 24 * 3600 * 1000), { now: baseTime }), 'in 1 week');
    assert.equal(timeAgo(new Date(nowMs + 2 * 7 * 24 * 3600 * 1000), { now: baseTime }), 'in 2 weeks');
  });

  it('formats future months (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 30 * 24 * 3600 * 1000), { now: baseTime }), 'in 1 month');
    assert.equal(timeAgo(new Date(nowMs + 120 * 24 * 3600 * 1000), { now: baseTime }), 'in 4 months');
  });

  it('formats future years (singular and plural)', () => {
    assert.equal(timeAgo(new Date(nowMs + 365 * 24 * 3600 * 1000), { now: baseTime }), 'in 1 year');
    assert.equal(timeAgo(new Date(nowMs + 730 * 24 * 3600 * 1000), { now: baseTime }), 'in 2 years');
  });
});

describe('options and now handling', () => {
  it('defaults now to the current time when omitted', () => {
    const recent = new Date(Date.now() - 2000);
    assert.equal(timeAgo(recent), 'just now');
  });

  it('accepts now as a timestamp or string', () => {
    const nowStr = '2026-05-15T12:00:00.000Z';
    const pastStr = '2026-05-15T11:55:00.000Z';
    assert.equal(timeAgo(pastStr, { now: nowStr }), '5 minutes ago');
  });
});

describe('error handling and validation', () => {
  it('throws TypeError for missing or null input', () => {
    assert.throws(() => timeAgo(), TypeError);
    assert.throws(() => timeAgo(null), TypeError);
    assert.throws(() => timeAgo(undefined), TypeError);
  });

  it('throws TypeError for invalid strings and objects', () => {
    assert.throws(() => timeAgo('not-a-valid-date'), TypeError);
    assert.throws(() => timeAgo(''), TypeError);
    assert.throws(() => timeAgo({}), TypeError);
    assert.throws(() => timeAgo([]), TypeError);
    assert.throws(() => timeAgo(true), TypeError);
  });

  it('throws TypeError for invalid numbers and Date instances', () => {
    assert.throws(() => timeAgo(NaN), TypeError);
    assert.throws(() => timeAgo(Infinity), TypeError);
    assert.throws(() => timeAgo(new Date('invalid')), TypeError);
  });

  it('throws TypeError for invalid options or options.now', () => {
    assert.throws(() => timeAgo(new Date(), 'invalid-options'), TypeError);
    assert.throws(() => timeAgo(new Date(), { now: 'invalid-date' }), TypeError);
  });
});

describe('CommonJS build functionality', () => {
  it('produces identical results with require()', () => {
    const fixedNow = new Date('2026-05-15T12:00:00.000Z');
    const past = new Date(fixedNow.getTime() - 10 * 60 * 1000);
    assert.equal(cjsTimeAgo(past, { now: fixedNow }), '10 minutes ago');
    assert.equal(cjsTimeAgo.timeAgo(past, { now: fixedNow }), '10 minutes ago');
  });
});

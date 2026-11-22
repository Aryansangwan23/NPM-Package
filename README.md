# time-ago-lite

A lightweight, zero-dependency utility that converts dates into clean, human-readable relative time strings (e.g. "just now", "5 minutes ago", "in 2 days").

## Features

- **Zero dependencies**: Pure JavaScript using standard built-in APIs.
- **Dual module support**: First-class support for both ECMAScript modules (`import`) and CommonJS (`require`).
- **Full TypeScript support**: Ships with complete type definitions (`index.d.ts`).
- **Flexible inputs**: Accepts `Date` instances, millisecond timestamps, and ISO date strings.
- **Bi-directional**: Formats past dates ("45 seconds ago") and future dates ("in 3 hours").
- **Custom reference time**: Inject a fixed `now` date for deterministic output and easy testing.

## Installation

```bash
npm install time-ago-lite
```

## Usage

### ES Modules (import)

```javascript
import { timeAgo } from 'time-ago-lite';

// Recent events
timeAgo(new Date(Date.now() - 3000)); // "just now"
timeAgo(new Date(Date.now() - 45 * 1000)); // "45 seconds ago"

// Past dates
timeAgo(new Date(Date.now() - 5 * 60 * 1000)); // "5 minutes ago"
timeAgo(new Date(Date.now() - 3 * 3600 * 1000)); // "3 hours ago"
timeAgo(new Date(Date.now() - 2 * 24 * 3600 * 1000)); // "2 days ago"
timeAgo(new Date(Date.now() - 14 * 24 * 3600 * 1000)); // "2 weeks ago"
timeAgo(new Date(Date.now() - 120 * 24 * 3600 * 1000)); // "4 months ago"
timeAgo(new Date(Date.now() - 365 * 24 * 3600 * 1000)); // "1 year ago"

// Future dates
timeAgo(new Date(Date.now() + 5 * 60 * 1000)); // "in 5 minutes"
timeAgo(new Date(Date.now() + 2 * 24 * 3600 * 1000)); // "in 2 days"

// Flexible input formats
timeAgo(1767268800000); // Numerical timestamp
timeAgo('2026-05-15T12:00:00.000Z'); // ISO date string
```

### CommonJS (require)

Both default and named destructuring are supported:

```javascript
const { timeAgo } = require('time-ago-lite');
// or: const timeAgo = require('time-ago-lite');

console.log(timeAgo(Date.now() - 10000)); // "10 seconds ago"
```

### Testing with a Fixed `now`

Pass the `now` option to compare against a predetermined anchor date:

```javascript
const fixedNow = new Date('2026-01-01T12:00:00.000Z');
const pastDate = new Date('2026-01-01T11:45:00.000Z');

timeAgo(pastDate, { now: fixedNow }); // "15 minutes ago"
```

## API

### `timeAgo(date, options?)`

Formats `date` relative to current time or `options.now`.

#### Parameters

- **`date`** (`Date | number | string`, required):
  The target date to evaluate. Can be a JavaScript `Date` instance, Unix timestamp in milliseconds, or parseable date string.
- **`options`** (`object`, optional):
  - **`options.now`** (`Date | number | string`, optional): Reference anchor date. Defaults to `new Date()`.

#### Return value

Returns a `string` representing human-readable relative time:
- Past dates under 10 seconds: `"just now"`
- Past dates under 1 minute: `"<n> seconds ago"`
- Minutes: `"<n> minute(s) ago"`
- Hours: `"<n> hour(s) ago"`
- Days: `"<n> day(s) ago"`
- Weeks: `"<n> week(s) ago"`
- Months: `"<n> month(s) ago"`
- Years: `"<n> year(s) ago"`
- Future dates: `"in <n> <unit>(s)"`

#### Errors

Throws a descriptive `TypeError` if `date` or `options.now` cannot be converted to a valid `Date`.

## License

[MIT](LICENSE)

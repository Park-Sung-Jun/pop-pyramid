const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const baseRule = html.indexOf('.mobile-toggle{display:none');
const mobileBreakpoint = html.indexOf('@media(max-width:768px)');
const mobileRule = html.indexOf('.mobile-toggle{display:flex}', mobileBreakpoint);

assert.notEqual(baseRule, -1, 'mobile toggle base rule is missing');
assert.notEqual(mobileBreakpoint, -1, 'mobile breakpoint is missing');
assert.notEqual(mobileRule, -1, 'mobile display rule is missing');
assert.ok(
  baseRule < mobileBreakpoint && mobileBreakpoint < mobileRule,
  'base display:none must precede the mobile display:flex override',
);

console.log('PASS mobile toggle CSS cascade');

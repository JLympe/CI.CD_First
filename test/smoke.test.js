const test = require("node:test");
const assert = require("node:assert/strict");

const { buildGreeting } = require("../src/index");

test("buildGreeting returns a stable message", () => {
  assert.equal(buildGreeting("CI/CD"), "Hello, CI/CD!");
});

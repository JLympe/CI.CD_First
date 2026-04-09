function buildGreeting(name = "world") {
  return `Hello, ${name}!`;
}

module.exports = {
  buildGreeting
};

if (require.main === module) {
  process.stdout.write(`${buildGreeting()}\n`);
}

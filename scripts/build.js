const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
const distDir = path.join(projectRoot, "dist");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

const sourceFile = path.join(srcDir, "index.js");
const outputFile = path.join(distDir, "index.js");

fs.copyFileSync(sourceFile, outputFile);

const buildInfo = {
  generatedAt: new Date().toISOString(),
  files: ["index.js"]
};

fs.writeFileSync(
  path.join(distDir, "build-info.json"),
  `${JSON.stringify(buildInfo, null, 2)}\n`,
  "utf8"
);

process.stdout.write("Build completed successfully.\n");

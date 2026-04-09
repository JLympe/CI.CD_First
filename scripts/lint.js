const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const includeDirectories = ["src", "scripts", "test"];
const fileExtensions = new Set([".js", ".cjs", ".mjs"]);
const findings = [];

function collectFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(entryPath));
      continue;
    }

    if (fileExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function addFinding(filePath, message) {
  findings.push(`${path.relative(projectRoot, filePath)}: ${message}`);
}

for (const directoryName of includeDirectories) {
  const directoryPath = path.join(projectRoot, directoryName);

  for (const filePath of collectFiles(directoryPath)) {
    const contents = fs.readFileSync(filePath, "utf8");
    const lines = contents.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (/\t/.test(line)) {
        addFinding(filePath, `line ${lineNumber} contains a tab character`);
      }

      if (/\s+$/.test(line)) {
        addFinding(filePath, `line ${lineNumber} has trailing whitespace`);
      }

      if (/\bvar\s+[A-Za-z_$]/.test(line)) {
        addFinding(filePath, `line ${lineNumber} uses 'var' instead of 'const' or 'let'`);
      }
    });

    if (contents.length > 0 && !contents.endsWith("\n")) {
      addFinding(filePath, "file must end with a newline");
    }

    const syntaxCheck = spawnSync(process.execPath, ["--check", filePath], {
      encoding: "utf8"
    });

    if (syntaxCheck.status !== 0) {
      addFinding(
        filePath,
        `syntax check failed: ${(syntaxCheck.stderr || syntaxCheck.stdout).trim()}`
      );
    }
  }
}

if (findings.length > 0) {
  process.stderr.write("Lint failed with the following findings:\n");
  process.stderr.write(`${findings.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Lint passed.\n");

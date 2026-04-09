# CI.CD_First

Minimal Node.js example project with a pull request CI/CD pipeline.

## Status badge

Replace `YOUR_USERNAME` and `YOUR_REPO` after you connect this folder to GitHub:

```md
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml/badge.svg?branch=main&event=pull_request)
```

## Available scripts

- `npm run lint`: runs the repository lint checks.
- `npm test`: runs the smoke test suite with the built-in Node test runner.
- `npm run build`: generates the `dist/` folder used by the artifact and prerelease jobs.

## Workflow summary

The GitHub Actions workflow at `.github/workflows/ci-cd.yml` runs:

- `lint`, `security-scan`, and `test` in parallel for fast pull request feedback.
- `build` only after all quality gates succeed.
- `release` after `build`, downloading the `dist` artifact and publishing a prerelease with `gh`.

The prerelease job is skipped automatically for pull requests coming from forks.

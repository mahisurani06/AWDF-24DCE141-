# AWDF-24DCE141

[![CI Pipeline](https://github.com/mahisurani06/AWDF-24DCE141-/actions/workflows/ci.yml/badge.svg)](https://github.com/mahisurani06/AWDF-24DCE141-/actions/workflows/ci.yml)

## Practical 12: CI/CD Pipeline with GitHub Actions

### Aim
To implement a CI pipeline that automatically runs ESLint and automated tests for the Task Management application.

### Workflow features
- Runs only when a pull request targets the `main` branch.
- Installs Node.js dependencies using `npm ci`.
- Runs ESLint as a separate job.
- Runs automated Jest tests only after linting succeeds.
- Displays the workflow status using a GitHub Actions badge.

### Technologies used
- GitHub Actions
- Node.js and npm
- ESLint
- Jest

### Result
The ESLint command completed with zero errors and two warnings. The Jest test suite passed successfully on the local machine. The GitHub Actions workflow will be verified through a pull request targeting `main`.
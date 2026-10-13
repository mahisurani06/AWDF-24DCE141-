# AWDF-24DCE141

[![CI Pipeline](https://github.com/mahisurani06/AWDF-24DCE141-/actions/workflows/ci.yml/badge.svg)](https://github.com/mahisurani06/AWDF-24DCE141-/actions/workflows/ci.yml)

## Practical 12: CI/CD Pipeline with GitHub Actions

This practical demonstrates continuous integration using GitHub Actions for the Task Management application in Practical-5.

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

### Test results
- ESLint completed locally with zero errors and two warnings.
- Jest tests passed successfully on the local machine.
- An earlier GitHub Actions workflow run completed successfully.
- The updated workflow will be verified through this pull request.

### Result
The CI pipeline has been configured to lint the code and run automated tests for the Task Management application.
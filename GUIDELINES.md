# Repository Contribution Guidelines

## Purpose

This document defines the rules and workflow that every contributor must follow while working on this repository. The goal is to maintain code quality, prevent conflicts, keep documentation updated, and ensure smooth collaboration across the team.

---

# Before You Start

## Read Documentation First

Before making any changes, always read the relevant documentation files.

Examples:

* `FRONTEND.md`
* `BACKEND.md`
* Architecture documents
* Project specifications
* Feature documentation

Never start implementing a feature without understanding the existing project context.

---

# Repository Access Rules

* Everyone should have repository access.
* Frontend team members should only make frontend-related changes unless explicitly discussed with the team.
* Do not modify unrelated modules or features.
* Be extremely careful while making changes outside your assigned scope.

---

# Branching Rules

After cloning the repository, you will be on the `main` branch by default.

Verify your current branch:

```bash
git branch
```

### Recommended Workflow

Create your own feature branch before starting work:

```bash
git checkout -b <your-branch-name>
```

Example:

```bash
git checkout -b aradhya/login-page
```

---

# Always Pull Before Starting Work

Before beginning development or pushing changes:

```bash
git pull origin main
```

This ensures you are working on the latest version of the repository and helps avoid merge conflicts.

---

# Environment Variables

## Never Commit `.env` Files

Under no circumstances should `.env` files be committed.

Never expose:

* API Keys
* Access Tokens
* Database URLs
* Secrets
* Authentication Credentials
* Third-Party Service Keys

Ensure `.env` remains inside `.gitignore`.

---

# Authentication & Infrastructure Changes

Any modifications related to:

* Authentication
* Authorization
* Environment Variables
* Database Connections
* Secrets Management
* Deployment Configuration
* Infrastructure

must be discussed with the team before implementation.

Do not make such changes independently.

---

# Dependency Management

## When `package.json` or `package-lock.json` Changes

If you pull the latest changes and notice that either:

* `package.json`
* `package-lock.json`

has been modified, you must run:

```bash
npm install
```

This ensures your local dependencies are synchronized with the repository.

---

## After Pulling Latest Changes

Recommended workflow:

```bash
git pull origin main
npm install
```

Run `npm install` whenever dependency-related files have been updated by another team member.

---

## Clean Installation (Only When Required)

Do **not** delete `node_modules` unnecessarily.

Perform a clean install only if:

* Dependencies are failing to install correctly
* You encounter package version conflicts
* The application behaves unexpectedly after installing dependencies
* Build errors persist despite running `npm install`

In such cases:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Team Rule

If your changes introduce, remove, or update dependencies:

* Commit the updated `package.json`
* Commit the updated `package-lock.json`
* Mention the dependency change in your Pull Request description
* Inform the team if additional setup steps are required

---

# AI Tool Usage Guidelines

These rules apply to:

* Claude
* GitHub Copilot
* Cursor
* ChatGPT
* Gemini
* Any other AI-assisted coding tool

---

## Always Provide Full Context

Never ask an AI tool to generate code without project context.

Before generating code, provide:

* Project purpose
* Tech stack
* Folder structure
* Existing architecture
* Design system
* Coding conventions
* Authentication flow
* State management approach
* Relevant documentation

The AI should understand the project before generating code.

---

## Always Include Repository Context

Whenever you use an AI coding assistant:

1. Explain what the project does.
2. Explain the feature being built.
3. Share the relevant documentation.
4. Share the relevant files and surrounding code.
5. Explain any existing patterns that must be followed.
6. Mention the libraries and frameworks already being used.

Never generate code in isolation.

---

## FRONTEND.md Is The Source Of Truth

Whenever making frontend changes:

1. Read `FRONTEND.md` before starting.
2. Follow all conventions defined in it.
3. Ensure generated code follows the documented standards.
4. Do not introduce new patterns without discussion.

---

## Keep Documentation Updated

If your changes affect:

* Component patterns
* Folder structure
* Design system
* UI conventions
* API integration patterns
* State management patterns
* Development workflow
* Frontend architecture

Then update the relevant documentation before creating a Pull Request.

If a frontend-related convention changes, `FRONTEND.md` must be updated accordingly.

Documentation should always reflect the current implementation.

---

## Review AI Generated Code

Never blindly accept AI-generated code.

Verify:

* Code quality
* Type safety
* Security
* Error handling
* Performance
* Accessibility
* Project conventions

Every developer is responsible for the code they merge.

---

# Commit Message Convention

Use meaningful commit messages.

### Features

```bash
git commit -m "feat: add login page"
```

### Bug Fixes

```bash
git commit -m "fix: resolve navbar alignment issue"
```

### Refactoring

```bash
git commit -m "refactor: optimize dashboard component"
```

### Documentation

```bash
git commit -m "docs: update frontend guidelines"
```

Avoid:

```bash
git commit -m "update"
git commit -m "changes"
git commit -m "final"
```

---

# Basic Git Commands

## Clone Repository

```bash
git clone <repository-url>
```

## Check Current Branch

```bash
git branch
```

## Check Status

```bash
git status
```

## Pull Latest Changes

```bash
git pull origin main
```

## Stage Changes

```bash
git add .
```

or

```bash
git add <file-name>
```

## Commit Changes

```bash
git commit -m "feat: add authentication UI"
```

## Push Changes To Main

```bash
git push -u origin main
```

---

# Working With Feature Branches

## Create Branch

```bash
git checkout -b <your-branch-name>
```

## Verify Branch

```bash
git branch
```

## Stage Changes

```bash
git add .
```

## Commit Changes

```bash
git commit -m "feat: implement login page"
```

## Push Branch

```bash
git push -u origin <your-branch-name>
```

Example:

```bash
git push -u origin aradhya/login-page
```

---

# Pull Request Workflow

1. Create a feature branch.
2. Complete development.
3. Pull latest changes from `main`.
4. Resolve conflicts if any.
5. Push your branch.
6. Create a Pull Request.
7. Get the changes reviewed.
8. Merge only after approval.

---

# Before Every Push Checklist

* [ ] Read the relevant documentation (`FRONTEND.md`, etc.)
* [ ] Pulled latest changes from `main`
* [ ] Ran `npm install` if `package.json` or `package-lock.json` changed
* [ ] No `.env` files committed
* [ ] Changes are within assigned scope
* [ ] Proper commit message used
* [ ] Code tested locally
* [ ] Documentation updated if required
* [ ] AI-generated code reviewed
* [ ] No unnecessary files committed
* [ ] Branch name is meaningful
* [ ] Ready for review

---

# Golden Rules

1. Read documentation before coding.
2. Always pull latest changes before pushing.
3. Never commit `.env` files.
4. Discuss authentication, infrastructure, and environment-related changes before implementation.
5. Always provide complete repository context to Claude, Copilot, Cursor, ChatGPT, or any AI tool.
6. Follow `FRONTEND.md` and all project documentation.
7. Update documentation whenever implementation changes.
8. If frontend conventions change, update `FRONTEND.md`.
9. Use meaningful commit messages.
10. Review all AI-generated code before merging.
11. Run `npm install` whenever dependency files change.
12. Ask the team before making major architectural decisions.
13. Never push code that you do not fully understand.
14. Documentation is part of the codebase—keep it updated.

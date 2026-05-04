---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
argument-hint: [message]
description: Create well-formatted commits with conventional commit format
color: purple
---

# Smart Git Commit

Create well-formatted commit

## Current Repository State

Remember that you are located in the root of a folder:

- bitify

run the following commands:

- Git status: !git status --porcelain
- Current branch: !git branch --show-current
- Staged changes: !git --no-pager diff --cached --stat
- Unstaged changes: !git --no-pager diff --stat
- Recent commits: !git --no-pager log --oneline -5

## What This Command Does

1. Always automatically runs pre-commit checks:
   - npm lint to ensure code quality
   - npm build to verify the build succeeds
2. Checks which files are staged with git status
3. If 0 files are staged, automatically adds all modified and new files with git add
4. Performs a git diff (using `git --no-pager diff`) to understand what changes are being committed
5. Analyzes the diff to determine if multiple distinct logical changes are present
6. If multiple distinct changes are detected, suggests breaking the commit into multiple smaller commits
7. For each commit (or the single commit if not split), creates a commit message using conventional commit format

## Multi-Repo Commit Flow

This command commits changes across both repositories in this workspace and arranges commits logically rather than putting everything into a single commit.

1. Repositories processed sequentially (same rules for each):
   - `bitify`
2. For each repository:
   - Verify you are not on a protected branch (e.g., `main`, `develop`). If you are, stop and ask to switch branches.
   - Run pre-commit checks first to avoid fixup commits later:
     - `npm run lint --if-present`
     - `npm run build --if-present`
   - Inspect staged vs unstaged changes. If nothing is staged, automatically stage all modified and new files.
   - Analyze the diff and split changes into multiple logical commits (not 1-file-per-commit, but coherent groups), for example:
     - Tooling/docs/config updates separate from source changes
     - Refactors separate from fixes/features
     - Group by domain/module for larger surfaces
   - Create commits in a sensible order (e.g., tooling → types → refactors → fixes → features → docs), each with:
     - Conventional commit message, short and imperative
     - Signed off using `-s`
3. Repeat step 2 for the other repository.
4. Output a concise per-repo summary of commits created.

Notes:

- Linting happens before committing to minimize follow-up commits for the same files.
- Keep commit subjects concise (≤ 72 characters).
- Safeguards and conventions in Important Notes apply to both repositories.

## Best Practices for Commits

- **Verify before committing**: Ensure code is linted, builds correctly, and documentation is updated
- **Atomic commits**: Each commit should contain related changes that serve a single purpose
- **Split large changes**: If changes touch multiple concerns, split them into separate commits
- **Conventional commit format**: Use the format <type>: <description> where type is one of:
  - feat: A new feature
  - fix: A bug fix
  - docs: Documentation changes
  - style: Code style changes (formatting, etc)
  - refactor: Code changes that neither fix bugs nor add features
  - perf: Performance improvements
  - test: Adding or fixing tests
  - chore: Changes to the build process, tools, etc.
- **Present tense, imperative mood**: Write commit messages as commands (e.g., "add feature" not "added feature")
- **Concise first line**: Keep the first line under 72 characters

## Guidelines for Splitting Commits

When analyzing the diff, consider splitting commits based on these criteria:

1. **Different concerns**: Changes to unrelated parts of the codebase
2. **Different types of changes**: Mixing features, fixes, refactoring, etc.
3. **File patterns**: Changes to different types of files (e.g., source code vs documentation)
4. **Logical grouping**: Changes that would be easier to understand or review separately
5. **Size**: Very large changes that would be clearer if broken down

## Examples

Good commit messages:

- feat: add user authentication system
- fix: resolve memory leak in rendering process
- docs: update API documentation with new endpoints
- refactor: simplify error handling logic in parser
- style: improve button spacing and typography
- perf: speed up list rendering by memoizing items
- test: add unit tests for date utils
- chore: update lint config and scripts

## Important Notes

- By default, pre-commit checks (npm lint, npm build) will run to ensure code quality
- If these checks fail, you'll be asked if you want to proceed with the commit anyway or fix the issues first
- If specific files are already staged, the command will only commit those files
- If no files are staged, it will automatically stage all modified and new files
- The commit message will be constructed based on the changes detected
- Before committing, the command will review the commit diff (using `git --no-pager diff`) to identify if multiple commits would be more appropriate
- If suggesting multiple commits, it will help you stage and commit the changes separately
- Always reviews the commit diff to ensure the message matches the changes
- All commits should be signed off using the -s flag
- Never commit to main, develop branches directly. In that case, stop and ask the user to switch to the correct branch
- Do not add cursor as co-author
- Never commit or push using no-verify flag
- Is not necessary to be 1 commit 1 file, try to make atomic commits when possible and arrange the commits in the correct order

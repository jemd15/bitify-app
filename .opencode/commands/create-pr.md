---
description: Create or update PR with auto-generated description
argument-hint: <target-branch>
allowed-tools: SlashCommand(/commit:*), Bash(git*), mcp__github__*
color: purple
---

# Create or Update Pull Request

Create or update a pull request from the current branch to `$1` with an auto-generated description following the project's PR template.

## Workflow

1. **Commit pending changes**: Execute `/commit` to commit any uncommitted changes. If there are no changes, continue to the next step.

2. **Get repository information**:
   - Get current branch name: `git branch --show-current`
   - Get repository owner and name from remote URL: `git remote get-url origin`
   - Parse owner/repo from the remote URL (handle both HTTPS and SSH formats)

3. **Push changes to remote**:
   - Push current branch with: `git push -u origin HEAD`
   - If push fails, report the error and stop

4. **Check for existing PR**:
   - Use `mcp__github__list_pull_requests` to check if a PR already exists from current branch to target branch `$1`
   - Look for open PRs where `head` matches current branch and `base` matches `$1`

5. **Analyze changes for PR description**:
   - Get commit history since divergence: `git --no-pager log $1..HEAD --oneline`
   - Get full diff: `git --no-pager diff $1...HEAD`
   - Review the changed files focusing on:
     - New modules or components added
     - Navigation changes (coordinators, routes)
     - State management changes (stores)
     - API integrations
     - UI/UX modifications
   - Identify patterns: new features, refactoring, bug fixes, performance improvements

6. **Generate PR title**:
   - Analyze all commit messages since divergence from target branch
   - Create a concise, descriptive title (50-72 characters) that summarizes the overall change
   - Use conventional commit prefixes when applicable (feat:, fix:, refactor:, etc.)
   - Examples:
     - "feat: add recurring order support to buy flow"
     - "refactor: improve keypad and amount selection UX"
     - "fix: resolve navigation freeze in stock purchase flow"

7. **Generate PR description** following this exact template:

````markdown
## TLDR

[One-to-two sentence summary of what this PR does]

## Problem Summary

[Describe the problem or need that motivated these changes. What wasn't working? What gap existed?]

## Solution

[Explain the approach taken to solve the problem:

- Key technical decisions and rationale
- New components, functions, or patterns introduced
- How the changes work together to address the problem]

## Visual Documentation

### Sequence Diagram

```mermaid
[Add sequence diagram ONLY if new flows are introduced - show step-by-step interactions]
[If no new flows, write: "No new flows introduced in this PR"]
```
````

### Component Diagram

```mermaid
[Add component diagram ONLY if new component relationships exist]
[If no new architectural changes, write: "No new component relationships in this PR"]
```

```

**Important guidelines for PR description**:
- **TLDR**: Focus on user-facing or technical impact, not implementation details
- **Problem Summary**: Explain why these changes were needed, what wasn't working
- **Solution**: Be specific about technical approach, mention new files/components by name
- **Mermaid Diagrams**:
  - **Sequence diagrams**: Create ONLY when there are new user flows, navigation paths, or API call sequences. Show the step-by-step interactions between components/modules/services
  - **Component diagrams**: Create ONLY when new components are added or architectural relationships change. Show how new components relate to existing ones
  - If no new flows or components, explicitly state "No new flows introduced in this PR" or "No new component relationships in this PR"
  - Use actual component/module/file names from the changes
  - Keep diagrams focused on what's NEW in this PR, not existing architecture

8. **Create or update the PR**:
   - **If PR exists**: Update the existing PR's body (description) using the GitHub MCP update issue tool (PRs are issues). Also consider if the title should be updated based on new commits
   - **If PR doesn't exist**: Create a new PR using `mcp__github__create_pull_request` with:
     - `owner`: Repository owner
     - `repo`: Repository name
     - `title`: Generated title
     - `head`: Current branch name
     - `base`: Target branch (`$1`)
     - `body`: Generated description

9. **Report results**:
   - Confirm if PR was created or updated
   - Provide the PR URL
   - Summarize the changes included

## Error Handling

- If target branch `$1` doesn't exist, stop and notify user
- If push fails, report error and stop
- If GitHub MCP tools fail, report connection issue
- If no changes exist between branches, notify user and ask if they still want to create/update PR

## Example Usage

```

/create-pr develop
/create-pr main

```

## Notes

- This command will always push the latest changes before creating/updating the PR
- The PR description is regenerated each time to reflect the current state of changes
- Manual edits to the "Related Issue" section on GitHub will be preserved if you update via web UI, but this command will overwrite the description when run
```

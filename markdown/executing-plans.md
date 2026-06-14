# 📈 @executing-plans

## 📌 Overview
- **Trigger**: `@executing-plans`
- **Category**: General Productivity & Workflow (For Both)
- **Purpose**: Keep track of project progress with incremental checkpoints, validating each completed step before moving to the next.
- **Best For**: Managing long-running projects, complex development cycles, and ensuring all requirements are met.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@executing-plans [paste your implementation plan or task checklist, and state your current progress]
```

---

## 💡 Key Capabilities & Features

- **Checklist Management**: Maintains a clean, living markdown checklist (`task.md`) tracking what is completed (`[x]`), what is in progress (`[/]`), and what is pending (`[ ]`).
- **Phase-by-Phase Execution Gates**: Enforces a strict review and test check at the end of each sub-task before allowing the AI or user to start on the next item.
- **Context Preservation**: Seamlessly saves and restores the exact project context (current state, modified files, tests run) across chat sessions.
- **Pivot Management**: If a bug or design roadblock is discovered during execution, help adjust the checklist dynamically without losing track of the final goal.
- **Continuous Integration Alignments**: Suggests incremental Git commits and atomic pull request groupings for completed steps.

---

## 🛠️ Real-world Examples

### Example 1: Resuming a Large Code Refactor
**Prompt:**
> `@executing-plans here is our task list for upgrading the dashboard page. We have completed the layout adjustments, and are currently in the middle of implementing the user stats API. Let's verify our current state and start on the next sub-task.`

### Example 2: Tracking Progress on Science Lab Report
**Prompt:**
> `@executing-plans here is my research assignment plan. I have written the introduction and abstract. Let's start compiling the raw experimental data from the CSV, format it into a table, and draft the analysis paragraph.`

---

## 📘 Best Practices
1. **Commit Atomically**: Commit your work to Git after each successful sub-task execution. This makes it easy to roll back if a later step fails.
2. **Never Skip Verification**: Even if a change seems trivial, compile the code, check for lint errors, and run tests before checking off the item.
3. **Keep the Checklist Updated**: Update your checklist (`task.md`) continuously so that it always represents the absolute ground-truth state of the project.

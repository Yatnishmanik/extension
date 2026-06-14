# 💻 @subagent-driven-development

## 📌 Overview
- **Trigger**: `@subagent-driven-development`
- **Category**: For Developers & Software Engineers
- **Purpose**: Coordinate and delegate sub-tasks to multiple parallel AI agents to accelerate large, complex development workflows.
- **Best For**: Large-scale codebase refactoring, multi-component integrations, and concurrent debugging processes.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@subagent-driven-development [describe the overall complex development objective, repository structure, and key sub-tasks]
```

---

## 💡 Key Capabilities & Features

- **Sub-task Division & Isolation**: Decomposes large systems changes into isolated, modular task specifications with clear boundaries to avoid overlapping edits.
- **Parallel Dispatch Orchestration**: Formulates explicit prompts, instructions, and context scopes for subagents to execute in parallel without stepping on each other.
- **Inter-Agent Communication & Synchronization**: Design protocol and data formats for agents to exchange information, state changes, or lint dependencies.
- **State Merging & Conflicts Resolution**: Systematic strategies for reviewing subagent outputs, running build tests, and merging files without git merge conflicts.
- **Verification Protocols**: Set up continuous regression and validation checks to verify that individual subagent changes form a cohesive whole.

---

## 🛠️ Real-world Examples

### Example 1: Refactoring Legacy API to Multi-Route Services
**Prompt:**
> `@subagent-driven-development we need to split our massive backend router file into 4 modular controllers: User, Billing, Product, and Admin. Let's design the layout and outline how to dispatch subagents to handle each module concurrently.`

### Example 2: Adding TypeScript Types
**Prompt:**
> `@subagent-driven-development I have a large JavaScript React codebase that I want to convert to TypeScript. Let's draft a plan to split the conversion across components using subagents, coordinating shared type files.`

---

## 📘 Best Practices
1. **Define Strict Boundaries**: Ensure each subagent operates in a completely distinct set of files to prevent file conflicts and context dilution.
2. **Standardize Shared Types/Contracts**: Before spawning subagents, establish and freeze the shared contracts (e.g. data interfaces, API schemas, shared utils) that all modules will use.
3. **Continuous Compilation Checks**: Run compilation, build, and tests after each subagent's changes are integrated to immediately catch integration bugs.

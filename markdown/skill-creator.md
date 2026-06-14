# 📈 @skill-creator

## 📌 Overview
- **Trigger**: `@skill-creator`
- **Category**: General Productivity & Workflow (For Both)
- **Purpose**: Teach the AI a custom workflow you perform frequently and package it into a reusable new skill!
- **Best For**: Automating repetitive tasks, building bespoke developer toolkits, and optimizing personal study workflows.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@skill-creator [describe the manual process, steps, or custom behaviors you want to automate as a reusable skill]
```

---

## 💡 Key Capabilities & Features

- **Skill Anatomy Structuring**: Generates valid skill configuration frontmatter (YAML) and compiles standard instruction templates (SKILL.md format).
- **Core Intent Extraction**: Identifies the primary triggers, constraints, limitations, and key instructions of your manual process.
- **Workflow Automation Code**: Proposes specific node scripts, python scripts, or CLI commands to bundle inside your new skill package.
- **Refinement & Iteration**: Guides you through fine-tuning instructions, drafting example prompts, and defining exit criteria.
- **Validation Audit**: Checks the newly created skill document against the system's execution standards to ensure zero syntax or parser errors.

---

## 🛠️ Real-world Examples

### Example 1: Creating a Custom Tailwind Utility Builder Skill
**Prompt:**
> `@skill-creator I want to teach the AI how to automatically convert plain CSS styles to tailwind utilities following our team's strict atomic spacing classes. Let's design and write a new '@tailwind-converter' skill.`

### Example 2: Study Deck Generator Skill
**Prompt:**
> `@skill-creator I frequently paste long PDF chapters and ask the AI to make a 2-column vocabulary table with translations and sample sentences. Let's package this workflow into a reusable '@vocab-builder' skill.`

---

## 📘 Best Practices
1. **Define Explicit Exit Criteria**: Every skill should have clear boundaries defining when the AI has completed the task and should stop.
2. **Include Concrete Examples**: Provide at least 2 highly realistic example prompts to show the AI how the skill is triggered and executed.
3. **Use Simple Frontmatter**: Keep skill metadata simple, containing name, description, risk level, and date created, as defined in standard setups.

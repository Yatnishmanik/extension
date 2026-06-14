# 💻 @systematic-debugging

## 📌 Overview
- **Trigger**: `@systematic-debugging`
- **Category**: For Developers & Software Engineers
- **Purpose**: Debug complex issues methodically by forming hypotheses, isolating variables, and running trace steps rather than guessing.
- **Best For**: Developers trying to squash elusive, intermittent, or deep-seated system bugs.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@systematic-debugging [describe the buggy behavior, error logs, and relevant code]
```

---

## 💡 Key Capabilities & Features

- **Hypothesis Formulation**: Breaks down ambiguous errors into clear, testable hypotheses of what might be failing.
- **Variable Isolation**: Helps you systematically isolate dependencies, environmental factors, or user states to narrow down the source of the issue.
- **Trace-Driven Diagnostics**: Guides you in setting up targeted logs, breadcrumbs, or stack trace captures to expose hidden execution flows.
- **Reproducibility Planning**: Offers instructions on how to create a minimal reproducible example (repro) or write a failing test first.
- **Root-Cause Analysis**: Focuses on fixing the underlying architectural flaw rather than just patching the symptom.

---

## 🛠️ Real-world Examples

### Example 1: Intermittent Race Condition
**Prompt:**
> `@systematic-debugging my React application occasionally gets stuck on an infinite loading spinner when users submit a checkout form twice quickly, but I can't reliably reproduce it. How do we systematically diagnose this?`

### Example 2: Memory Leak Diagnosis
**Prompt:**
> `@systematic-debugging our Node.js express backend shows a slowly increasing RAM usage until it runs out of memory every 48 hours. Here are our main route handlers. Let's isolate the leak.`

---

## 📘 Best Practices
1. **Never Make Random Changes**: Do not change code blindly hoping it will fix the bug. Every change should test a specific hypothesis.
2. **Read the Stack Trace**: Work from the bottom up to trace the exact function calls leading to the error.
3. **Verify Assumptions**: Double-check basic assumptions (e.g. database connection string, API keys, network availability) before jumping into complex code paths.

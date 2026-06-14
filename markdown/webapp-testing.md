# 💻 @webapp-testing

## 📌 Overview
- **Trigger**: `@webapp-testing`
- **Category**: For Developers & Software Engineers
- **Purpose**: Write and automate robust end-to-end (E2E) tests for web applications using Playwright or Cypress.
- **Best For**: Quality assurance (QA) specialists, frontend engineers, and DevOps teams looking to automate regression testing and validate user flows.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@webapp-testing [describe the user flow, login process, or component layout to test]
```

---

## 💡 Key Capabilities & Features

- **Automated Flow Scripting**: Generate clean E2E test scripts to simulate user registration, checkout paths, multi-factor logins, and complex table interactions.
- **Selector Best Practices**: Recommends resilient locators (e.g. `getByRole`, `getByPlaceholder`, `getByTestId`) to prevent fragile tests that break on visual adjustments.
- **Network Interception & Mocking**: Help intercept, mock, or delay API responses to test frontends in isolation and verify loading/error overlays.
- **Visual Regression Testing**: Setup screenshot and visual diff tests to ensure pages render beautifully across viewport sizes and color modes.
- **CI/CD Integration**: Guidelines on configuring Playwright/Cypress runner inside GitHub Actions, GitLab CI, or Vercel deployments.

---

## 🛠️ Real-world Examples

### Example 1: Playwright Multi-Step Form Test
**Prompt:**
> `@webapp-testing write a Playwright E2E test that loads our onboarding page, fills out a 3-step profile form, uploads an avatar file, submits, and asserts the successful dashboard redirection.`

### Example 2: Cypress API Mocking & Authentication
**Prompt:**
> `@webapp-testing I need to write a Cypress test for our user dashboard. Let's write a spec that mocks the login session and mocks the GET /api/user-stats payload to return 0 stats, verifying that an empty-state message is displayed.`

---

## 📘 Best Practices
1. **Prefer User-Facing Locators**: Always locate elements based on standard accessibility attributes (e.g. `role`, `label`, `placeholder`) rather than raw CSS selectors or long XPath trees.
2. **Avoid Hardcoded Delays**: Never use `page.waitForTimeout(5000)`. Instead, wait for specific network events, route loads, or element visibility states.
3. **Isolate Test State**: Ensure tests log in programmatically via APIs before each run to avoid repeating long UI interactions in every single test block.

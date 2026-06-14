# 💻 @test-driven-development

## 📌 Overview
- **Trigger**: `@test-driven-development`
- **Category**: For Developers & Software Engineers
- **Purpose**: Helps you write robust unit, integration, and contract tests before writing the actual business logic (TDD approach).
- **Best For**: Developers who want to ensure rigorous code quality, robust APIs, and excellent test coverage.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@test-driven-development [describe the module, input/output requirements, or logic you want to build]
```

---

## 💡 Key Capabilities & Features

- **Red-Green-Refactor Loop**: Structures development workflows strictly around writing a failing test (Red), making it pass with simple code (Green), and optimizing the code (Refactor).
- **Unit and Integration Specs**: Generates comprehensive unit specs using frameworks like Jest, Vitest, PyTest, or JUnit, including edge cases and boundary inputs.
- **Mocking and Stubbing Strategies**: Expert advice on when and how to mock external APIs, databases, or high-latency dependencies cleanly.
- **Error and Exception Testing**: Proposes specific assertions to verify that your code handles invalid parameters, timeouts, and network failures as expected.
- **Design Improvement**: TDD inherently encourages loose coupling and high cohesion; this skill points out architecture improvements to make modules more testable.

---

## 🛠️ Real-world Examples

### Example 1: Creating a Shopping Cart Calculator
**Prompt:**
> `@test-driven-development I need to build a shopping cart tax and discount calculator in TypeScript. Let's write the test suite first using Vitest, covering tax brackets, bulk discounts, and invalid items.`

### Example 2: Testing an API Route
**Prompt:**
> `@test-driven-development I want to build a POST /register endpoint in an Express app. Help me write Jest supertest specs to cover valid registration, duplicate email conflicts, and validation errors before we code the endpoint.`

---

## 📘 Best Practices
1. **Write Small Tests**: Focus on one specific rule or behavior at a time. Do not test multiple concerns in a single spec.
2. **Keep Tests Independent**: Each test must be completely isolated. Never allow state to bleed from one test to another.
3. **Verify Failures**: Make sure your test actually fails when the feature is missing or incorrect. If a test passes when the code is empty, the test is invalid.

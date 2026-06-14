# 💻 @senior-fullstack

## 📌 Overview
- **Trigger**: `@senior-fullstack`
- **Category**: For Developers & Software Engineers
- **Purpose**: Design robust database schemas, secure API endpoints, and implement complete full-stack features using secure, robust engineering patterns.
- **Best For**: Developers building applications from scratch or refactoring large features spanning frontend, backend, and database layers.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@senior-fullstack [describe your planned database schema, user flow, backend route, or full-stack feature]
```

---

## 💡 Key Capabilities & Features

- **Relational & Document DB Schema Design**: Formulate optimal PostgreSQL, MySQL, or MongoDB schemas with indexes, primary/foreign constraints, and proper normalization.
- **RESTful & GraphQL API Design**: Design clean, performant, and secure API surfaces including rate limiting, input validation (e.g. Zod/Joi), and pagination schemas.
- **Authentication & Authorization**: Expert guidelines on setting up secure sessions, JWTs, OAuth2 integrations, cookie security, and Role-Based Access Control (RBAC).
- **Concurrency & Transactions**: Prevent race conditions and ensure data consistency using database transactions, row locks, or pessimistic/optimistic locking.
- **Serverless & Container Architecture**: Advice on structuring backend code to run inside serverless environments (e.g. AWS Lambda, Vercel) or containerized architectures (Docker, Kubernetes).

---

## 🛠️ Real-world Examples

### Example 1: Schema Design with Prisma & PostgreSQL
**Prompt:**
> `@senior-fullstack I'm building a multi-tenant SaaS for project management. I need a Postgres schema using Prisma that links Users, Organizations, Projects, Tasks, and Comments, ensuring proper cascading deletes.`

### Example 2: API Route with Validation & Transaction
**Prompt:**
> `@senior-fullstack show me how to write a secure Node.js Express endpoint for `/api/checkout` that validates the user's cart using Zod, processes the balance inside a database transaction, and returns a transaction ID.`

---

## 📘 Best Practices
1. **Always Validate Input**: Treat all client data as hostile. Run rigorous validations on all request payloads before performing database queries or server logic.
2. **Use Indexes Wisely**: Index fields frequently used in query filters (`WHERE`), sorting (`ORDER BY`), and joins (`JOIN`) to ensure rapid database performance under load.
3. **Graceful Error Recovery**: Never reveal raw database errors or server traces to the client. Return generic, user-friendly error codes and log detailed stack traces securely on the server.

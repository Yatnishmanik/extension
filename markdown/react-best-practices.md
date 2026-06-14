# 💻 @react-best-practices

## 📌 Overview
- **Trigger**: `@react-best-practices`
- **Category**: For Developers & Software Engineers
- **Purpose**: Learn and implement modern React, Next.js App Router, and state management patterns.
- **Best For**: Web developers building modern, high-performance, and accessible user interfaces.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@react-best-practices [your question or request]
```

---

## 💡 Key Capabilities & Features

- **Next.js App Router Architecture**: Expert guidance on Server Components (RSC) vs. Client Components, layout structures, nested routes, routing strategies, parallel and intercepting routes.
- **State Management Design**: Learn when to use Local State, Context API, Zustand, Redux Toolkit, or URL state, and how to prevent unnecessary re-renders.
- **React Performance Optimization**: Techniques such as code splitting, dynamic imports, `useMemo`, `useCallback`, `useTransition`, and optimization of heavy lists.
- **Modern Hook Patterns**: Guidance on building custom, reusable hooks, and proper implementation of built-in hooks like `useEffect`, `useRef`, and `useDeferredValue`.
- **Server Actions & Mutations**: Securely mutating data using React Server Actions with proper validation, error handling, and optimistic updates.

---

## 🛠️ Real-world Examples

### Example 1: Next.js Server Components & Data Fetching
**Prompt:**
> `@react-best-practices how should I fetch and display a product catalog with category filtering using Next.js App Router Server Components?`

### Example 2: Optimistic UI Updates with Server Actions
**Prompt:**
> `@react-best-practices show me how to implement a secure, optimistic like/unlike button using React Server Actions and the useOptimistic hook.`

---

## 📘 Best Practices
1. **Default to Server Components**: Keep components as Server Components by default to reduce client-side bundle size, only adding `'use client'` when interactivity (event handlers, state, hooks) is needed.
2. **Proper Key Usage**: Never use index as a key for list items if the items can change, reorder, or be deleted.
3. **Handle Loading States Gracefully**: Utilize Next.js `loading.js` and React `Suspense` boundaries for progressive loading of high-latency components.

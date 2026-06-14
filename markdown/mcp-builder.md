# 💻 @mcp-builder

## 📌 Overview
- **Trigger**: `@mcp-builder`
- **Category**: For Developers & Software Engineers
- **Purpose**: Build custom Model Context Protocol (MCP) servers to securely connect external databases, legacy APIs, and local operating system tools directly to your AI.
- **Best For**: Advanced developers looking to expand their AI assistant's active toolkit and integrate proprietary systems.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@mcp-builder [describe the external database, API, or local command you want to connect as an MCP tool]
```

---

## 💡 Key Capabilities & Features

- **MCP Protocol Schema Design**: Formulate valid MCP definitions for tools, resources, and prompts, specifying appropriate JSON-Schema structures for parameters.
- **Node.js/TypeScript and Python MCP SDKs**: Write robust MCP server implementations using the official SDKs, handling tool invocations, and returning markdown or text outputs.
- **Connection Security**: Guidelines on setting up API token headers, environmental configurations, sandboxed execution commands, and permission restrictions.
- **Troubleshooting & Debugging**: Instructions on using the MCP Inspector tool, viewing server logs, and verifying JSON-RPC communication frames.
- **Workspace Tool Design**: Turn existing command-line interfaces or file utilities into standard tools that an AI agent can execute.

---

## 🛠️ Real-world Examples

### Example 1: Creating a Custom Database Query Tool
**Prompt:**
> `@mcp-builder I want to create an MCP server in TypeScript that connects to our local SQLite analytics database and exposes a 'query_user_signups' tool so the AI agent can query sign-up trends.`

### Example 2: Wrapping an API
**Prompt:**
> `@mcp-builder help me build a Python-based MCP server that connects to the Linear API and allows the AI agent to list, view, and create issue tickets with schemas.`

---

## 📘 Best Practices
1. **Provide Clear Tool Descriptions**: The AI relies on the tool's description to understand when to trigger it. Make the description highly specific and explain when it should NOT be used.
2. **Restrict Parameter Scopes**: Use strict JSON-Schema limits for all tool parameters (enums, min/max lengths) to prevent the AI from sending invalid payloads.
3. **Handle Exceptions Gracefully**: Catch errors inside tool handlers and return helpful, structured text explaining the failure to the AI, rather than crashing the MCP server.

#!/usr/bin/env node
/**
 * storyflo-mcp — stdio bridge for the hosted Storyflo MCP server.
 *
 * Speaks MCP stdio transport (newline-delimited JSON-RPC 2.0) on
 * stdin/stdout and relays each message to the streamable-http endpoint
 * at https://api.storyflo.com/mcp/v1.
 *
 * Discovery methods (initialize, ping, tools/list, resources/list) work
 * anonymously. tools/call requires an OAuth bearer token — set
 * STORYFLO_TOKEN, or connect your client directly to the remote URL to
 * use the full OAuth 2.1 + PKCE flow (see README).
 */

import { createInterface } from "node:readline";

const ENDPOINT =
  process.env.STORYFLO_MCP_URL || "https://api.storyflo.com/mcp/v1";
const TOKEN = process.env.STORYFLO_TOKEN || "";

function writeMessage(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

async function relay(msg) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(msg),
  });

  if (res.status === 202) return null; // notification accepted

  const text = await res.text();
  if (!text) return null;

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      jsonrpc: "2.0",
      id: msg.id ?? null,
      error: { code: -32000, message: `Upstream non-JSON response (HTTP ${res.status})` },
    };
  }

  // Auth errors come back with id:null; re-correlate so strict clients
  // can match the response to their request.
  if (parsed && parsed.id == null && msg.id != null) parsed.id = msg.id;
  return parsed;
}

const rl = createInterface({ input: process.stdin, terminal: false });

let pending = 0;
let stdinClosed = false;

function maybeExit() {
  if (stdinClosed && pending === 0) process.exit(0);
}

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    writeMessage({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" },
    });
    return;
  }

  pending += 1;
  relay(msg)
    .then((response) => {
      if (response) writeMessage(response);
    })
    .catch((err) => {
      if (msg.id != null) {
        writeMessage({
          jsonrpc: "2.0",
          id: msg.id,
          error: { code: -32000, message: `Upstream error: ${err.message}` },
        });
      }
    })
    .finally(() => {
      pending -= 1;
      maybeExit();
    });
});

rl.on("close", () => {
  stdinClosed = true;
  maybeExit();
});

# Storyflo MCP — Agent Install Guide

This file is read by AI agents (Cline, Claude, Cursor) when configuring the Storyflo MCP server. No build step or environment setup required — Storyflo runs as a hosted service.

## One-step install

Add to your MCP client's config:

```json
{
  "mcpServers": {
    "storyflo": {
      "url": "https://api.storyflo.com/mcp/v1",
      "transport": "streamable-http"
    }
  }
}
```

The first time the user invokes a Storyflo tool, the client will prompt for OAuth consent. Authentication happens via the user's browser at `https://storyflo.com/oauth/authorize` — no API keys or shared secrets to manage.

## Tools (8 total)

**Free** (no payment beyond OAuth):
- `search_articles` — search the curated article corpus by vertical
- `get_article` — fetch the full record + body_text + audio_url
- `get_audio_url` — resolve the playable audio URL for hand-off
- `subscribe_topic` — mint or update the listener's personal podcast RSS feed
- `list_subscriptions` — list feeds this agent has minted on the human's behalf
- `digest` — aggregate top-N articles across verticals (heaviest read-only action)
- `get_market_linked_stories` — Storyflo stories matched to actively traded Kalshi event contracts (a CFTC-regulated designated contract market). Each item carries qualitative signal tags (`active`, `high_velocity`, `genuine_uncertainty`) plus a link-out to Kalshi's own page where the live market data lives. Editorial sourcing surface — Storyflo never returns raw prices, probabilities, volumes, or open interest. Informational use only; not investment advice.

**Premium** (metered via x402 over USDC on Base mainnet):
- `get_vertical_briefing` — stitched audio briefing of top-25 trending articles in a vertical from the last 24h

Agents that don't have a wallet wired can still call free tools without paying. Paid calls return a 402 with the on-chain price; the agent's x402 client handles settlement.

## No environment variables required

Everything works out of the box. Storyflo is a hosted MCP server — there's no Docker, no API key file, no local state.

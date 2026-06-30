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

Many tools are **public (no auth)** — Declassified, discovery, and partner tools work from a fresh install with no OAuth handshake. Tools that act on a listener's behalf (mint a feed, fetch premium audio) prompt for OAuth consent on first use, via the user's browser at `https://www.storyflo.com/oauth/authorize` — no API keys or shared secrets to manage.

> **Claude Desktop:** for a one-click `.mcpb` install, use the companion extension repo [Alisammour/storyflo-mcp-extension](https://github.com/Alisammour/storyflo-mcp-extension).

## Tools (21 total)

**Public** (no auth required):
- `search_articles` — search the curated article corpus by query/vertical
- `get_article` — fetch the full record + body_text + audio_url by slug
- `get_audio_url` — resolve the playable audio URL for hand-off
- `get_trending_topics` — what's hot on Storyflo right now
- `get_personas` — the host voices (Theo / Mason / Riley / Iris / Brock / Wit)
- `get_vertical_landscape` — one-shot per-vertical context for onboarding a listener
- `list_podcasts` — full catalog of audio shows (per-host + Declassified)
- `digest` — aggregate top-N articles across verticals (heaviest read-only action)
- `get_market_linked_stories` — Storyflo stories matched to actively traded Kalshi event contracts (a CFTC-regulated designated contract market). Qualitative signal tags + a link-out to Kalshi; never raw prices/probabilities/volumes/OI. Informational only; not investment advice.
- `get_crypto_market_link` — Kraken affiliate markets link-out for crypto-relevant stories (editorial linkout, not a trading recommendation)
- `search_declassified` — substring search across the public Declassified case archive
- `get_declassified_case` — full Declassified case record by slug
- `digest_declassified` — most-recently-published Declassified cases over a window
- `subscribe_topic` — mint or update the listener's personal podcast RSS feed
- `subscribe_declassified_topic` — resolve a Declassified podcast-feed URL (read-only)
- `list_subscriptions` — list feeds this agent has minted on the human's behalf
- `register_embedder` — returns a partner onboarding URL (does NOT send email or create a row)
- `get_embedder_manifest` — the embedder integration manifest
- `get_embedder_network_manifest` — the embedder network manifest
- `quote_partnership` — explore partnership tiers, creative formats + payout rails

**Premium** (metered via x402 over USDC on Base mainnet):
- `get_vertical_briefing` — stitched audio briefing of top-25 trending articles in a vertical from the last 24h

Agents that don't have a wallet wired can still call free tools without paying. Paid calls return a 402 with the on-chain price; the agent's x402 client handles settlement.

## No environment variables required

Everything works out of the box. Storyflo is a hosted MCP server — there's no Docker, no API key file, no local state.

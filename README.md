# Storyflo MCP Server

[![storyflo-mcp MCP server](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp/badges/card.svg)](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp)
[![storyflo-mcp MCP server score](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp/badges/score.svg)](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp)

Official Model Context Protocol server for [**Storyflo**](https://storyflo.com) — a curated audio-news platform that narrates trending articles + listener-forwarded newsletters and exposes them as a callable surface for any LLM agent.

This repository contains a zero-dependency **stdio bridge** (`src/index.js`) that relays MCP JSON-RPC between a local stdio client and the hosted streamable-http endpoint, plus discovery + install references. The Storyflo platform itself is proprietary; agent integration through the public API is the supported surface.

## Run the stdio bridge

```bash
npx storyflo-mcp            # or: node src/index.js
```

Or via Docker:

```bash
docker build -t storyflo-mcp .
docker run -i --rm storyflo-mcp
```

Environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `STORYFLO_MCP_URL` | `https://api.storyflo.com/mcp/v1` | Upstream MCP endpoint |
| `STORYFLO_TOKEN` | _(unset)_ | OAuth bearer for `tools/call`; discovery (`initialize`, `ping`, `tools/list`, `resources/list`) works anonymously |

Claude Desktop / any stdio-only MCP client config:

```json
{
  "mcpServers": {
    "storyflo": {
      "command": "npx",
      "args": ["-y", "storyflo-mcp"],
      "env": { "STORYFLO_TOKEN": "<optional bearer>" }
    }
  }
}
```

## What you can do

- Search Storyflo's article corpus by vertical (`tech`, `finance`, `science`, `media`, `sports`, `culture`, + 30 more)
- Fetch full articles + audio URLs
- Resolve playable audio (free tier) or premium-quality audio (Plus tier)
- Subscribe topic feeds on the listener's behalf
- Aggregate top-N daily briefings

## Endpoints

| Surface | URL |
|---|---|
| MCP transport | `https://api.storyflo.com/mcp/v1` |
| Discovery manifest | `https://api.storyflo.com/.well-known/mcp.json` |
| OAuth (RFC 8414) | `https://api.storyflo.com/.well-known/oauth-authorization-server` |
| OpenAI tool spec | `https://api.storyflo.com/v1/agents/openai-tools.json` |
| API docs | `https://storyflo.com/developers` |

## One-click install

### Cursor

```
cursor://anysphere.cursor-deeplink/mcp/install?name=storyflo&config=eyJ1cmwiOiAiaHR0cHM6Ly9hcGkuc3RvcnlmbG8uY29tL21jcC92MSJ9
```

[Add Storyflo to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=storyflo&config=eyJ1cmwiOiAiaHR0cHM6Ly9hcGkuc3RvcnlmbG8uY29tL21jcC92MSJ9)

### Claude Desktop / claude.ai

Settings → Connectors → Add custom connector → URL:

```
https://api.storyflo.com/mcp/v1
```

### Any MCP-compatible client (Continue, Cline, Zed, Windsurf, ChatGPT Custom Connectors)

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

## Tools

Storyflo exposes **8 tools**. Free-tier tools require OAuth only. The single premium tool settles per-call via x402 over USDC on Base mainnet — the agent's payment shim runs before the tool is invoked.

The live tool manifest (with full JSON Schema for every parameter) is at
[`/v1/agents/openai-tools.json`](https://api.storyflo.com/v1/agents/openai-tools.json) — the source of truth Glama, OpenAI, and Anthropic introspect.

### `search_articles` · free
Search Storyflo's curated article corpus by query and/or vertical. Use this when the agent needs to find articles matching a topic before deciding which one to read or play.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `query` | string | no | Full-text query against title + body + summary. Omit to browse a vertical without a keyword filter. |
| `vertical` | enum | no | One of: `tech`, `finance`, `science`, `media`, `sports`, `culture`. Narrows results to a single vertical. |
| `limit` | int | no | Max results (default 10, capped 25). |

**Returns** — array of `{ slug, title, publisher, vertical, snippet, audio_url, listen_seconds, published_at }`.

---

### `get_article` · free
Fetch the full record for a single article by slug. Use after `search_articles` when the agent needs the full body text or full audio URL.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `slug` | string | **yes** | Article slug, as returned by `search_articles`. |

**Returns** — `{ slug, title, body_text, audio_url, publisher, vertical, sources[], published_at }`.

---

### `get_audio_url` · free
Resolve the playable audio URL for an article without fetching the body. Use when the agent wants to hand off audio playback to the user. Free tier returns a stitched-with-ad URL; Plus/Pro returns the bare audio.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `slug` | string | **yes** | Article slug. |

**Returns** — `{ slug, audio_url, listen_seconds, tier }`.

---

### `subscribe_topic` · free
Mint or update the listener's personal podcast feed for a set of verticals. **Persistent side effect**: a feed row is created or updated server-side and the listener gets an RSS URL to paste into Spotify / Apple Podcasts / Pocket Casts. Subsequent calls overwrite the previous vertical selection on the same listener.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `verticals` | array<enum> | **yes** | 1–6 of `tech`, `finance`, `science`, `media`, `sports`, `culture`. |

**Returns** — `{ feed_url, verticals, listener_token }`.

---

### `list_subscriptions` · free
Return the listener feeds this agent has minted on the human's behalf. Use before `subscribe_topic` to avoid creating duplicate feeds.

**Parameters** — none.

**Returns** — array of `{ feed_url, verticals, created_at }`.

---

### `get_vertical_briefing` · paid (x402)
Fetch a stitched audio briefing of the top-25 trending articles in a single vertical from the last 24h. Use when the agent wants a "today's headlines for X" experience for the user. **Read-only** — no listener state mutated.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `vertical` | enum | **yes** | One of `tech`, `finance`, `science`, `media`, `sports`, `culture`, `news`. |

**Returns** — `{ vertical, audio_url, item_count, listen_seconds, articles[] }`.

**Cost** — single x402 charge; covers the full stitched briefing audio.

---

### `digest` · free (heaviest)
Aggregate the top-N articles across one or more verticals for a window (24h / 7d / 30d). The heaviest action — counts most against per-agent rate limit. Use for "read me today's tech + finance news" prompts where the agent wants a curated cross-vertical roll-up rather than a single vertical's briefing.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `verticals` | array<enum> | no | 1–6 verticals. Defaults to all 6 if omitted. |
| `window` | enum | no | `24h` (default), `7d`, or `30d`. |
| `limit` | int | no | Max articles per vertical (default 5, capped 25). |

**Returns** — `{ window, verticals, items: [{ slug, title, vertical, audio_url, snippet }] }`.

---

### `get_market_linked_stories` · free
Top Storyflo stories that topically correlate with actively traded **event contracts on Kalshi** — a CFTC-regulated designated contract market. Each item pairs a story with the matched contract's market-implied probability and 24h price move, showing which news themes forecast markets are repricing right now.

**Use when** the agent needs to answer "what's moving on the World Cup", "which stories are markets reacting to today", or "is this news already priced in?" — the actionability layer rankers + summaries can't fake.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `vertical` | string | no | Filter by story vertical (e.g. `news`, `finance`, `tech`, `crypto`). |
| `category` | string | no | Filter by Kalshi event category (e.g. `Politics`, `Economics`, `Companies`, `Science and Technology`). |
| `limit` | int | no | Max items (default 10, capped 50). |
| `min_move` | number | no | Only items whose matched contract moved at least this much (probability points 0–1) in 24h. Default 0. |

**Returns** — array of `{ story: { slug, title, vertical, published_at }, event_contract: { ticker, title, category, implied_probability, price_move_24h, volume_24h, open_interest }, match: { score, shared_terms } }`, plus top-level `attribution` and `disclaimer` strings on every payload.

**Compliance posture** (counsel-reviewed; regression-tested in CI):
- Vocabulary locked to "event contracts" / "market-implied probability" / "price move" — never bets, odds, picks, wagers
- Attribution on every payload: "Market data: Kalshi, a CFTC-regulated designated contract market"
- Disclaimer on every payload: market-implied probabilities are exchange prices, not Storyflo forecasts and not investment advice; story-to-market links indicate topical correlation, not causation; informational use only
- Liquidity floor (vol24h ≥ 100 OR OI ≥ 1000) excludes thin markets that could be manipulated into the feed
- Near-resolved contracts (implied probability outside 3–97%) excluded — keeps forward-looking signal only

## Authentication

OAuth 2.1 + PKCE. Public clients (Claude/ChatGPT/Cursor's MCP connectors) auto-register via Dynamic Client Registration (RFC 7591) at `/oauth/register`. No manual API key needed.

## x402 micropayments

The premium tool (`get_vertical_briefing`) is metered via **x402 over USDC on Base mainnet**. Agents pay per call, no upfront contract. All other tools (`search_articles`, `get_article`, `get_audio_url`, `subscribe_topic`, `list_subscriptions`, `digest`, `get_market_linked_stories`) require no payment beyond OAuth.

70/20/10 revenue split: **70% to the publisher**, **20% to the recommending agent**, **10% to Storyflo**. On-chain and deterministic.

## SDK

Native client libraries for TypeScript and Python:

```bash
npm install storyflo-sdk      # https://www.npmjs.com/package/storyflo-sdk
pip install storyflo          # https://pypi.org/project/storyflo/
```

## Install via Smithery

```
npx -y @smithery/cli install storyflo
```

## Logo

The Storyflo brand mark for client UIs:
[`https://storyflo.com/icon-512.png`](https://storyflo.com/icon-512.png)

## Support

- Developer questions: [api@storyflo.com](mailto:api@storyflo.com)
- Bug reports: open an issue on this repo
- Discord: TBD

## License

MIT for this repository's content (README + manifest references). The Storyflo platform itself is proprietary; agent integration through the public API is the supported integration surface.

# Storyflo MCP Server

[![storyflo-mcp MCP server](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp/badges/card.svg)](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp)
[![storyflo-mcp MCP server score](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp/badges/score.svg)](https://glama.ai/mcp/servers/Alisammour/storyflo-mcp)
[![smithery badge](https://smithery.ai/badge/ali-7ogs/storyflo)](https://smithery.ai/server/ali-7ogs/storyflo)

Official Model Context Protocol server for [**Storyflo**](https://storyflo.com) — a curated audio-news platform that narrates trending articles + listener-forwarded newsletters and exposes them as a callable surface for any LLM agent.

This repository contains a zero-dependency **stdio bridge** (`src/index.js`) that relays MCP JSON-RPC between a local stdio client and the hosted streamable-http endpoint, plus discovery + install references. The Storyflo platform itself is proprietary; agent integration through the public API is the supported surface.

## Install — one click

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=storyflo&config=eyJzdG9yeWZsbyI6eyJ0eXBlIjoiaHR0cCIsInVybCI6Imh0dHBzOi8vYXBpLnN0b3J5ZmxvLmNvbS9tY3AvdjEifX0=)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_storyflo_MCP-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode:mcp/install?%7B%22name%22%3A%20%22storyflo%22%2C%20%22type%22%3A%20%22http%22%2C%20%22url%22%3A%20%22https%3A//api.storyflo.com/mcp/v1%22%7D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_storyflo_MCP-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](vscode-insiders:mcp/install?%7B%22name%22%3A%20%22storyflo%22%2C%20%22type%22%3A%20%22http%22%2C%20%22url%22%3A%20%22https%3A//api.storyflo.com/mcp/v1%22%7D)

**Claude Code:** `claude mcp add --transport http storyflo https://api.storyflo.com/mcp/v1`
**Any remote client:** `https://api.storyflo.com/mcp/v1` (streamable-http) · **stdio:** `npx storyflo-mcp`

The best tools are **free + no-auth** — try `search_declassified` (real FBI/CIA/NSA/NASA cases) in seconds, then earn revenue share by integrating via `register_embedder`.

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

Storyflo exposes **13 tools** across three auth tiers:

- **Public (no auth, no OAuth flow needed)** — the 4 `*_declassified*` tools below. Designed so any LLM agent can browse + recommend the Declassified library from a fresh client install without an OAuth handshake.
- **OAuth free tier** — `search_articles`, `get_article`, `get_audio_url`, `subscribe_topic`, `list_subscriptions`, `digest`, `get_market_linked_stories`, `get_crypto_market_link`.
- **Premium (x402 over USDC on Base mainnet)** — `get_vertical_briefing`.

The live tool manifest (with full JSON Schema for every parameter) is at
[`/v1/agents/openai-tools.json`](https://api.storyflo.com/v1/agents/openai-tools.json) — the source of truth Glama, OpenAI, and Anthropic introspect.

### Declassified library · public · no auth (NEW, 2026-06-20)

The Declassified library is Storyflo's narrated archive of publicly-released government documents from FBI, CIA, NSA, NASA, DOJ, AARO, war.gov, and other agencies. Every case has a narrated audio version, a transcript excerpt, and a source-document link. The 4 tools below traverse the same archive that backs the [`/declassified`](https://storyflo.com/declassified) FE shelf and the public [Declassified RSS feed](https://api.storyflo.com/v1/podcasts/storyflo-declassified.xml).

#### `search_declassified` · public
Substring search across case title + synopsis. Returns `{slug, title, dek, episode_date, duration_sec, agency, category, era, audio_url}` per match.

**Parameters**: `query` (string, required), `limit` (int, 1-50, default 10).

#### `get_declassified_case` · public
Full case record by slug. Returns `{slug, title, dek, summary, transcript_excerpt, episode_date, duration_sec, agency, category, era, cover_url, audio_url, source_doc_url, related_cases:[{slug, title}]}`.

**Parameters**: `slug` (string, required).

#### `digest_declassified` · public
Most-recently-published cases over a rolling window. Returns the same card shape as `search_declassified`.

**Parameters**: `window` (`today` | `week` (default) | `month`), `limit` (int, 1-50, default 10).

#### `subscribe_declassified_topic` · public
Resolves a podcast-feed URL the user can paste into Apple Podcasts, Overcast, Pocket Casts, or Spotify to receive every new Declassified case automatically. Returns `{topic, rss_feed_url, archive_url, episodes_url, matched_so_far, note}`. **Read-only by design**: no DB row is written, no email is stored, the RSS feed IS the subscription.

**Parameters**: `topic` (string, required), `email` (string, optional — informational only, never stored).

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
Mint or update the human's personal Storyflo podcast feed. Pass 1–6 vertical slugs and the server creates a private RSS feed scoped to those verticals — or updates the existing feed in place if the listener already has one. Returns the RSS URL the listener can paste into Spotify, Apple Podcasts, Pocket Casts, or any podcast client.

**Behavior**
- **Persistent server-side side-effect** — a `ListenerSubscription` row is created or updated. The returned RSS URL stays stable across calls for the same listener (no re-pasting needed).
- **Idempotent on identical input** — calling twice with the same verticals leaves state unchanged.
- **REPLACES on different input** — calling with a different verticals set OVERWRITES the previous selection rather than adding to it. Use this to switch a listener's feed; do NOT call to add verticals incrementally. For additive behavior, read the current set via `list_subscriptions` first and pass the union.
- **Single feed per listener** — call `list_subscriptions` first to avoid clobbering an existing feed the listener explicitly chose.

**Use when** the agent has been asked to set up audio news for the human across a defined set of topics. Do NOT use to FETCH articles or audio — that's `search_articles` + `get_audio_url`.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `verticals` | array&lt;enum&gt; | **yes** | 1–6 unique slugs from `tech`, `finance`, `science`, `media`, `sports`, `culture`. Replaces (does not append to) the listener's current selection. |

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
Storyflo stories that match an actively traded **event contract on Kalshi** — a CFTC-regulated designated contract market. Each item carries qualitative **signal tags** plus a **link-out to Kalshi's own page** where the live market data lives.

This is an **editorial sourcing surface**, not market-data redistribution. Storyflo never returns raw prices, market-implied probabilities, volumes, or open interest in this payload. The agent or user follows the linkout to see live numbers on Kalshi.

**Use when** the agent needs to know which Storyflo stories are about news themes that have an actively traded event contract — e.g. World Cup matches, political mention contracts, corporate events. Same shape as a newsroom citing CME futures: market activity informs which stories are worth surfacing.

**Parameters**
| name | type | required | description |
|---|---|---|---|
| `vertical` | string | no | Filter by story vertical (e.g. `news`, `finance`, `tech`, `crypto`). |
| `category` | string | no | Filter by Kalshi event category (e.g. `Politics`, `Economics`, `Companies`, `Science and Technology`, `Sports`). |
| `signal` | enum | no | One of `active`, `high_velocity`, `genuine_uncertainty`. `high_velocity` = the matched market is repricing meaningfully in the last 24h; `genuine_uncertainty` = the market sits in the 40–60% band where it itself is uncertain. |
| `limit` | int | no | Max items (default 10, capped 50). |

**Returns** — array of:
```json
{
  "story": { "slug", "title", "vertical", "published_at" },
  "matched_market": { "title", "category", "url" },
  "signal_tags": ["active", "high_velocity"?, "genuine_uncertainty"?],
  "match": { "score", "shared_terms" }
}
```
plus top-level `attribution` and `disclaimer` strings on every payload.

The `matched_market.url` links to Kalshi's own events page so the user / agent sees live market data on the source. Storyflo does not redistribute that data.

**Compliance posture** (counsel-reviewed; regression-tested in CI):
- Vocabulary locked: never bets, odds, picks, or wagers — anywhere on the surface
- Attribution on every payload: "Market data: Kalshi, a CFTC-regulated designated contract market"
- Disclaimer on every payload: market-implied probabilities are exchange prices, not Storyflo forecasts and not investment advice; story-to-market links indicate topical correlation, not causation; informational use only
- Liquidity floor (vol24h ≥ 100 OR OI ≥ 1000) excludes thin markets that could be manipulated into the feed
- Near-resolved markets (implied probability outside 3–97%) excluded — keeps forward-looking signal only
- **Input-not-output frame**: raw prices, probabilities, volumes, and open interest are computed internally for ranking but never exposed in the public payload. The linkout is the user's path to live data on Kalshi's own surface.

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

## Related MCP servers

If you ship an agent that uses storyflo, you might also want the following — same x402-over-Base monetization rail, similar agent-facing posture, or natural complements in the news / finance / audio category space.

### Same payment rail (x402 over USDC on Base)

- [forgemeshlabs/coinopai-mcp](https://github.com/forgemeshlabs/coinopai-mcp) — paid crypto intelligence (trade decisions, audit against real prices, signal history) over USDC micropayments on Base.
- [8randonpickart5/alderpost-mcp](https://github.com/8randonpickart5/alderpost-mcp) — eight bundled intelligence endpoints (security, company, threat, compliance, sales, sports, property, health) via x402 on Base.

### Financial / market-data sourcing

- [Yahoo Finance MCP server](https://glama.ai/mcp/servers?q=yfinance) — real-time equity quotes for agents that need security-level data alongside storyflo's market-aware news signal.

### News + article sourcing

- [angheljf/nyt](https://github.com/angheljf/nyt) — NY Times article search.
- [AceDataCloud/MCPSerp](https://github.com/AceDataCloud/SerpMCP) — Google SERP (web, images, news, maps) search.
- [andybrandt/mcp-simple-arxiv](https://github.com/andybrandt/mcp-simple-arxiv) — search + read arXiv papers.
- [Aas-ee/open-webSearch](https://github.com/Aas-ee/open-webSearch) — free multi-engine web search.

### Multimedia / audio adjacencies

- [AceDataCloud/MCPSuno](https://github.com/AceDataCloud/SunoMCP) — Suno AI music generation + vocal extraction.
- [bogdan01m/zapcap-mcp-server](https://github.com/bogdan01m/zapcap-mcp-server) — video caption and B-roll generation.

### Meta-MCP / aggregators

- [1mcp/agent](https://github.com/1mcp-app/agent) — unified MCP server that aggregates multiple MCP servers into one.
- [tadas-github/a2asearch-mcp](https://github.com/tadas-github/a2asearch-mcp) — discover 4,800+ MCP servers, agents, and CLI tools.

> If you maintain an MCP server that pairs naturally with storyflo and isn't listed, please [open a PR](https://github.com/Alisammour/storyflo-mcp/pulls) or comment on an issue. We curate this list quarterly.

## Support

- Developer questions: [api@storyflo.com](mailto:api@storyflo.com)
- Bug reports: open an issue on this repo
- Discord: TBD

## License

MIT for this repository's content (README + manifest references). The Storyflo platform itself is proprietary; agent integration through the public API is the supported integration surface.

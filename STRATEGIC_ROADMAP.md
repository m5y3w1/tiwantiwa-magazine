# Tiwantiwa.com Strategic Elevation & Rate-Limit Prevention Schedule

## Strategic Elevation Suggestions
1. **Curated Multimedia & Infographics**: Integrate rich visual charts and data summaries into long-form essays to drive higher engagement and social shares across the Nigerian diaspora.
2. **Newsletter & Syndicate Syndication**: Automate weekly digest emails sourced from published dispatches to deepen reader retention and direct traffic.
3. **Interactive Editorial Dashboard**: Build a lightweight CLI or local dashboard view to preview, score, and batch-approve incoming dispatches with zero friction.

## Rate-Limit Safe Execution Schedule
- **Batching Strategy**: Process content generation and external API calls in small, staggered batches (max 3 dispatches per run) with built-in random jitter and exponential backoff delays.
- **Local Caching First**: Always check the local SHA-256 cache (`.cache/ai/`) before querying any external LLM endpoint.
- **Scheduled Cadence**: Run editorial ingestion and generation tasks during off-peak hours or via staggered cron schedules to ensure uninterrupted zero-cost performance.

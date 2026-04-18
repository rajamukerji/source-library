# Reddit API Resubmission Email Draft

This draft is designed for the next Reddit Data API resubmission for **Stowry**. It is intentionally narrower than the broader product vision and focuses only on the specific Reddit use case being requested for approval.

## Suggested subject

**Request for reconsideration: read-only personal saved-items organizer for Reddit user-owned saved content**

## Email draft

Hello Reddit Data API Team,

Thank you for reviewing my earlier request. I believe my first submission did not explain the Stowry use case with enough specificity, so I am resubmitting with a narrower and more explicit description.

**Stowry** is a personal saved-content organizer. The requested Reddit integration is limited to allowing an authenticated user to connect their own Reddit account via OAuth and import that same user’s own saved Reddit posts and comments into a private library for foldering, search, note-taking, and later retrieval.

This integration is **read-only**. Stowry will **not** post, comment, vote, moderate, send private messages, automate engagement, scrape Reddit outside approved API access, use Reddit data for advertising or profiling, train AI or machine-learning models on Reddit data, or redistribute Reddit content as a public feed replacement.[1] [2] [3]

The requested API access is limited to the minimum functionality required to identify the authenticated Reddit account and retrieve that user’s own saved listing. Stowry is intended to use `GET /api/v1/me` for account identity and `GET /user/{username}/saved` for the user’s saved items, with the minimum necessary OAuth scopes for identity and saved-history retrieval.[4]

Stowry is currently an **MVP** and is being submitted as a **non-commercial** personal companion application. It is not seeking approval for ads, paywalls tied to Reddit content, content resale, broad redistribution, or any other monetized Reddit-dependent use. If that changes in the future, I understand separate approval may be required.[2] [3]

To make review easier, I have prepared reviewer-facing documentation in the public repository:

| Resource | Purpose |
|---|---|
| `README.md` | Public overview of current product scope and implementation state |
| `REVIEWERS.md` | Reviewer-oriented summary of the current MVP and intended Reddit integration |
| `REDDIT_USE_CASE.md` | Exact intended Reddit behavior, access boundaries, and explicit non-goals |
| `PRIVACY.md` | Privacy, storage, disconnect, and deletion posture for Reddit-linked data |
| `reddit_api_resubmission_plan.md` | Structured analysis of the previous rejection and tightened application framing |

Repository: `https://github.com/rajamukerji/source-library`

I would be grateful for reconsideration of this narrow read-only use case. If the request still lacks necessary detail, I would also appreciate any specific guidance on what additional information would be needed to bring the submission into compliance.

Thank you for your time.

## Optional short-form version

Hello Reddit Data API Team,

I am resubmitting my request with a narrower description of the use case. **Stowry** is a read-only personal organizer for a user’s own saved Reddit posts and comments. With explicit OAuth consent, the app links the user’s Reddit account, reads that user’s saved listing, and imports those saved items into a private folder-based library for later retrieval. The app does **not** post, comment, vote, moderate, message, automate engagement, scrape outside approved API access, train models, or redistribute Reddit content as a public feed.

This request is for a **non-commercial MVP** and only for the minimum identity and saved-history access needed to support that private personal-library workflow. Supporting reviewer materials are available in the public repository: `https://github.com/rajamukerji/source-library`.

Thank you for reconsidering this use case.

## References

[1]: https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy "Responsible Builder Policy – Reddit Help"
[2]: https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data "Developer Platform & Accessing Reddit Data – Reddit Help"
[3]: https://redditinc.com/policies/data-api-terms "Data API Terms – Reddit, Inc."
[4]: https://www.reddit.com/dev/api/oauth/ "reddit.com: api documentation"

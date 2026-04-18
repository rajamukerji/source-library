# Reddit Use Case for Stowry

**Stowry** is a personal saved-content organizer. The purpose of the Reddit integration is narrow: an authenticated user can connect their own Reddit account and import that same user’s own saved Reddit posts and comments into a private Stowry library for foldering, search, note-taking, and later retrieval. This document is intended to help reviewers understand the exact scope of the requested Reddit Data API access and the limits that Stowry is designed to respect.[1] [2]

## Core use-case statement

> Stowry uses Reddit OAuth only to let a user privately import and organize that same user’s own saved Reddit posts and comments. It is not designed to automate Reddit activity, replace Reddit’s browsing experience, or redistribute Reddit content as a public feed.[1] [2] [3]

## Requested Reddit behavior

| Area | Intended behavior |
|---|---|
| Account linking | The user explicitly authorizes Stowry to connect their Reddit account through OAuth. |
| Identity check | Stowry verifies the authenticated Reddit account so imported saved items are associated with the correct Stowry user. |
| Saved-item import | Stowry retrieves the authenticated user’s own saved posts and comments and normalizes them into Stowry library entries. |
| Private organization | Imported items are used so the user can place them into folders, attach personal notes, and retrieve them later. |
| Refresh/sync | Stowry may periodically refresh the user’s saved-item list within approved limits after the user has linked Reddit. |
| User controls | The user can disconnect Reddit and request deletion of linked tokens and imported Reddit-derived entries from Stowry storage. |

## Exact access model

Reddit’s policies require apps to have a clearly specified purpose and scope of access, to use approved authentication, and to avoid masking OAuth identity.[1] [3] Stowry therefore intends to request only the minimum access needed to identify the user and read that user’s saved items.

| Technical area | Planned access |
|---|---|
| OAuth identity | `GET /api/v1/me` under the `identity` scope to confirm which Reddit account is connected.[4] |
| Saved-item retrieval | `GET /user/{username}/saved` through Reddit’s history listing access, which covers comments or submissions the user has saved.[4] |
| Listing pagination | Standard Reddit listing pagination using `after`, `before`, `limit`, and `count` where needed for incremental sync.[4] |
| OAuth scope posture | Minimum intended scopes are the identity scope and the history scope required for reading a user’s saved listing; final implementation will request no broader permissions than necessary.[4] |

## Data Stowry expects to use

Stowry’s planned Reddit import is intentionally limited to the information needed to reconstruct a user’s saved-item library inside the app.

| Data category | Intended use inside Stowry |
|---|---|
| Reddit account identifier and username | Link the correct Reddit account to the correct Stowry user and support re-sync. |
| Saved item type | Distinguish post versus comment during normalization. |
| Saved item metadata | Preserve title, author handle, subreddit, permalink, created timestamp, and item ID where available so the saved item remains understandable in context. |
| Saved item body excerpt or text | Support in-app recall and search where the Reddit response includes the relevant text content. |
| Sync cursors or timestamps | Support incremental refresh and reduce unnecessary API usage. |
| OAuth tokens | Maintain the authorized connection and allow refresh until the user disconnects or Reddit access is revoked. |

## Explicit non-goals

Stowry is not requesting approval for general Reddit-client behavior. The app is intentionally designed **not** to perform the following actions.[1] [2] [3]

| Disallowed or out-of-scope behavior | Stowry position |
|---|---|
| Posting submissions | Not supported |
| Commenting or replying | Not supported |
| Voting | Not supported |
| Moderation actions | Not supported |
| Private messaging or chat automation | Not supported |
| Growth or engagement automation | Not supported |
| Scraping outside approved Reddit API access | Not supported |
| Model training or AI training on Reddit data | Not supported |
| Ad targeting or profiling based on Reddit data | Not supported |
| Resale, relicensing, or paid redistribution of Reddit data | Not supported |
| Public feed replacement or broad republication of Reddit content | Not supported |

## How Stowry fits Reddit’s policy framing

The Responsible Builder Policy requires advance approval, transparency about how and why data is accessed, and narrow app scope.[1] The broader developer guidance also distinguishes non-commercial uses from monetized or business uses that may need additional permission.[2] The Data API Terms further require accurate identification information, an app privacy policy, approved OAuth-based access, and compliance with usage limits and content restrictions.[3]

Stowry is being positioned for review as a **read-only external companion application** for a user’s own saved Reddit material. The requested use is therefore closer to personal organization and retrieval than to content extraction, advertising, research, or social automation.

## Commercial status statement

At the time of resubmission, Stowry should be described as a **non-commercial MVP** for purposes of the Reddit request unless that status changes. The app should state clearly that it is not seeking approval for ads, paywalls tied to Reddit content, upsells based on Reddit-derived data, or any other monetized Reddit-dependent feature without separate permission from Reddit.[2] [3]

## Reviewer evidence in this repository

| Repository artifact | Why it matters |
|---|---|
| `README.md` | Public product framing and MVP implementation status |
| `REVIEWERS.md` | Quick explanation of the current repository and intended Reddit integration |
| `reddit_api_resubmission_plan.md` | Detailed analysis of the rejection and a stronger resubmission strategy |
| `lib/source-library.tsx` | Source-agnostic library model and local-first organizational logic |
| `server/_core/oauth.ts` | Existing OAuth bridge pattern that can be extended for Reddit account linking |

## Recommended sentence for the resubmission form

> Stowry is a read-only personal organizer for a user’s own saved Reddit posts and comments. With explicit OAuth consent, the app links the user’s Reddit account, reads that same user’s saved listing, and imports those saved items into a private folder-based library for later retrieval. The app does not post, comment, vote, message, moderate, scrape outside approved API access, train models, or redistribute Reddit content as a public feed.

## References

[1]: https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy "Responsible Builder Policy – Reddit Help"
[2]: https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data "Developer Platform & Accessing Reddit Data – Reddit Help"
[3]: https://redditinc.com/policies/data-api-terms "Data API Terms – Reddit, Inc."
[4]: https://www.reddit.com/dev/api/oauth/ "reddit.com: api documentation"

# Privacy and Data Handling for Stowry

This document explains the intended privacy, storage, retention, and deletion behavior for the planned Reddit integration in **Stowry**. It is written to help reviewers understand how the app is expected to handle Reddit-linked data once Reddit OAuth and saved-item import are implemented. Reddit’s Data API Terms require an app to disclose how it collects, uses, stores, and discloses data from its users, and Reddit’s broader policies emphasize transparency, limited scope, and privacy protection.[1] [2]

## Privacy approach

Stowry is intended to operate as a **private personal organization tool**. The Reddit integration is designed so a user can connect their own Reddit account, import their own saved Reddit items, and organize them for later retrieval inside Stowry. The app is not intended to infer sensitive attributes about users, build audience profiles, or use Reddit data for advertising, resale, or model training.[1] [2]

## Data categories and intended handling

| Data category | Purpose | Intended storage approach |
|---|---|---|
| Reddit account identifier and username | Associate the connected Reddit account with the correct Stowry user | Stored in the server database when account linking is implemented |
| Reddit access token and refresh token | Maintain the authorized Reddit connection and support re-sync | Stored server-side only, not exposed in public client state |
| Saved Reddit item metadata | Preserve the item’s context for search and organization | Stored as normalized Stowry entries |
| Imported text excerpts or body text | Support personal recall and search | Stored only as needed to support the user’s private library experience |
| Sync metadata such as cursors or timestamps | Reduce unnecessary API calls and support incremental refresh | Stored server-side with the linked account or sync job state |
| User-authored notes and folder assignments | Support the user’s personal organization behavior | Stored as first-party Stowry data |

## Data use limitations

Stowry’s intended use of Reddit data is deliberately narrow.

| Use case | Stowry position |
|---|---|
| Private saved-item organization | Supported |
| Search and retrieval inside the user’s own Stowry workspace | Supported |
| Foldering and note-taking | Supported |
| Posting, commenting, voting, or messaging on Reddit | Not supported |
| Advertising or audience targeting using Reddit data | Not supported |
| Machine-learning or AI training on Reddit data | Not supported |
| Sale, relicensing, or paid redistribution of Reddit data | Not supported |
| Sensitive-attribute inference or re-identification | Not supported |

## Token handling expectations

Reddit’s terms require approved OAuth-based access and prohibit masking OAuth identity.[1] Stowry therefore intends to treat Reddit tokens as server-side secrets.

| Token-handling topic | Intended behavior |
|---|---|
| Access token storage | Stored on the server, associated with the linked Stowry user |
| Refresh token storage | Stored on the server, associated with the linked Stowry user |
| Client exposure | Tokens are not intended to be persisted in public client-side application state |
| Use in API calls | Tokens are only used for approved Reddit API requests required for identity and saved-item retrieval |
| Disconnect behavior | Disconnect revokes Stowry’s use of the stored Reddit tokens and stops future sync |
| Revocation response | If Reddit access is revoked or approval is withdrawn, Stowry should stop sync and remove stored Reddit tokens promptly |

## Imported content retention

Stowry is designed as a personal library, which means imported saved items are expected to remain available for the user’s private organization and retrieval unless the user deletes them, disconnects the account under a delete-on-disconnect policy, or Reddit requires removal.[1] [2]

Because Reddit’s Data API Terms state that stored user content must be deleted if access terminates, the implementation should be conservative and make deletion behavior explicit.[1] The safest reviewer-facing position is the following.

| Retention event | Intended behavior |
|---|---|
| Normal linked-account use | Imported Reddit-derived entries remain in the user’s private Stowry library |
| User deletes an imported item in Stowry | The deleted Stowry entry is removed from Stowry storage |
| User disconnects Reddit and chooses full removal | Reddit tokens and Reddit-derived imported entries are deleted from Stowry storage |
| User disconnects Reddit without full removal option | At minimum, tokens are deleted and Stowry should disclose clearly whether imported copies remain as user library records |
| Reddit revokes access or requires removal | Tokens are deleted, sync stops, and Reddit-derived stored content should be removed according to Reddit’s terms and any specific takedown instruction |

## User controls Stowry should expose

A reviewer-friendly implementation should make user control explicit rather than implied.

| Control | Purpose |
|---|---|
| Connect Reddit | Start an explicitly user-authorized OAuth flow |
| Re-sync saved items | Let the user refresh their imported library on demand |
| Disconnect Reddit | Stop future sync and delete stored Reddit tokens |
| Delete imported Reddit data | Remove Reddit-derived entries from the Stowry library |
| Delete the Stowry account or workspace | Remove linked-account records, tokens, and stored user data according to the app’s deletion policy |

## Sharing and disclosure posture

Stowry’s repository contains collaboration concepts, but the safest and clearest posture for Reddit review is that imported Reddit data is treated as **private to the linked user by default** unless and until Reddit confirms a broader display pattern is acceptable. The app should avoid framing imported Reddit content as something intended for broad redistribution or public republishing.[2]

## Operational safeguards

| Safeguard | Intended effect |
|---|---|
| Minimal scopes | Reduce the amount of Reddit access requested |
| Incremental sync using listing pagination | Reduce unnecessary API traffic |
| No scraping outside the approved API | Preserve compliance with Reddit’s approval model |
| No advertising or model-training use | Avoid prohibited downstream use |
| Clear privacy disclosures in-product | Align with Reddit’s Data API Terms |
| Clear deletion/disconnect controls | Improve transparency and user trust |

## Recommended disclosure sentence

> Stowry connects to a user’s Reddit account only with explicit OAuth consent and uses that access solely to import the user’s own saved Reddit posts and comments into a private library. Reddit tokens are stored server-side, used only for approved API access, and removed when the user disconnects or when access is revoked. The app does not use Reddit data for advertising, profiling, model training, resale, or public feed replacement.

## References

[1]: https://redditinc.com/policies/data-api-terms "Data API Terms – Reddit, Inc."
[2]: https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy "Responsible Builder Policy – Reddit Help"

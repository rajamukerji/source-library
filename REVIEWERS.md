# Reviewers Guide

This repository represents the current public snapshot of **Stowry**, implemented in code as **Source Library**. The purpose of this guide is to help external reviewers, including API evaluators, understand exactly what is already built, what remains planned, and how the Reddit integration fits into the broader product architecture.

## Evaluation summary

| Area | Review note |
|---|---|
| Product category | Personal library for saved internet content |
| Initial connector focus | Reddit |
| Current implementation mode | Local-first MVP |
| Current public snapshot | Product flows, data model, foldering, retrieval, and collaboration UX |
| Not yet live | Reddit OAuth, live Reddit saved-item import, durable multi-user backend sync |

## Intended Reddit use

The intended Reddit use case is narrow and read-oriented. Stowry is designed to help a user organize **their own saved Reddit content** inside a personal library interface. The app is not intended to create engagement on Reddit or automate activity within Reddit communities.

| Intended behavior | Included in product intent |
|---|---:|
| Link a Reddit account with explicit user authorization | Yes |
| Read the authenticated user’s saved content | Yes |
| Normalize saved Reddit items into Stowry library entries | Yes |
| Organize imported items into folders | Yes |
| Search and retrieve imported items later | Yes |
| Share folders inside Stowry with viewer/editor roles | Yes |
| Post to Reddit | No |
| Comment on Reddit | No |
| Vote on Reddit | No |
| Moderate communities | No |

## What reviewers can inspect in code today

The current branch is useful for reviewing the product architecture and the quality of the foundational implementation even before live Reddit connectivity is added.

| File or area | Why it matters |
|---|---|
| `lib/source-library.tsx` | Defines the source-agnostic library model, folder logic, persistence, and collaboration helpers |
| `app/(tabs)/index.tsx` | Shows dashboard framing and retrieval-oriented home experience |
| `app/(tabs)/search.tsx` | Shows retrieval, saved-view, and source-aware lookup concepts |
| `app/capture.tsx` | Shows the current manual import flow and Reddit-aware source detection |
| `app/folder/[id].tsx` | Shows sharing and viewer/editor role modeling |
| `tests/source-library.test.ts` | Shows current automated coverage of the domain helpers |
| `server/_core/oauth.ts` | Shows the existing OAuth bridge pattern that will be extended for Reddit account linking |

## Planned next implementation steps

| Step | Purpose |
|---|---|
| Add Reddit account-linking flow | Associate a user’s Stowry account with Reddit authorization |
| Persist Reddit access and refresh tokens | Support durable account linkage for sync |
| Import saved items from Reddit | Convert saved posts/comments into Stowry entries |
| Add native share-target support | Improve capture ergonomics from other mobile apps |
| Move folders and entries to server-backed sync | Enable real cross-device persistence |
| Add durable invitation and role management | Convert local collaboration UX into a real shared system |

## Development environment note

The callback path for the future Reddit OAuth flow is `/api/oauth/callback`. In the active development environment, that path is combined with the generated backend server URL for the workspace. Reviewers should therefore treat the callback as environment-specific rather than as a single permanent localhost-style URI.

## Review recommendation

If you want to evaluate the repository quickly, the most representative path is to read `README.md`, then inspect `lib/source-library.tsx`, `app/capture.tsx`, `app/folder/[id].tsx`, and `tests/source-library.test.ts`. That sequence shows the product framing, the domain model, the current Reddit-first entry path, the collaboration direction, and the current automated coverage.

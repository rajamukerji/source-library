# Stowry / Source Library

**Stowry** is a cross-platform personal library for saved internet content. The current codebase is a **Reddit-first MVP** implemented as **Source Library**, with a product architecture that can later support additional sources such as Slack, Discord, X, and generic web links.

This repository is being made public so external reviewers can evaluate the current product direction, implementation state, and the intended Reddit integration path. The present build focuses on the **library model, retrieval flows, foldering, collaboration UX, and cross-platform foundation**. Reddit OAuth and live saved-item import are the next planned integration milestone rather than functionality that is already completed in this public snapshot.

## Reviewer quick facts

| Topic | Current state |
|---|---|
| Product name | **Stowry** |
| Repository implementation name | **Source Library** |
| Platform targets | iOS, Android, and web from a shared Expo/React Native codebase |
| Current source support | Reddit-first product model with local demo content and Reddit-aware manual import |
| Reddit OAuth | Planned next milestone, not yet enabled in this public snapshot |
| Reddit saved-item sync | Planned next milestone, not yet enabled in this public snapshot |
| Native mobile share target | Planned next milestone |
| Multi-user collaboration | MVP UX and domain model are present; server-backed synchronization and invitations are planned next |
| Repository purpose | Public technical review of architecture, product scope, and implementation quality |

## What the app does

Stowry is designed to help users take content they discover on platforms such as Reddit and turn it into a structured personal library. Instead of relying on a flat saved-items list, the app organizes entries into folders, exposes notes and source metadata, supports repeat retrieval through saved views, and makes viewer-versus-editor sharing explicit.

The product is intentionally **source-agnostic**. Reddit is the first use case because the initial user need came from organizing saved Reddit items, but the underlying content model is built so additional connectors can be added without replacing the core library experience.

## What is implemented in this repository today

| Capability | Status | Notes |
|---|---:|---|
| Cross-platform shell | Implemented | Expo + React Native + Expo Router |
| Home, Inbox, Library, Search, and Shared surfaces | Implemented | Multi-screen MVP navigation and flows |
| Manual capture flow | Implemented | URL import with Reddit-aware source detection |
| Source-agnostic entry model | Implemented | Supports future connector expansion |
| Folder creation and folder detail | Implemented | Includes filing and management flows |
| Multi-folder filing | Implemented | Entries can belong to multiple folders |
| Saved views and retrieval shortcuts | Implemented | Retrieval-focused MVP behaviors |
| Local persistence | Implemented | State survives restarts through device storage |
| Collaboration modeling | Implemented as MVP UX | Viewer/editor roles, share previews, and invite drafts are represented locally |
| Automated tests | Implemented | Vitest coverage for core data-model helpers |

## What is intentionally not yet implemented in this snapshot

This public repository should be evaluated as an **MVP foundation** rather than a finished production system. Several important integrations are planned and partially designed but are not yet active in the current branch.

| Planned capability | Why it matters |
|---|---|
| Reddit OAuth account linking | Required for user-authorized Reddit access |
| Live saved-item import from Reddit | Required to replace demo/manual import with real saved data |
| Native share-sheet ingestion on Android and iOS | Required for faster cross-app capture |
| Server-backed folder sync | Required for real cross-device persistence |
| Invitation acceptance and durable multi-user roles | Required for actual viewer/editor collaboration |

## Product and API-review framing

Stowry is intended to operate as an **external companion application**, not as a subreddit bot or an in-Reddit engagement tool. The intended Reddit integration is limited to **user-authorized account linking and import of the account holder’s own saved Reddit content** for personal organization and retrieval inside Stowry.

The application is not intended to post, comment, vote, moderate, or otherwise perform social actions on Reddit on the user’s behalf. Its role is to read the authenticated user’s own saved content, preserve relevant metadata, and make that material easier to organize, retrieve, and optionally share inside Stowry’s own workspace model.

## Current screen and workflow coverage

| Screen | Purpose |
|---|---|
| Home | Overview, onboarding guidance, saved views, connector roadmap, and shortcuts |
| Inbox | Newly captured or unfiled entries awaiting organization |
| Library | Folder browsing, filing context, source filtering, and favorites filtering |
| Search | Repeat retrieval, saved views, query history, and source-scoped lookup |
| Shared | Role-filtered collaboration surface for shared material |
| Capture | Manual import with source detection and optional folder assignment |
| Entry Detail | Note-taking, folder membership, source context, and collaboration cues |
| Folder Detail | Folder-level permissions modeling, share previews, and invite drafts |

## Technical architecture

The present implementation is **local-first** so the product can be iterated quickly while preserving a path to server-backed sync. State lives in `lib/source-library.tsx`, where the repository defines the entry model, folder model, sharing helpers, retrieval helpers, and persistence logic used across the app.

| Layer | Implementation |
|---|---|
| App framework | Expo SDK 54 + React Native + Expo Router |
| Language | TypeScript |
| Styling | NativeWind |
| State management | React context provider + local helpers |
| Local persistence | `@react-native-async-storage/async-storage` |
| Testing | Vitest |
| Server capability | Present in project scaffold for future sync/auth work |
| Database capability | Present in scaffold for future collaboration and linked-account work |

## Repository structure

```text
app/
  (tabs)/
    index.tsx            # Home dashboard
    inbox.tsx            # Unfiled entries
    library.tsx          # Folder and filtered library views
    search.tsx           # Retrieval and saved views
    shared.tsx           # Collaboration surface
  capture.tsx            # Manual import flow
  entry/[id].tsx         # Entry detail
  folder/[id].tsx        # Folder detail
components/
  source-library/ui.tsx  # Shared UI components
lib/
  source-library.tsx     # Core model, persistence, filtering, sharing helpers
server/                  # Future backend surface for sync and auth work
tests/
  source-library.test.ts # Unit tests for model helpers
README.md
REVIEWERS.md
```

## Local development

Install dependencies and start the development environment with the Expo frontend and local server:

```bash
pnpm install
pnpm dev
```

Validation commands:

```bash
pnpm test
pnpm check
pnpm lint
```

## Redirect URI note for Reddit app registration

When Reddit OAuth is implemented in this environment, the current development callback path is expected to terminate on the server callback endpoint:

```text
/api/oauth/callback
```

Because the development host is environment-specific, reviewers should use the exact runtime server URL generated by the active workspace when testing. In the Manus workspace used during development, that callback is formed as the backend base URL plus `/api/oauth/callback`.

## How to evaluate this repository quickly

A reviewer who wants to understand the project efficiently should start with the product framing in this README, then inspect `lib/source-library.tsx` for the domain model, `app/(tabs)/search.tsx` for retrieval behavior, `app/folder/[id].tsx` for collaboration modeling, and `tests/source-library.test.ts` for the current automated coverage of core library logic.

## Near-term roadmap

The next milestone is to convert the current Reddit-first MVP into a live connected product by adding Reddit OAuth, Reddit saved-item import, native share-target capture, and server-backed collaboration. Those additions are already reflected in the product direction and repository structure, but they are not yet represented as complete production features in this public snapshot.

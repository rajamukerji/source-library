# Source Library

**Source Library** is a cross-platform personal library for saved links, posts, messages, and articles. The current MVP is **Reddit-first**, but the product model is intentionally source-agnostic so future connectors such as Slack, Discord, X, and generic web links can plug into the same library structure.

The app is built with **Expo**, **React Native**, **TypeScript**, and **Expo Router**, and it runs on **iOS**, **Android**, and **web** from one codebase.

## Product focus

The product starts from a simple idea: social platforms are good at helping people find things once, but not at helping them **organize**, **retrieve**, and **share** them later. Source Library turns saved content into a calmer personal workspace built around folders, notes, tags, and explicit collaboration roles.

| Capability | Current MVP status | Notes |
|---|---:|---|
| Reddit-first capture | Implemented | Manual link import with Reddit-aware source detection |
| Source-agnostic entry model | Implemented | Same core model supports Reddit, web, Slack, Discord, and X |
| Folder-based organization | Implemented | Topic folders with private, viewer, and editor modes |
| Entry detail and notes | Implemented | Each entry keeps its source context plus personal note |
| Local persistence | Implemented | Library state survives app restarts through local storage |
| Collaboration surface | Implemented as MVP UX | Folder-level role controls model read-only versus collaborative access |
| Real connector sync | Not yet implemented | Reddit OAuth and API sync are the next major milestone |
| Real multi-user sharing | Not yet implemented | Current build models sharing UX locally; server-backed collaboration is next |

## Screens

| Screen | Purpose |
|---|---|
| Home | Overview, onboarding cues, connector roadmap, pinned folders, recent items |
| Inbox | Newly captured or unfiled items waiting for organization |
| Library | Folder creation, folder browsing, and filed items |
| Search | Retrieval by title, note, tag, and source context |
| Shared | Viewer/editor collaboration model and shared items |
| Capture | Manual link import with source detection and folder assignment |
| Entry Detail | Source context, notes, folders, and item metadata |
| Folder Detail | Folder-level sharing controls and folder-scoped items |

## Technical architecture

The current build is intentionally **local-first**. State is stored in a provider under `lib/source-library.tsx`, with seeded demo content plus persistence through `AsyncStorage`. This keeps the MVP fast to iterate on while preserving the eventual product direction.

| Layer | Implementation |
|---|---|
| UI | React Native + NativeWind + Expo Router |
| Local state | React context provider in `lib/source-library.tsx` |
| Persistence | `@react-native-async-storage/async-storage` |
| Shared types and helpers | Co-located with the Source Library provider |
| Testing | Vitest for data-model logic |
| Branding | Custom icon assets and Source Library theme |

## Project structure

```text
app/
  (tabs)/
    index.tsx          # Home
    inbox.tsx          # Inbox
    library.tsx        # Folder and filed-entry browsing
    search.tsx         # Retrieval
    shared.tsx         # Collaboration surface
  capture.tsx          # Manual import flow
  entry/[id].tsx       # Entry detail
  folder/[id].tsx      # Folder detail and role management
components/
  source-library/ui.tsx
lib/
  source-library.tsx   # Core model, persistence, and helpers
tests/
  source-library.test.ts
README.md
```

## Running locally

Install dependencies and start the Expo + server development environment:

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm test     # Run vitest
pnpm check    # Run TypeScript check
pnpm lint     # Run Expo linting
pnpm android  # Open Android target
pnpm ios      # Open iOS target
```

## MVP roadmap

The current codebase is meant to be the foundation for the next milestones rather than the final architecture.

| Next milestone | Why it matters |
|---|---|
| Reddit OAuth and saved-item sync | Turns the demo capture flow into a real personal Reddit library |
| Native share target support | Improves Android and iOS capture ergonomics |
| Cloud sync and user accounts | Enables real cross-device persistence |
| Server-backed invitations and roles | Makes viewer/editor sharing real rather than modeled locally |
| Additional connectors | Expands the library beyond Reddit without changing the core mental model |

## Repository notes

This project already lives inside a git repository in the workspace. The recommended workflow is to keep feature work small, validate with tests, and capture stable milestones before publishing or connecting a remote host such as GitHub.

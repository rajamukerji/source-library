# Source Library Design

Source Library is a **mobile-first, portrait-oriented** application that should feel close to a thoughtful first-party iOS product while still adapting cleanly to Android and web. The initial release centers on the problem of saving and retrieving Reddit content, but the interface must signal a broader long-term direction as a multi-source personal library. The visual language should therefore feel calm, structured, and archival rather than social or noisy.

| Design principle | Application to Source Library |
|---|---|
| One-handed use | Primary actions live within thumb reach through bottom tabs, floating add actions, and compact sheets. |
| Calm density | The app should show rich metadata without feeling crowded by using clear type hierarchy, rounded cards, and restrained color. |
| Retrieval first | Search, filters, folder context, and note previews are prioritized over feed-like engagement patterns. |
| Source-aware but source-neutral | Reddit appears as the primary source in the MVP, but the layout should already accommodate future connectors such as Slack, Discord, X, and web links. |
| Share-safe collaboration | Shared folders and entries should display permissions clearly and avoid ambiguous edit states. |

## Screen List

The initial build should include a compact but complete set of screens that supports capture, organization, retrieval, and collaboration.

| Screen | Primary content and functionality |
|---|---|
| Home | A welcome header, quick stats, recent captures, pinned folders, and shortcuts into Inbox, Search, and Shared items. |
| Inbox | Newly captured or unfiled entries, with quick actions for filing, tagging, favoriting, and archiving. |
| Library | Folder tree or folder list, mixed-source item counts, and filtered entry lists for the selected folder. |
| Search | Keyword search, suggested filters, recent searches, and cross-source result cards. |
| Entry Detail | Source preview, Reddit metadata, user note, shared note, folder memberships, tags, and sharing controls. |
| Shared | Collections shared with the user and the user’s own shared folders or entries, with clear role labels. |
| Capture Sheet | A lightweight add flow opened from share targets or manual URL import, with folder, tag, and note fields. |
| Folder Detail | Folder metadata, collaboration state, contained entries, sort options, and member list for shared folders. |
| Settings | Reddit connection status, future connector area, theme settings, notification preferences, and privacy controls. |

## Primary Content and Functionality

The app should treat every saved item as a **library entry**. Each entry card should provide a title, source badge, source-space label such as subreddit, relative time, note snippet, and lightweight status indicators like favorite or shared. Cards should be large enough for comfortable touch but compact enough to scan quickly.

The Home screen should function as a command center rather than a dashboard full of vanity metrics. It should foreground the user’s current retrieval tasks: items waiting to be filed, most active folders, recent saves, and shared collections that changed recently. The Library screen should present folders as structured containers with calm iconography, while the Search screen should make it easy to search across title, note, and source context.

Entry Detail is the most important deep screen. It should separate **Library Context** from **Source Context**. The top section should show the saved title, preview, source badge, and open-source action. The middle should show folders, tags, notes, and sharing state. The lower section should present Reddit-specific fields such as subreddit, author, and content preview, while preserving room for future source-specific modules.

## Key User Flows

The product should support fast capture and low-friction filing while making retrieval feel reliable and controlled.

| User flow | Step-by-step path |
|---|---|
| Save from Reddit app | User taps Share in Reddit → chooses Source Library → Capture Sheet opens → selects folder and optional tags/note → saves entry into Inbox or selected folder. |
| Triage unfiled items | User opens Inbox → reviews captured entries → applies folder, tags, or archive state → entry moves into Library. |
| Retrieve saved item | User opens Search or Library → filters by folder or source → opens Entry Detail → reads note and source preview → opens original Reddit link if needed. |
| Share a folder | User opens Folder Detail → taps Share → selects collaborator role as Viewer or Editor → sends invite → folder appears in Shared for recipient. |
| Share a single entry | User opens Entry Detail → taps Share → chooses read-only or editable scope where applicable → sends invite or copies share link. |
| Review shared updates | User opens Shared tab → sees changed folders or entries → opens detail → reads updates or edits if permission allows. |

## Layout and Navigation

The mobile navigation model should use **five bottom tabs**: Home, Inbox, Library, Search, and Shared. A central floating add affordance should be visible from key screens for manual URL import or quick capture. Entry actions should open as bottom sheets where possible, because sheets fit one-handed usage better than full modals for quick filing tasks.

On web, the same information architecture should expand into a left navigation rail with a wider content pane and optional secondary panels for filters or entry previews. On mobile, the interface should remain single-column, with focused transitions between list and detail states.

## Color Choices

The visual identity should feel collected and trustworthy rather than loud. The recommended palette for the first build is a deep indigo primary paired with soft neutrals and muted utility colors.

| Token | Color | Intended use |
|---|---|---|
| Primary | `#4F46E5` | Primary actions, active states, focus accents |
| Background | `#F8FAFC` | Main app background in light mode |
| Surface | `#FFFFFF` | Cards, sheets, and elevated surfaces |
| Foreground | `#0F172A` | Primary text |
| Muted | `#64748B` | Secondary text and supporting labels |
| Border | `#E2E8F0` | Dividers and card boundaries |
| Success | `#16A34A` | Successful sync or invite acceptance |
| Warning | `#D97706` | Sync caution or partial access states |
| Error | `#DC2626` | Failures, revoked access, destructive actions |

Dark mode should preserve the same calm tone with near-slate surfaces, softened contrast, and indigo highlights that remain vivid without becoming neon.

## Interaction Notes

Quick actions such as favorite, archive, and share should use subtle haptic or pressed-state feedback on native platforms. Search, filing, and permission labels must remain highly legible and not depend solely on color. Shared resources should always display role state in text, such as **Viewer** or **Editor**, in addition to badges.

The overall feel should be that of a carefully organized reading room: quiet, deliberate, and easy to navigate, even as the app gradually expands from Reddit into a general multi-source library.

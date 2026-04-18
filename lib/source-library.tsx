import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type SourceType = "reddit" | "slack" | "discord" | "x" | "web";
export type EntryStatus = "inbox" | "filed" | "archived";
export type ShareRole = "owner" | "editor" | "viewer";

export interface Folder {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  entryIds: string[];
  sharedRole?: ShareRole;
  collaborators?: number;
  isPinned?: boolean;
}

export interface Entry {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: SourceType;
  sourceLabel: string;
  sourceSpace: string;
  author: string;
  savedAt: string;
  sourceCreatedAt: string;
  folderIds: string[];
  tags: string[];
  note: string;
  sharedNote?: string;
  favorite: boolean;
  status: EntryStatus;
  itemType: "post" | "comment" | "article" | "message";
  shareRole?: ShareRole;
  shareReason?: string;
}

export interface QuickStat {
  label: string;
  value: string;
  detail: string;
}

interface CaptureInput {
  url: string;
  title: string;
  note: string;
  folderId?: string;
  tags?: string[];
}

interface SourceLibraryContextValue {
  entries: Entry[];
  folders: Folder[];
  stats: QuickStat[];
  recentSearches: string[];
  inboxEntries: Entry[];
  sharedEntries: Entry[];
  pinnedFolders: Folder[];
  recentEntries: Entry[];
  favoriteEntries: Entry[];
  addEntry: (input: CaptureInput) => string;
  toggleFavorite: (entryId: string) => void;
  updateEntryFolder: (entryId: string, folderId: string) => void;
  archiveEntry: (entryId: string) => void;
  getEntryById: (entryId: string) => Entry | undefined;
  getFolderById: (folderId: string) => Folder | undefined;
  searchEntries: (query: string) => Entry[];
}

export const seedFolders: Folder[] = [
  {
    id: "f1",
    name: "Product Thinking",
    description: "Posts and threads worth revisiting while shaping Source Library.",
    color: "#4F46E5",
    icon: "sparkles",
    entryIds: ["e1", "e2"],
    isPinned: true,
  },
  {
    id: "f2",
    name: "Launch Research",
    description: "Reference material about product positioning and go-to-market cues.",
    color: "#0F766E",
    icon: "rocket",
    entryIds: ["e3"],
    isPinned: true,
    sharedRole: "editor",
    collaborators: 3,
  },
  {
    id: "f3",
    name: "Shared with Erin",
    description: "A collaborative folder for testing read and write sharing states.",
    color: "#D97706",
    icon: "folder-shared",
    entryIds: ["e4"],
    sharedRole: "viewer",
    collaborators: 2,
  },
];

export const seedEntries: Entry[] = [
  {
    id: "e1",
    title: "People really do want folders for saved Reddit posts",
    excerpt:
      "A recent discussion capturing why save lists break down once they become a dumping ground.",
    url: "https://www.reddit.com/r/help/comments/1g9mu8o/saved_post_categories/",
    source: "reddit",
    sourceLabel: "Reddit",
    sourceSpace: "r/help",
    author: "u/librarybuilder",
    savedAt: "2h ago",
    sourceCreatedAt: "3d ago",
    folderIds: ["f1"],
    tags: ["retrieval", "mvp"],
    note: "Useful evidence for the core pain point. Keep handy for product copy.",
    sharedNote: "Could become part of the onboarding story for collaborators.",
    favorite: true,
    status: "filed",
    itemType: "post",
    shareRole: "editor",
    shareReason: "Shared via Launch Research",
  },
  {
    id: "e2",
    title: "Designing a calm, library-like knowledge app",
    excerpt:
      "A thread on balancing discovery, curation, and retrieval without building another social feed.",
    url: "https://www.reddit.com/r/UXDesign/",
    source: "reddit",
    sourceLabel: "Reddit",
    sourceSpace: "r/UXDesign",
    author: "u/interfacearchivist",
    savedAt: "Yesterday",
    sourceCreatedAt: "5d ago",
    folderIds: ["f1"],
    tags: ["design", "ios-feel"],
    note: "Strong framing for the app tone. The retrieval-vs-feed distinction is especially good.",
    favorite: false,
    status: "filed",
    itemType: "comment",
  },
  {
    id: "e3",
    title: "Communities as a source of product research",
    excerpt:
      "An essay-like post compiling how founders mine public communities for language and unmet needs.",
    url: "https://www.reddit.com/r/startups/",
    source: "reddit",
    sourceLabel: "Reddit",
    sourceSpace: "r/startups",
    author: "u/marketmapper",
    savedAt: "2d ago",
    sourceCreatedAt: "2w ago",
    folderIds: ["f2"],
    tags: ["positioning", "research"],
    note: "Potential inspiration for the future multi-source connector story.",
    sharedNote: "Worth discussing before roadmap planning.",
    favorite: true,
    status: "filed",
    itemType: "post",
    shareRole: "editor",
    shareReason: "Shared via Launch Research",
  },
  {
    id: "e4",
    title: "Best practices for collaborative libraries",
    excerpt:
      "A practical checklist for read-only and read-write collections when multiple people curate together.",
    url: "https://www.reddit.com/r/productmanagement/",
    source: "reddit",
    sourceLabel: "Reddit",
    sourceSpace: "r/productmanagement",
    author: "u/opsreader",
    savedAt: "3d ago",
    sourceCreatedAt: "1w ago",
    folderIds: ["f3"],
    tags: ["sharing", "permissions"],
    note: "Good prompt for refining the Viewer vs Editor distinction in UI copy.",
    favorite: false,
    status: "filed",
    itemType: "post",
    shareRole: "viewer",
    shareReason: "Shared directly by Erin",
  },
  {
    id: "e5",
    title: "Slack threads should not disappear into memory",
    excerpt:
      "A placeholder future-source example showing where cross-source retrieval becomes valuable.",
    url: "https://slack.example.com/archive/p123",
    source: "slack",
    sourceLabel: "Slack",
    sourceSpace: "#product-research",
    author: "Mira",
    savedAt: "Now",
    sourceCreatedAt: "Today",
    folderIds: [],
    tags: ["future-source"],
    note: "Keep one non-Reddit card in the demo so the architecture reads as extensible, not theoretical.",
    favorite: false,
    status: "inbox",
    itemType: "message",
  },
];

export const recentSearchesSeed = ["folders", "collaboration", "product copy"];

const SourceLibraryContext = createContext<SourceLibraryContextValue | null>(null);

export function inferSourceMetadata(url: string): {
  source: SourceType;
  sourceLabel: string;
  sourceSpace: string;
} {
  const normalized = url.toLowerCase();

  if (normalized.includes("reddit.com") || normalized.includes("redd.it")) {
    const match = normalized.match(/\/r\/([^/]+)/);
    return {
      source: "reddit",
      sourceLabel: "Reddit",
      sourceSpace: match ? `r/${match[1]}` : "Reddit link",
    };
  }

  if (normalized.includes("slack")) {
    return { source: "slack", sourceLabel: "Slack", sourceSpace: "Imported link" };
  }

  if (normalized.includes("discord")) {
    return { source: "discord", sourceLabel: "Discord", sourceSpace: "Imported link" };
  }

  if (normalized.includes("x.com") || normalized.includes("twitter.com")) {
    return { source: "x", sourceLabel: "X", sourceSpace: "Imported link" };
  }

  return { source: "web", sourceLabel: "Web", sourceSpace: "Saved link" };
}

export function SourceLibraryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [folders, setFolders] = useState<Folder[]>(seedFolders);
  const [recentSearches] = useState<string[]>(recentSearchesSeed);

  const addEntry = (input: CaptureInput) => {
    const sourceMeta = inferSourceMetadata(input.url);
    const entryId = `e${Date.now()}`;
    const nextEntry: Entry = {
      id: entryId,
      title: input.title.trim() || "Untitled capture",
      excerpt: "Imported into Source Library for later review.",
      url: input.url.trim(),
      source: sourceMeta.source,
      sourceLabel: sourceMeta.sourceLabel,
      sourceSpace: sourceMeta.sourceSpace,
      author: "You",
      savedAt: "Just now",
      sourceCreatedAt: "Unknown",
      folderIds: input.folderId ? [input.folderId] : [],
      tags: input.tags ?? [],
      note: input.note.trim(),
      favorite: false,
      status: input.folderId ? "filed" : "inbox",
      itemType: sourceMeta.source === "reddit" ? "post" : "article",
    };

    setEntries((current) => [nextEntry, ...current]);

    if (input.folderId) {
      setFolders((current) =>
        current.map((folder) =>
          folder.id === input.folderId
            ? { ...folder, entryIds: [entryId, ...folder.entryIds] }
            : folder,
        ),
      );
    }

    return entryId;
  };

  const toggleFavorite = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, favorite: !entry.favorite } : entry,
      ),
    );
  };

  const updateEntryFolder = (entryId: string, folderId: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              folderIds: entry.folderIds.includes(folderId)
                ? entry.folderIds
                : [folderId, ...entry.folderIds],
              status: "filed",
            }
          : entry,
      ),
    );

    setFolders((current) =>
      current.map((folder) =>
        folder.id === folderId && !folder.entryIds.includes(entryId)
          ? { ...folder, entryIds: [entryId, ...folder.entryIds] }
          : folder,
      ),
    );
  };

  const archiveEntry = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, status: "archived" } : entry,
      ),
    );
  };

  const getEntryById = (entryId: string) => entries.find((entry) => entry.id === entryId);
  const getFolderById = (folderId: string) => folders.find((folder) => folder.id === folderId);

  const searchEntries = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries;

    return entries.filter((entry) => {
      const searchable = [
        entry.title,
        entry.excerpt,
        entry.note,
        entry.sourceLabel,
        entry.sourceSpace,
        entry.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return searchable.includes(normalized);
    });
  };

  const inboxEntries = useMemo(
    () => entries.filter((entry) => entry.status === "inbox"),
    [entries],
  );
  const sharedEntries = useMemo(
    () => entries.filter((entry) => entry.shareRole && entry.shareRole !== "owner"),
    [entries],
  );
  const pinnedFolders = useMemo(
    () => folders.filter((folder) => folder.isPinned),
    [folders],
  );
  const recentEntries = useMemo(() => entries.slice(0, 4), [entries]);
  const favoriteEntries = useMemo(
    () => entries.filter((entry) => entry.favorite),
    [entries],
  );

  const stats = useMemo<QuickStat[]>(
    () => [
      {
        label: "Library entries",
        value: String(entries.length),
        detail: `${inboxEntries.length} waiting in Inbox`,
      },
      {
        label: "Pinned folders",
        value: String(pinnedFolders.length),
        detail: `${sharedEntries.length} shared items active`,
      },
      {
        label: "Sources",
        value: String(new Set(entries.map((entry) => entry.source)).size),
        detail: "Reddit first, multi-source ready",
      },
    ],
    [entries, inboxEntries.length, pinnedFolders.length, sharedEntries.length],
  );

  const value = useMemo<SourceLibraryContextValue>(
    () => ({
      entries,
      folders,
      stats,
      recentSearches,
      inboxEntries,
      sharedEntries,
      pinnedFolders,
      recentEntries,
      favoriteEntries,
      addEntry,
      toggleFavorite,
      updateEntryFolder,
      archiveEntry,
      getEntryById,
      getFolderById,
      searchEntries,
    }),
    [entries, folders, stats, recentSearches, inboxEntries, sharedEntries, pinnedFolders, recentEntries, favoriteEntries],
  );

  return <SourceLibraryContext.Provider value={value}>{children}</SourceLibraryContext.Provider>;
}

export function useSourceLibrary() {
  const context = useContext(SourceLibraryContext);
  if (!context) {
    throw new Error("useSourceLibrary must be used inside SourceLibraryProvider");
  }
  return context;
}

export function getRoleLabel(role?: ShareRole) {
  if (!role) return "Private";
  if (role === "owner") return "Owner";
  if (role === "editor") return "Editor";
  return "Viewer";
}

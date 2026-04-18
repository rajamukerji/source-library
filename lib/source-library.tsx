import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "source-library:v1";
const APP_SHARE_BASE_URL = "https://source-library.app/share";

export type SourceType = "reddit" | "slack" | "discord" | "x" | "web";
export type EntryStatus = "inbox" | "filed" | "archived";
export type ShareRole = "owner" | "editor" | "viewer";
export type LibraryFilter = "all" | "favorites" | SourceType;

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

export interface ConnectorProfile {
  id: SourceType;
  label: string;
  status: "live" | "next" | "planned";
  detail: string;
  capabilities: string[];
}

interface CaptureInput {
  url: string;
  title: string;
  note: string;
  folderId?: string;
  tags?: string[];
}

interface CreateFolderInput {
  name: string;
  description: string;
  sharedRole?: ShareRole;
}

interface PersistedState {
  entries: Entry[];
  folders: Folder[];
  recentSearches: string[];
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
  connectors: ConnectorProfile[];
  hasHydrated: boolean;
  addEntry: (input: CaptureInput) => string;
  createFolder: (input: CreateFolderInput) => string;
  toggleFavorite: (entryId: string) => void;
  updateEntryFolder: (entryId: string, folderId: string) => void;
  toggleEntryFolderAssignment: (entryId: string, folderId: string) => void;
  archiveEntry: (entryId: string) => void;
  setFolderRole: (folderId: string, role?: ShareRole) => void;
  addRecentSearch: (query: string) => void;
  getEntryById: (entryId: string) => Entry | undefined;
  getFolderById: (folderId: string) => Folder | undefined;
  getFolderEntries: (folderId: string) => Entry[];
  searchEntries: (query: string) => Entry[];
}

const folderAccentOptions = [
  { color: "#4F46E5", icon: "sparkles" },
  { color: "#0F766E", icon: "layers" },
  { color: "#D97706", icon: "bookmark" },
  { color: "#2563EB", icon: "folder" },
  { color: "#9333EA", icon: "grid" },
];

export const libraryFilterOptions: Array<{ id: LibraryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Starred" },
  { id: "reddit", label: "Reddit" },
  { id: "web", label: "Web" },
  { id: "slack", label: "Slack" },
  { id: "discord", label: "Discord" },
  { id: "x", label: "X" },
];

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

export const connectorProfiles: ConnectorProfile[] = [
  {
    id: "reddit",
    label: "Reddit",
    status: "live",
    detail: "Primary MVP connector with manual capture and a product model ready for saved-item sync.",
    capabilities: ["Manual import", "Folder filing", "Notes", "Share roles"],
  },
  {
    id: "web",
    label: "Web links",
    status: "next",
    detail: "Generic URL capture already fits the canonical model and is the next easiest connector to deepen.",
    capabilities: ["Paste URL", "Article capture", "Tagging"],
  },
  {
    id: "slack",
    label: "Slack",
    status: "planned",
    detail: "Planned as a future connector where messages and threads become first-class library entries.",
    capabilities: ["Permalinks", "Thread context"],
  },
  {
    id: "discord",
    label: "Discord",
    status: "planned",
    detail: "Planned for server and channel capture once link parsing and auth strategy are defined.",
    capabilities: ["Message links", "Server context"],
  },
  {
    id: "x",
    label: "X",
    status: "planned",
    detail: "Planned for thread capture and social research use cases after the core library flows stabilize.",
    capabilities: ["Post links", "Thread grouping"],
  },
];

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

function getAccent(index: number) {
  return folderAccentOptions[index % folderAccentOptions.length];
}

function getHighestShareRole(roles: Array<ShareRole | undefined>): ShareRole | undefined {
  if (roles.includes("editor")) return "editor";
  if (roles.includes("viewer")) return "viewer";
  return undefined;
}

export function buildShareReason(folderNames: string[], role?: ShareRole) {
  if (!role) return undefined;
  if (folderNames.length === 0) {
    return role === "editor" ? "Shared as editable entry" : "Shared as read-only entry";
  }
  if (folderNames.length === 1) return `Shared via ${folderNames[0]}`;
  return `Shared across ${folderNames.length} folders`;
}

export function toggleFolderId(folderIds: string[], folderId: string) {
  return folderIds.includes(folderId)
    ? folderIds.filter((id) => id !== folderId)
    : [folderId, ...folderIds];
}

export function deriveEntryCollaboration(
  entry: Entry,
  folders: Folder[],
): { status: EntryStatus; shareRole?: ShareRole; shareReason?: string } {
  const relatedFolders = folders.filter((folder) => entry.folderIds.includes(folder.id));
  const role = getHighestShareRole(relatedFolders.map((folder) => folder.sharedRole));
  const status: EntryStatus = entry.folderIds.length > 0 ? "filed" : entry.status === "archived" ? "archived" : "inbox";

  return {
    status,
    shareRole: role,
    shareReason: buildShareReason(relatedFolders.map((folder) => folder.name), role),
  };
}

export function buildFolderShareLink(folder: Folder, role?: ShareRole) {
  const resolvedRole = role ?? folder.sharedRole ?? "viewer";
  return `${APP_SHARE_BASE_URL}/${folder.id}?role=${resolvedRole}`;
}

export function buildFolderInviteMessage(folder: Folder, role?: ShareRole) {
  const resolvedRole = role ?? folder.sharedRole ?? "viewer";
  const permissionLine = resolvedRole === "editor"
    ? "You can add items, organize folders, and improve notes in this shared library."
    : "You can browse and retrieve items, but not change the collection.";

  return `Join my Source Library folder \"${folder.name}\" as a ${getRoleLabel(resolvedRole)}. ${permissionLine} ${buildFolderShareLink(folder, resolvedRole)}`;
}

function syncFolderEntryIds(entries: Entry[], folders: Folder[]) {
  return folders.map((folder) => ({
    ...folder,
    entryIds: entries.filter((entry) => entry.folderIds.includes(folder.id)).map((entry) => entry.id),
  }));
}

function hydrateEntryRelationships(entries: Entry[], folders: Folder[]) {
  return entries.map((entry) => {
    const derived = deriveEntryCollaboration(entry, folders);
    return {
      ...entry,
      ...derived,
      status: derived.status,
    };
  });
}

export function filterEntries(entries: Entry[], filter: LibraryFilter) {
  if (filter === "all") return entries;
  if (filter === "favorites") return entries.filter((entry) => entry.favorite);
  return entries.filter((entry) => entry.source === filter);
}

export function SourceLibraryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(seedEntries);
  const [folders, setFolders] = useState<Folder[]>(seedFolders);
  const [recentSearches, setRecentSearches] = useState<string[]>(recentSearchesSeed);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) {
          if (mounted) setHasHydrated(true);
          return;
        }

        const parsed = JSON.parse(stored) as Partial<PersistedState>;
        if (!mounted) return;

        const nextFolders = parsed.folders?.length ? parsed.folders : seedFolders;
        const nextEntries = parsed.entries?.length ? hydrateEntryRelationships(parsed.entries, nextFolders) : seedEntries;

        setEntries(nextEntries);
        setFolders(syncFolderEntryIds(nextEntries, nextFolders));
        if (parsed.recentSearches?.length) setRecentSearches(parsed.recentSearches);
      } catch (error) {
        console.warn("Failed to hydrate Source Library state", error);
      } finally {
        if (mounted) setHasHydrated(true);
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const payload: PersistedState = {
      entries,
      folders,
      recentSearches,
    };

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch((error) => {
      console.warn("Failed to persist Source Library state", error);
    });
  }, [entries, folders, recentSearches, hasHydrated]);

  const addEntry = (input: CaptureInput) => {
    const sourceMeta = inferSourceMetadata(input.url);
    const entryId = `e${Date.now()}`;
    const initialFolderIds = input.folderId ? [input.folderId] : [];
    const relatedFolders = folders.filter((folder) => initialFolderIds.includes(folder.id));
    const role = getHighestShareRole(relatedFolders.map((folder) => folder.sharedRole));

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
      folderIds: initialFolderIds,
      tags: input.tags?.filter(Boolean) ?? [],
      note: input.note.trim(),
      favorite: false,
      status: input.folderId ? "filed" : "inbox",
      itemType: sourceMeta.source === "reddit" ? "post" : sourceMeta.source === "slack" ? "message" : "article",
      shareRole: role,
      shareReason: buildShareReason(relatedFolders.map((folder) => folder.name), role),
    };

    const nextEntries = [nextEntry, ...entries];
    const nextFolders = syncFolderEntryIds(nextEntries, folders);
    setEntries(nextEntries);
    setFolders(nextFolders);

    return entryId;
  };

  const createFolder = (input: CreateFolderInput) => {
    const folderId = `f${Date.now()}`;
    const accent = getAccent(folders.length);
    const nextFolder: Folder = {
      id: folderId,
      name: input.name.trim(),
      description: input.description.trim() || "A new topic-focused collection in Source Library.",
      color: accent.color,
      icon: accent.icon,
      entryIds: [],
      sharedRole: input.sharedRole,
      collaborators: input.sharedRole ? 2 : undefined,
      isPinned: folders.filter((folder) => folder.isPinned).length < 3,
    };

    setFolders((current) => [nextFolder, ...current]);
    return folderId;
  };

  const toggleFavorite = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, favorite: !entry.favorite } : entry,
      ),
    );
  };

  const updateEntryFolder = (entryId: string, folderId: string) => {
    const nextEntries = hydrateEntryRelationships(
      entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              folderIds: entry.folderIds.includes(folderId) ? entry.folderIds : [folderId, ...entry.folderIds],
              status: "filed",
            }
          : entry,
      ),
      folders,
    );
    setEntries(nextEntries);
    setFolders(syncFolderEntryIds(nextEntries, folders));
  };

  const toggleEntryFolderAssignment = (entryId: string, folderId: string) => {
    const nextEntries = hydrateEntryRelationships(
      entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              folderIds: toggleFolderId(entry.folderIds, folderId),
              status: entry.status === "archived" ? "archived" : entry.status,
            }
          : entry,
      ),
      folders,
    );
    setEntries(nextEntries);
    setFolders(syncFolderEntryIds(nextEntries, folders));
  };

  const archiveEntry = (entryId: string) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, status: "archived" } : entry,
      ),
    );
  };

  const setFolderRole = (folderId: string, role?: ShareRole) => {
    const nextFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            sharedRole: role,
            collaborators: role ? Math.max(folder.collaborators ?? 2, 2) : undefined,
          }
        : folder,
    );

    const nextEntries = hydrateEntryRelationships(entries, nextFolders);
    setFolders(syncFolderEntryIds(nextEntries, nextFolders));
    setEntries(nextEntries);
  };

  const addRecentSearch = (query: string) => {
    const normalized = query.trim();
    if (!normalized) return;

    setRecentSearches((current) => [normalized, ...current.filter((item) => item !== normalized)].slice(0, 6));
  };

  const getEntryById = (entryId: string) => entries.find((entry) => entry.id === entryId);
  const getFolderById = (folderId: string) => folders.find((folder) => folder.id === folderId);
  const getFolderEntries = (folderId: string) => entries.filter((entry) => entry.folderIds.includes(folderId));

  const searchEntries = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries.filter((entry) => entry.status !== "archived");

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
      return entry.status !== "archived" && searchable.includes(normalized);
    });
  };

  const inboxEntries = useMemo(() => entries.filter((entry) => entry.status === "inbox"), [entries]);
  const sharedEntries = useMemo(
    () => entries.filter((entry) => entry.shareRole && entry.shareRole !== "owner"),
    [entries],
  );
  const pinnedFolders = useMemo(() => folders.filter((folder) => folder.isPinned), [folders]);
  const recentEntries = useMemo(() => entries.filter((entry) => entry.status !== "archived").slice(0, 4), [entries]);
  const favoriteEntries = useMemo(() => entries.filter((entry) => entry.favorite), [entries]);

  const stats = useMemo<QuickStat[]>(
    () => [
      {
        label: "Library entries",
        value: String(entries.filter((entry) => entry.status !== "archived").length),
        detail: `${inboxEntries.length} waiting in Inbox`,
      },
      {
        label: "Pinned folders",
        value: String(pinnedFolders.length),
        detail: `${folders.filter((folder) => folder.sharedRole).length} shared folders active`,
      },
      {
        label: "Sources",
        value: String(new Set(entries.map((entry) => entry.source)).size),
        detail: "Reddit first, connector-ready",
      },
    ],
    [entries, folders, inboxEntries.length, pinnedFolders.length],
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
      connectors: connectorProfiles,
      hasHydrated,
      addEntry,
      createFolder,
      toggleFavorite,
      updateEntryFolder,
      toggleEntryFolderAssignment,
      archiveEntry,
      setFolderRole,
      addRecentSearch,
      getEntryById,
      getFolderById,
      getFolderEntries,
      searchEntries,
    }),
    [
      entries,
      folders,
      stats,
      recentSearches,
      inboxEntries,
      sharedEntries,
      pinnedFolders,
      recentEntries,
      favoriteEntries,
      hasHydrated,
    ],
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

import { describe, expect, it } from "vitest";

import {
  buildFolderInviteMessage,
  buildFolderShareLink,
  connectorProfiles,
  filterEntries,
  getRoleLabel,
  inferSourceMetadata,
  recentSearchesSeed,
  seedEntries,
  seedFolders,
  toggleFolderId,
} from "../lib/source-library";

describe("source library model", () => {
  it("infers Reddit metadata from subreddit URLs", () => {
    expect(inferSourceMetadata("https://www.reddit.com/r/help/comments/abc123/test")).toEqual({
      source: "reddit",
      sourceLabel: "Reddit",
      sourceSpace: "r/help",
    });
  });

  it("falls back to the web source when a URL is not matched to a known connector", () => {
    expect(inferSourceMetadata("https://example.com/article")).toEqual({
      source: "web",
      sourceLabel: "Web",
      sourceSpace: "Saved link",
    });
  });

  it("ships seed folders and entries that demonstrate the Reddit-first but source-agnostic model", () => {
    expect(seedFolders.length).toBeGreaterThanOrEqual(3);
    expect(seedEntries.some((entry) => entry.source === "reddit")).toBe(true);
    expect(seedEntries.some((entry) => entry.source === "slack")).toBe(true);
    expect(recentSearchesSeed).toContain("folders");
  });

  it("publishes a connector roadmap with Reddit as the live primary connector", () => {
    expect(connectorProfiles.find((connector) => connector.id === "reddit")?.status).toBe("live");
    expect(connectorProfiles.some((connector) => connector.id === "slack")).toBe(true);
  });

  it("toggles folder assignment ids predictably for multi-folder filing", () => {
    expect(toggleFolderId(["f1"], "f2")).toEqual(["f2", "f1"]);
    expect(toggleFolderId(["f1", "f2"], "f2")).toEqual(["f1"]);
  });

  it("builds stable viewer and editor share links for folders", () => {
    expect(buildFolderShareLink(seedFolders[1], "editor")).toContain("role=editor");
    expect(buildFolderInviteMessage(seedFolders[2], "viewer")).toContain("Viewer");
  });

  it("filters filed entries by favorites and source without changing the canonical dataset", () => {
    expect(filterEntries(seedEntries, "favorites").every((entry) => entry.favorite)).toBe(true);
    expect(filterEntries(seedEntries, "reddit").every((entry) => entry.source === "reddit")).toBe(true);
  });

  it("maps sharing roles to stable UI labels", () => {
    expect(getRoleLabel("editor")).toBe("Editor");
    expect(getRoleLabel("viewer")).toBe("Viewer");
    expect(getRoleLabel(undefined)).toBe("Private");
  });
});

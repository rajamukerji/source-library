import { describe, expect, it } from "vitest";

import {
  getRoleLabel,
  inferSourceMetadata,
  recentSearchesSeed,
  seedEntries,
  seedFolders,
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

  it("maps sharing roles to stable UI labels", () => {
    expect(getRoleLabel("editor")).toBe("Editor");
    expect(getRoleLabel("viewer")).toBe("Viewer");
    expect(getRoleLabel(undefined)).toBe("Private");
  });
});

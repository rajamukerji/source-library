import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import {
  EmptyState,
  EntryCard,
  FilterChip,
  InfoCard,
  FolderCard,
  SectionHeader,
} from "@/components/source-library/ui";
import { filterEntries, libraryFilterOptions, type LibraryFilter, type ShareRole, useSourceLibrary } from "@/lib/source-library";

const folderRoles: Array<{ label: string; value?: ShareRole }> = [
  { label: "Private" },
  { label: "Viewer", value: "viewer" },
  { label: "Editor", value: "editor" },
];

export default function LibraryScreen() {
  const { folders, entries, createFolder } = useSourceLibrary();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sharedRole, setSharedRole] = useState<ShareRole | undefined>();
  const [filter, setFilter] = useState<LibraryFilter>("all");

  const filedEntries = useMemo(
    () => filterEntries(entries.filter((entry) => entry.status === "filed"), filter),
    [entries, filter],
  );

  const handleCreateFolder = () => {
    if (!name.trim()) return;
    createFolder({
      name,
      description,
      sharedRole,
    });
    setName("");
    setDescription("");
    setSharedRole(undefined);
  };

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={filedEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-6 pb-6 pt-4">
            <SectionHeader
              title="Library"
              subtitle="Folders are the MVP unit of organization. Filters make it easier to retrieve by source or favorites without breaking that folder-first model."
            />

            <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
              <Text className="text-lg font-semibold text-foreground">Create a folder</Text>
              <Text className="text-sm leading-6 text-muted">
                Use one folder per topic or project. Shared role settings express whether collaborators can only retrieve items or also help curate them.
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Folder name"
                placeholderTextColor="#94A3B8"
                returnKeyType="done"
                className="rounded-2xl border border-border bg-background px-4 py-4 text-base text-foreground"
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What belongs in this folder?"
                placeholderTextColor="#94A3B8"
                returnKeyType="done"
                className="rounded-2xl border border-border bg-background px-4 py-4 text-base text-foreground"
              />
              <View className="flex-row flex-wrap gap-2">
                {folderRoles.map((role) => (
                  <FilterChip
                    key={role.label}
                    label={role.label}
                    active={sharedRole === role.value || (!sharedRole && !role.value)}
                    onPress={() => setSharedRole(role.value)}
                  />
                ))}
              </View>
              <Pressable
                onPress={handleCreateFolder}
                style={({ pressed }) => [{ opacity: !name.trim() || pressed ? 0.8 : 1 }]}
                disabled={!name.trim()}
                className="rounded-full bg-primary px-5 py-4"
              >
                <Text className="text-center text-base font-semibold text-white">Create folder</Text>
              </Pressable>
            </View>

            <InfoCard
              eyebrow="MVP behavior"
              title="The library model is source-agnostic"
              description="Every entry keeps its source context, but folders, tags, notes, favorites, and sharing behave consistently no matter where the item came from."
            />

            <SectionHeader
              title="Folders"
              subtitle="Tap any folder to review its entries, adjust its sharing role, or generate viewer and editor invite previews."
            />
            {folders.length === 0 ? (
              <EmptyState
                title="No folders yet"
                description="Create your first folder above to move beyond a dumping-ground save list and into a topic-based library."
              />
            ) : (
              <View className="gap-3">
                {folders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} />
                ))}
              </View>
            )}

            <SectionHeader
              title="Filed entries"
              subtitle="These items already live in at least one folder, so they are easier to recover and reuse later."
            />
            <View className="flex-row flex-wrap gap-2">
              {libraryFilterOptions.map((option) => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  active={filter === option.id}
                  onPress={() => setFilter(option.id)}
                />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={filter === "all" ? "Nothing has been filed yet" : "No entries match this filter"}
            description={
              filter === "all"
                ? "Capture a link into a folder, or move an Inbox item into one of your folders to start building the library."
                : "Try another source filter or remove the favorite filter to see more filed entries."
            }
          />
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

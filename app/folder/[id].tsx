import { Link, router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import {
  EmptyState,
  EntryCard,
  FilterChip,
  InfoCard,
  RoleBadge,
  SectionHeader,
} from "@/components/source-library/ui";
import { buildFolderInviteMessage, buildFolderShareLink, type ShareRole, useSourceLibrary } from "@/lib/source-library";

const roleOptions: Array<{ label: string; value?: ShareRole }> = [
  { label: "Private" },
  { label: "Viewer", value: "viewer" },
  { label: "Editor", value: "editor" },
];

export default function FolderDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { getFolderById, getFolderEntries, setFolderRole } = useSourceLibrary();
  const folder = getFolderById(params.id);
  const [inviteRole, setInviteRole] = useState<ShareRole>(folder?.sharedRole === "editor" ? "editor" : "viewer");

  if (!folder) {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Text className="text-lg font-semibold text-foreground">Folder not found</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          className="mt-4 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">Go back</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const folderEntries = getFolderEntries(folder.id);
  const shareLink = useMemo(() => buildFolderShareLink(folder, inviteRole), [folder, inviteRole]);
  const inviteMessage = useMemo(() => buildFolderInviteMessage(folder, inviteRole), [folder, inviteRole]);

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={folderEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-6 pb-6 pt-4">
            <View className="flex-row items-center justify-between gap-3">
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                className="rounded-full border border-border bg-surface px-4 py-2"
              >
                <Text className="font-semibold text-foreground">Back</Text>
              </Pressable>
              {folder.sharedRole ? <RoleBadge role={folder.sharedRole} /> : null}
            </View>

            <InfoCard eyebrow="Folder" title={folder.name} description={folder.description}>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground">{folder.entryIds.length} items</Text>
                <Text className="text-sm text-muted">
                  {folder.collaborators ? `${folder.collaborators} collaborators` : "Private space"}
                </Text>
              </View>
            </InfoCard>

            <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
              <SectionHeader
                title="Sharing mode"
                subtitle="Use viewer for read-only access or editor when collaborators should be able to file and annotate items."
              />
              <View className="flex-row flex-wrap gap-2">
                {roleOptions.map((option) => (
                  <FilterChip
                    key={option.label}
                    label={option.label}
                    active={folder.sharedRole === option.value || (!folder.sharedRole && !option.value)}
                    onPress={() => setFolderRole(folder.id, option.value)}
                  />
                ))}
              </View>
            </View>

            <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
              <SectionHeader
                title="Invite preview"
                subtitle="This MVP keeps collaboration local-first, but the invite language and share links already model the product behavior you would later back with the server."
              />
              <View className="flex-row flex-wrap gap-2">
                <FilterChip label="Viewer link" active={inviteRole === "viewer"} onPress={() => setInviteRole("viewer")} />
                <FilterChip label="Editor link" active={inviteRole === "editor"} onPress={() => setInviteRole("editor")} />
              </View>
              <View className="rounded-2xl bg-background px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[1.6px] text-muted">Share link</Text>
                <Text className="mt-2 text-sm leading-6 text-foreground">{shareLink}</Text>
              </View>
              <View className="rounded-2xl bg-background px-4 py-4">
                <Text className="text-xs font-semibold uppercase tracking-[1.6px] text-muted">Invite copy</Text>
                <Text className="mt-2 text-sm leading-6 text-foreground">{inviteMessage}</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <Link href={{ pathname: "/capture", params: { folderId: folder.id } }} asChild>
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="flex-1 rounded-full bg-primary px-5 py-4"
                >
                  <Text className="text-center text-base font-semibold text-white">Capture into folder</Text>
                </Pressable>
              </Link>
              <Link href="/shared" asChild>
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="rounded-full border border-border bg-background px-5 py-4"
                >
                  <Text className="text-base font-semibold text-foreground">Shared view</Text>
                </Pressable>
              </Link>
            </View>

            <SectionHeader
              title="Folder entries"
              subtitle="This folder is the MVP unit of organization and sharing, regardless of where items originated."
            />
            {folderEntries.length === 0 ? (
              <EmptyState
                title="This folder is still empty"
                description="Capture a Reddit link or another source URL into this folder to start building a reusable collection."
                action={
                  <Link href={{ pathname: "/capture", params: { folderId: folder.id } }} asChild>
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                      className="rounded-full bg-primary px-5 py-3"
                    >
                      <Text className="text-center font-semibold text-white">Add first item</Text>
                    </Pressable>
                  </Link>
                }
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

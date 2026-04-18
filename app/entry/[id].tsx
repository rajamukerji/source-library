import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { FilterChip, RoleBadge, SectionHeader, SourceBadge } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function EntryDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { getEntryById, folders, toggleFavorite } = useSourceLibrary();
  const entry = getEntryById(params.id);

  if (!entry) {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Text className="text-lg font-semibold text-foreground">Entry not found</Text>
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

  const entryFolders = folders.filter((folder) => entry.folderIds.includes(folder.id));

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="px-5 pb-8">
      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between pt-4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            className="rounded-full border border-border bg-surface px-4 py-2"
          >
            <Text className="font-semibold text-foreground">Back</Text>
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(entry.id)}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            className="rounded-full border border-border bg-surface px-4 py-2"
          >
            <Text className="font-semibold text-foreground">{entry.favorite ? "Unstar" : "Star"}</Text>
          </Pressable>
        </View>

        <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
          <View className="flex-row flex-wrap items-center gap-2">
            <SourceBadge source={entry.source} />
            {entry.shareRole ? <RoleBadge role={entry.shareRole} /> : null}
            <Text className="text-xs font-medium text-muted">{entry.sourceSpace}</Text>
          </View>
          <Text className="text-3xl font-semibold leading-tight text-foreground">{entry.title}</Text>
          <Text className="text-base leading-7 text-muted">{entry.excerpt}</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => Linking.openURL(entry.url)}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              className="flex-1 rounded-full bg-primary px-5 py-4"
            >
              <Text className="text-center text-base font-semibold text-white">Open source</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/capture")}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              className="rounded-full border border-border bg-background px-5 py-4"
            >
              <Text className="text-base font-semibold text-foreground">Add another</Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
          <SectionHeader title="Library context" subtitle="Why this exists in your library matters as much as the source itself." />
          <View className="flex-row flex-wrap gap-2">
            {entryFolders.map((folder) => (
              <FilterChip key={folder.id} label={folder.name} active />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <FilterChip key={tag} label={`#${tag}`} />
            ))}
          </View>
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Personal note</Text>
            <Text className="text-sm leading-6 text-muted">{entry.note}</Text>
          </View>
          {entry.sharedNote ? (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Shared note</Text>
              <Text className="text-sm leading-6 text-muted">{entry.sharedNote}</Text>
            </View>
          ) : null}
        </View>

        <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
          <SectionHeader title="Source context" subtitle="The library is source-agnostic, but it should never hide where the item came from." />
          <View className="gap-3">
            <DetailRow label="Source" value={entry.sourceLabel} />
            <DetailRow label="Source space" value={entry.sourceSpace} />
            <DetailRow label="Author" value={entry.author} />
            <DetailRow label="Saved" value={entry.savedAt} />
            <DetailRow label="Originally posted" value={entry.sourceCreatedAt} />
            <DetailRow label="Access reason" value={entry.shareReason ?? "Private to you"} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <Text className="max-w-[60%] text-right text-sm leading-6 text-muted">{value}</Text>
    </View>
  );
}

import { FlatList, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { EntryCard, FolderCard, SectionHeader } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function LibraryScreen() {
  const { folders, entries } = useSourceLibrary();
  const filedEntries = entries.filter((entry) => entry.status === "filed");

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={filedEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-6 pb-6 pt-4">
            <SectionHeader
              title="Library"
              subtitle="Topic-based folders sit above source platforms, so Reddit is useful now without constraining future sources."
            />
            <View className="gap-3">
              {folders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </View>
            <View className="rounded-3xl border border-border bg-surface p-5">
              <Text className="text-sm font-semibold uppercase tracking-[2px] text-primary">Architecture cue</Text>
              <Text className="mt-3 text-lg font-semibold text-foreground">The library model is source-agnostic.</Text>
              <Text className="mt-2 text-sm leading-6 text-muted">
                Every entry keeps its source context, but folders, tags, notes, and sharing behave the same way no matter where the item came from.
              </Text>
            </View>
            <SectionHeader
              title="Filed entries"
              subtitle="These cards are optimized for retrieval: source context, folder context, and the reason you saved them."
            />
          </View>
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

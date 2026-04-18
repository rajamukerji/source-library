import { FlatList, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { EntryCard, FolderCard, SectionHeader, StatCard } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function HomeScreen() {
  const { stats, recentEntries, pinnedFolders, favoriteEntries } = useSourceLibrary();

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={recentEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-6 pb-6 pt-4">
            <View className="gap-3">
              <Text className="text-sm font-semibold uppercase tracking-[2px] text-primary">Source Library</Text>
              <Text className="text-4xl font-semibold leading-tight text-foreground">
                Save Reddit now, grow into a multi-source library later.
              </Text>
              <Text className="text-base leading-7 text-muted">
                Organize posts, preserve notes, and share folders with clear read or write roles.
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
              ))}
            </View>

            <View className="flex-row gap-3">
              <Link href="/capture" asChild>
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
                  className="flex-1 rounded-full bg-primary px-5 py-4"
                >
                  <Text className="text-center text-base font-semibold text-white">Capture a link</Text>
                </Pressable>
              </Link>
              <Link href="/library" asChild>
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
                  className="rounded-full border border-border bg-surface px-5 py-4"
                >
                  <Text className="text-base font-semibold text-foreground">Browse library</Text>
                </Pressable>
              </Link>
            </View>

            <SectionHeader
              title="Pinned folders"
              subtitle="Collections that reflect the Reddit-first MVP and future connector direction."
            />
            <View className="gap-3">
              {pinnedFolders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </View>

            <SectionHeader
              title="Starred references"
              subtitle="A quick set of items you are likely to reopen while shaping the product."
            />
            <View className="gap-3">
              {favoriteEntries.slice(0, 2).map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </View>

            <SectionHeader
              title="Recent captures"
              subtitle="The most recent items across sources, ordered for quick retrieval."
            />
          </View>
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

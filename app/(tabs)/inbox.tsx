import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { EmptyState, EntryCard, FilterChip, SectionHeader } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function InboxScreen() {
  const { inboxEntries, archiveEntry, updateEntryFolder, folders } = useSourceLibrary();
  const defaultFolder = folders[0];

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={inboxEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-5 pb-6 pt-4">
            <SectionHeader
              title="Inbox"
              subtitle="Low-friction capture lands here first, so you can file links when you have a spare minute instead of organizing on the spot."
            />
            <View className="flex-row flex-wrap gap-2">
              <FilterChip label={`${inboxEntries.length} waiting`} active />
              <FilterChip label="Reddit first" />
              <FilterChip label="Multi-source ready" />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            footer={
              <View className="flex-row gap-3">
                {defaultFolder ? (
                  <Pressable
                    onPress={() => updateEntryFolder(item.id, defaultFolder.id)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                    className="flex-1 rounded-full bg-primary px-4 py-3"
                  >
                    <Text className="text-center text-sm font-semibold text-white">File to {defaultFolder.name}</Text>
                  </Pressable>
                ) : (
                  <Link href="/library" asChild>
                    <Pressable
                      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                      className="flex-1 rounded-full bg-primary px-4 py-3"
                    >
                      <Text className="text-center text-sm font-semibold text-white">Create a folder</Text>
                    </Pressable>
                  </Link>
                )}
                <Pressable
                  onPress={() => archiveEntry(item.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="rounded-full border border-border bg-surface px-4 py-3"
                >
                  <Text className="text-sm font-semibold text-foreground">Archive</Text>
                </Pressable>
              </View>
            }
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListEmptyComponent={
          <EmptyState
            title="Inbox cleared"
            description="New captures will appear here until you file them into a folder. Use Capture when you want to add another Reddit or web link."
            action={
              <Link href="/capture" asChild>
                <Pressable
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="rounded-full bg-primary px-5 py-3"
                >
                  <Text className="text-center font-semibold text-white">Capture another link</Text>
                </Pressable>
              </Link>
            }
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

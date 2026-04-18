import { FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { EntryCard, FilterChip, SectionHeader } from "@/components/source-library/ui";
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
              subtitle="Low-friction capture lands here first, so you can file links when you have a spare minute."
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
                <Pressable
                  onPress={() => updateEntryFolder(item.id, defaultFolder.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                  className="flex-1 rounded-full bg-primary px-4 py-3"
                >
                  <Text className="text-center text-sm font-semibold text-white">File to {defaultFolder.name}</Text>
                </Pressable>
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
          <View className="rounded-3xl border border-border bg-surface p-6">
            <Text className="text-lg font-semibold text-foreground">Inbox cleared</Text>
            <Text className="mt-2 text-sm leading-6 text-muted">
              New captures will appear here until you file them into a folder.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

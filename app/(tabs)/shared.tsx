import { FlatList, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { EntryCard, FolderCard, SectionHeader } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function SharedScreen() {
  const { sharedEntries, folders } = useSourceLibrary();
  const sharedFolders = folders.filter((folder) => folder.sharedRole);

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={sharedEntries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-6 pb-6 pt-4">
            <SectionHeader
              title="Shared"
              subtitle="Collaborative folders and entries carry explicit roles so read-only and read-write states remain obvious."
            />
            <View className="gap-3">
              {sharedFolders.map((folder) => (
                <FolderCard key={folder.id} folder={folder} />
              ))}
            </View>
            <View className="rounded-3xl border border-border bg-surface p-5">
              <Text className="text-lg font-semibold text-foreground">Read and write permissions</Text>
              <Text className="mt-2 text-sm leading-6 text-muted">
                Viewer roles can browse and retrieve. Editor roles can add or adjust curation metadata inside the shared scope. Owners keep destructive controls.
              </Text>
            </View>
            <SectionHeader
              title="Shared entries"
              subtitle="Each card shows why the item is visible to you, making collaboration easier to trust."
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

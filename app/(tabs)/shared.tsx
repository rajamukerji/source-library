import { FlatList, Text, View } from "react-native";
import { Link } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import {
  EmptyState,
  EntryCard,
  FolderCard,
  InfoCard,
  SectionHeader,
} from "@/components/source-library/ui";
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
              subtitle="Collaborative folders and entries carry explicit roles so read-only and read-write states remain obvious across mobile and web."
            />

            <InfoCard
              eyebrow="Permission model"
              title="Viewer versus Editor"
              description="Viewer roles can browse and retrieve. Editor roles can add items, file content into folders, and improve notes inside the shared scope. Owners keep destructive controls for the future synced version."
            />

            <SectionHeader
              title="Shared folders"
              subtitle="Tap a folder to review its entries and adjust its sharing role. In the current MVP, the role change updates all entries inside that folder."
            />
            {sharedFolders.length === 0 ? (
              <EmptyState
                title="No shared folders yet"
                description="Create a folder in the Library tab and mark it as Viewer or Editor to start testing collaboration behavior."
              />
            ) : (
              <View className="gap-3">
                {sharedFolders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} />
                ))}
              </View>
            )}

            <SectionHeader
              title="Shared entries"
              subtitle="Each card shows why the item is visible to you, making collaboration easier to trust and reason about."
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nothing is shared yet"
            description="Once a folder is switched to Viewer or Editor, its entries will appear here with explicit access context."
          />
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

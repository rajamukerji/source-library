import { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import {
  ConnectorCard,
  FilterChip,
  InfoCard,
  SectionHeader,
  SourceBadge,
} from "@/components/source-library/ui";
import { inferSourceMetadata, useSourceLibrary } from "@/lib/source-library";

const suggestedTags = ["research", "shareable", "buy-later", "retrieval", "collab"];

export default function CaptureScreen() {
  const params = useLocalSearchParams<{ folderId?: string }>();
  const { addEntry, folders, connectors } = useSourceLibrary();
  const initialFolder = useMemo(
    () => folders.find((folder) => folder.id === params.folderId)?.id,
    [folders, params.folderId],
  );

  const [url, setUrl] = useState("https://www.reddit.com/r/help/comments/1g9mu8o/saved_post_categories/");
  const [title, setTitle] = useState("Saved post categories and why people want better organization");
  const [note, setNote] = useState("Useful evidence for the Reddit-first capture story.");
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(initialFolder);
  const [selectedTags, setSelectedTags] = useState<string[]>(["research"]);

  const sourceMeta = useMemo(() => inferSourceMetadata(url), [url]);

  const handleSave = () => {
    const entryId = addEntry({
      url,
      title,
      note,
      folderId: selectedFolderId,
      tags: selectedTags,
    });
    router.replace({ pathname: "/entry/[id]", params: { id: entryId } });
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} className="bg-background px-5 pb-8 pt-4">
      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Capture a source"
          subtitle="The MVP is Reddit-first, but the import model is already built to normalize future sources into the same library structure."
        />

        <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
          <Text className="text-sm font-semibold text-foreground">Source URL</Text>
          <TextInput
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            placeholder="Paste a Reddit, Slack, Discord, X, or web link"
            placeholderTextColor="#94A3B8"
            className="rounded-2xl border border-border bg-background px-4 py-4 text-base text-foreground"
          />
          <View className="flex-row items-center gap-2">
            <SourceBadge source={sourceMeta.source} />
            <Text className="text-sm text-muted">Detected source space: {sourceMeta.sourceSpace}</Text>
          </View>
        </View>

        <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
          <Text className="text-sm font-semibold text-foreground">Display title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Add a title for this entry"
            placeholderTextColor="#94A3B8"
            className="rounded-2xl border border-border bg-background px-4 py-4 text-base text-foreground"
          />
          <Text className="text-sm font-semibold text-foreground">Why save this?</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add context for your future self or collaborators"
            placeholderTextColor="#94A3B8"
            multiline
            className="min-h-[120px] rounded-2xl border border-border bg-background px-4 py-4 text-base leading-6 text-foreground"
          />
        </View>

        <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
          <Text className="text-sm font-semibold text-foreground">Choose a folder</Text>
          <View className="flex-row flex-wrap gap-2">
            <FilterChip
              label="Leave in Inbox"
              active={!selectedFolderId}
              onPress={() => setSelectedFolderId(undefined)}
            />
            {folders.map((folder) => (
              <FilterChip
                key={folder.id}
                label={folder.name}
                active={selectedFolderId === folder.id}
                onPress={() => setSelectedFolderId(folder.id)}
              />
            ))}
          </View>
          <Text className="text-sm font-semibold text-foreground">Suggested tags</Text>
          <View className="flex-row flex-wrap gap-2">
            {suggestedTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <FilterChip
                  key={tag}
                  label={tag}
                  active={active}
                  onPress={() =>
                    setSelectedTags((current) =>
                      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
                    )
                  }
                />
              );
            })}
          </View>
        </View>

        <InfoCard
          eyebrow="Import behavior"
          title="Capture now, enrich later"
          description="Manual import is the first MVP path. The same entry model is ready for future native share targets, sync connectors, and richer metadata extraction."
        />

        <SectionHeader
          title="Connector status"
          subtitle="This screen keeps the future visible so the product does not feel artificially limited to Reddit forever."
        />
        <View className="gap-3">
          {connectors.slice(0, 3).map((connector) => (
            <ConnectorCard key={connector.id} connector={connector} />
          ))}
        </View>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            className="flex-1 rounded-full border border-border bg-surface px-5 py-4"
          >
            <Text className="text-center text-base font-semibold text-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            className="flex-1 rounded-full bg-primary px-5 py-4"
          >
            <Text className="text-center text-base font-semibold text-white">Save entry</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

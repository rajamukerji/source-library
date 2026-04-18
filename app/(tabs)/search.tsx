import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { EmptyState, EntryCard, FilterChip, InfoCard, SectionHeader } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function SearchScreen() {
  const { searchEntries, recentSearches, addRecentSearch } = useSourceLibrary();
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchEntries(query), [query, searchEntries]);

  const handleSubmit = () => {
    addRecentSearch(query);
  };

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-5 pb-6 pt-4">
            <SectionHeader
              title="Search"
              subtitle="Search title, notes, tags, and source context to recover saved items in seconds instead of guessing where you left them."
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder="Search folders, notes, tags, or subreddits"
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              className="rounded-3xl border border-border bg-surface px-5 py-4 text-base text-foreground"
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
                className="rounded-full bg-primary px-5 py-3"
              >
                <Text className="font-semibold text-white">Save search</Text>
              </Pressable>
              {query ? (
                <Pressable
                  onPress={() => setQuery("")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
                  className="rounded-full border border-border bg-surface px-5 py-3"
                >
                  <Text className="font-semibold text-foreground">Clear</Text>
                </Pressable>
              ) : null}
            </View>
            <View className="flex-row flex-wrap gap-2">
              {recentSearches.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  onPress={() => setQuery(item)}
                  active={query === item}
                />
              ))}
            </View>
            <InfoCard
              eyebrow="Retrieval model"
              title="Search works across source and structure"
              description="The MVP already searches titles, notes, tags, and source labels together, which is why a mixed-source library can still feel coherent."
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No matches yet"
            description="Try a subreddit name, a tag such as #research, or a phrase from the note you wrote when saving the entry."
          />
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

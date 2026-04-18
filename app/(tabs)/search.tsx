import { useMemo, useState } from "react";
import { FlatList, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { EntryCard, FilterChip, SectionHeader } from "@/components/source-library/ui";
import { useSourceLibrary } from "@/lib/source-library";

export default function SearchScreen() {
  const { searchEntries, recentSearches } = useSourceLibrary();
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchEntries(query), [query, searchEntries]);

  return (
    <ScreenContainer className="px-5 pb-6">
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-5 pb-6 pt-4">
            <SectionHeader
              title="Search"
              subtitle="Search title, notes, tags, and source context to recover saved items in seconds."
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search folders, notes, or subreddits"
              placeholderTextColor="#94A3B8"
              returnKeyType="search"
              className="rounded-3xl border border-border bg-surface px-5 py-4 text-base text-foreground"
            />
            <View className="flex-row flex-wrap gap-2">
              {recentSearches.map((item) => (
                <FilterChip key={item} label={item} onPress={() => setQuery(item)} active={query === item} />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

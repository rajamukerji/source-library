import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { getRoleLabel, type Entry, type Folder, type SourceType } from "@/lib/source-library";
import { cn } from "@/lib/utils";

const sourceStyles: Record<SourceType, { label: string; className: string }> = {
  reddit: { label: "Reddit", className: "bg-orange-100 text-orange-700" },
  slack: { label: "Slack", className: "bg-violet-100 text-violet-700" },
  discord: { label: "Discord", className: "bg-indigo-100 text-indigo-700" },
  x: { label: "X", className: "bg-slate-200 text-slate-700" },
  web: { label: "Web", className: "bg-sky-100 text-sky-700" },
};

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="gap-1">
      <Text className="text-xl font-semibold text-foreground">{title}</Text>
      {subtitle ? <Text className="text-sm leading-5 text-muted">{subtitle}</Text> : null}
    </View>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View className="min-w-[160px] flex-1 rounded-3xl border border-border bg-surface p-4">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="mt-2 text-3xl font-semibold text-foreground">{value}</Text>
      <Text className="mt-2 text-sm leading-5 text-muted">{detail}</Text>
    </View>
  );
}

export function FilterChip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      className={cn(
        "rounded-full border px-4 py-2",
        active ? "border-primary bg-primary/10" : "border-border bg-surface",
      )}
    >
      <Text className={cn("text-sm font-medium", active ? "text-primary" : "text-foreground")}>
        {label}
      </Text>
    </Pressable>
  );
}

export function RoleBadge({ role }: { role?: "owner" | "editor" | "viewer" }) {
  const label = getRoleLabel(role);
  const className = role === "editor"
    ? "bg-indigo-100 text-indigo-700"
    : role === "viewer"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return (
    <View className={cn("rounded-full px-3 py-1", className)}>
      <Text className="text-xs font-semibold">{label}</Text>
    </View>
  );
}

export function SourceBadge({ source }: { source: SourceType }) {
  const style = sourceStyles[source];

  return (
    <View className={cn("rounded-full px-3 py-1", style.className)}>
      <Text className="text-xs font-semibold">{style.label}</Text>
    </View>
  );
}

export function FolderCard({ folder }: { folder: Folder }) {
  return (
    <Link href={{ pathname: "/capture", params: { folderId: folder.id } }} asChild>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}
        className="rounded-3xl border border-border bg-surface p-4"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-lg font-semibold text-foreground">{folder.name}</Text>
            <Text className="text-sm leading-5 text-muted">{folder.description}</Text>
          </View>
          {folder.sharedRole ? <RoleBadge role={folder.sharedRole} /> : null}
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-foreground">{folder.entryIds.length} items</Text>
          <Text className="text-sm text-muted">
            {folder.collaborators ? `${folder.collaborators} people` : "Private"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export function EntryCard({
  entry,
  footer,
}: {
  entry: Entry;
  footer?: React.ReactNode;
}) {
  return (
    <Link href={{ pathname: "/entry/[id]", params: { id: entry.id } }} asChild>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}
        className="rounded-3xl border border-border bg-surface p-4"
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-3">
            <View className="flex-row flex-wrap items-center gap-2">
              <SourceBadge source={entry.source} />
              <Text className="text-xs font-medium text-muted">{entry.sourceSpace}</Text>
              {entry.shareRole ? <RoleBadge role={entry.shareRole} /> : null}
            </View>
            <View className="gap-2">
              <Text className="text-lg font-semibold leading-6 text-foreground">{entry.title}</Text>
              <Text className="text-sm leading-5 text-muted">{entry.excerpt}</Text>
            </View>
          </View>
          {entry.favorite ? (
            <View className="rounded-full bg-amber-100 px-3 py-1">
              <Text className="text-xs font-semibold text-amber-700">Starred</Text>
            </View>
          ) : null}
        </View>
        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          {entry.tags.map((tag) => (
            <View key={tag} className="rounded-full bg-slate-100 px-3 py-1">
              <Text className="text-xs font-medium text-slate-600">#{tag}</Text>
            </View>
          ))}
        </View>
        <Text className="mt-4 text-sm leading-5 text-foreground">{entry.note}</Text>
        <View className="mt-4 flex-row items-center justify-between gap-3">
          <Text className="text-xs text-muted">Saved {entry.savedAt}</Text>
          <Text className="text-xs text-muted">by {entry.author}</Text>
        </View>
        {footer ? <View className="mt-4">{footer}</View> : null}
      </Pressable>
    </Link>
  );
}

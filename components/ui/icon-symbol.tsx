import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "tray.full.fill": "inbox",
  "books.vertical.fill": "folder-copy",
  magnifyingglass: "search",
  "person.2.fill": "groups",
  plus: "add",
  star: "star-border",
  "star.fill": "star",
  folder: "folder",
  "square.and.arrow.up.fill": "ios-share",
  "ellipsis.bubble.fill": "forum",
  link: "link",
  "chevron.right": "chevron-right",
  paperplane: "send",
  sparkles: "auto-awesome",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

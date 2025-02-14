import type { AutoLink, TextItem } from "./utils.js";

export type HopeThemeSidebarPageItem = AutoLink;

export interface HopeThemeSidebarGroupItem extends TextItem {
  prefix?: string;
  link?: string;
  collapsible?: boolean;
  children: (
    | HopeThemeSidebarPageItem
    | HopeThemeSidebarGroupItem
    | HopeThemeSidebarStructureItem
    | string
  )[];
}

export interface HopeThemeSidebarStructureItem extends TextItem {
  prefix: string;
  link?: string;
  collapsible?: boolean;
  children: "structure";
}

export type HopeThemeSidebarItem =
  | HopeThemeSidebarPageItem
  | HopeThemeSidebarGroupItem
  | HopeThemeSidebarStructureItem
  | string;

export type HopeThemeSidebarArrayConfig = HopeThemeSidebarItem[];

export type HopeThemeSidebarObjectConfig = Record<
  string,
  HopeThemeSidebarArrayConfig | "structure" | false
>;

export type HopeThemeSidebarConfig =
  | HopeThemeSidebarArrayConfig
  | HopeThemeSidebarObjectConfig;

// resolved
export interface ResolvedHopeThemeSidebarHeaderItem
  extends HopeThemeSidebarPageItem {
  type: "heading";
  children: ResolvedHopeThemeSidebarHeaderItem[];
}

export interface ResolvedHopeThemeSidebarPageItem
  extends HopeThemeSidebarPageItem {
  type: "page";
  children: ResolvedHopeThemeSidebarHeaderItem[];
}

export interface ResolvedHopeThemeSidebarGroupItem
  extends HopeThemeSidebarGroupItem {
  type: "group";
  prefix: string;
  children: ResolvedSidebarItem[];
}

export type ResolvedSidebarItem =
  | ResolvedHopeThemeSidebarHeaderItem
  | ResolvedHopeThemeSidebarPageItem
  | ResolvedHopeThemeSidebarGroupItem;

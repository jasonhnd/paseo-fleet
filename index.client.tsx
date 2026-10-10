import type { PluginClientContext, PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { FleetSettings } from "./client/settings";
import { rememberedLanguage } from "./client/settings-language";
import { resolveLanguage, setLanguage, t } from "./shared/i18n";
import { RoleBoard } from "./client/board";

/** Same id as the old surface and sidebar item, so saved /plugin/agent-fleet-cockpit/board links still open AFC. */
const SCREEN_ID = "board";
const TITLE = "Agent Fleet Cockpit";
const ICON = "Users";

function BoardItem({ currentScreen, openScreen }: PluginSidebarItemProps) {
  return <SidebarRow icon={ICON} active={currentScreen?.screenId === SCREEN_ID} onPress={() => openScreen({ screenId: SCREEN_ID })} />;
}

export default function contribute(client: PluginClientContext) {
  setLanguage(rememberedLanguage() ?? resolveLanguage("system"));
  // The host stores the title at registration; body labels update after configuration reads.
  client.addSettingsScreen({ id: "settings", title: t("settings.title"), icon: "Settings", Component: FleetSettings });
  client.addScreen({ id: SCREEN_ID, title: TITLE, Component: RoleBoard });
  client.addSidebarHeaderItem({ id: SCREEN_ID, title: TITLE, Component: BoardItem });
  return () => {};
}

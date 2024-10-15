import { List, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import { useLinks } from "../hooks/useLinks";
import { LinkItem } from "./LinkItem";
import { useTranslation } from "../hooks/useTranslation";
import { useConfig } from "../hooks/useConfig";

export function LinkListView() {
  const {
    links,
    isLoading: isLinksLoading,
    refreshLinks,
    cleanCache,
  } = useLinks();
  const { t } = useTranslation();
  const { config, isLoading: isConfigLoading, updateConfig } = useConfig();

  const listTitle = `${t.linkListCount} (${links?.length || 0})`;
  if (isConfigLoading) {
    return <List isLoading={true} />;
  }

  return (
    <List
      isLoading={isLinksLoading}
      searchBarPlaceholder={t.searchBarPlaceholder}
      throttle>
      <List.Section title={listTitle}>
        {links.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            config={config}
            onRefresh={refreshLinks}
            onCleanCache={cleanCache}
            updateConfig={updateConfig}
          />
        ))}
      </List.Section>
    </List>
  );
}

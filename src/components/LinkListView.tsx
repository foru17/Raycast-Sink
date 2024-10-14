import { List, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";
import { useLinks } from "../hooks/useLinks";
import { LinkItem } from "./LinkItem";
import { useTranslation } from "../hooks/useTranslation";

export function LinkListView() {
  const { links, isLoading, refreshLinks, cleanCache } = useLinks();
  const { t } = useTranslation();
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);

  useEffect(() => {
    const loadShowWebsitePreview = async () => {
      const value = await LocalStorage.getItem<string>("showWebsitePreview");
      setShowWebsitePreview(value === "true");
    };
    loadShowWebsitePreview();
  }, []);

  const listTitle = `${t.linkListCount} (${links?.length || 0})`;

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={t.searchBarPlaceholder}
      throttle>
      <List.Section title={listTitle}>
        {links.map((link) => (
          <LinkItem
            key={link.id}
            link={link}
            showWebsitePreview={showWebsitePreview}
            onRefresh={refreshLinks}
            onCleanCache={cleanCache}
          />
        ))}
      </List.Section>
    </List>
  );
}

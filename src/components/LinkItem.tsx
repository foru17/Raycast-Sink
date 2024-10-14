import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Link } from "../types";
import { useTranslation } from "../hooks/useTranslation";
import { useConfig } from "../hooks/useConfig";

interface LinkItemProps {
  link: Link;
  showWebsitePreview: boolean;
  onRefresh: () => void;
  onCleanCache: () => void;
}

export function LinkItem({
  link,
  showWebsitePreview,
  onRefresh,
  onCleanCache,
}: LinkItemProps) {
  const t = useTranslation();
  const { config } = useConfig();
  const BASE_URL = config?.host;
  const rightAccessories: List.Item.Accessory[] = [
    { text: new Date(link.createdAt * 1000).toLocaleDateString() },
  ];

  return (
    <List.Item
      title={`${link.slug}`}
      subtitle={link.url}
      accessories={[...rightAccessories]}
      icon={
        showWebsitePreview
          ? {
              source: `https://unavatar.io/${
                new URL(link.url).hostname
              }?fallback=https://sink.cool/sink.png`,
              mask: Icon.Mask.RoundedRectangle,
            }
          : Icon.Link
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            url={`${BASE_URL}/${link.slug}`}
            title={t.openShortLink || "Open Short Link"}
          />
          <Action.OpenInBrowser
            url={link.url}
            title={t.openTargetUrl || "Open Target URL"}
          />
          <Action.CopyToClipboard
            content={`${BASE_URL}/${link.slug}`}
            title={t.copyShortLink || "Copy Short Link"}
          />
          <Action
            title={t.refreshList || "Refresh List"}
            onAction={onRefresh}
            icon={Icon.ArrowClockwise}
          />
          <Action
            title={t.clearCache || "Clear Cache"}
            onAction={onCleanCache}
            icon={Icon.Trash}
          />
        </ActionPanel>
      }
    />
  );
}

import { Detail, ActionPanel, Action, Icon, useNavigation } from "@raycast/api";
import { Link } from "../types";
import { useTranslation } from "../hooks/useTranslation";

interface LinkDetailProps {
  link: Link;
  onRefresh: () => void;
}

export function LinkDetail({ link, onRefresh }: LinkDetailProps) {
  const { pop } = useNavigation();
  const { t } = useTranslation();

  const markdown = `
# ${link.slug}

## ${t.targetUrl || "Target URL"}
${link.url}

## ${t.createdAt || "Created At"}
${new Date(link.createdAt).toLocaleString()}

## ${t.updatedAt || "Updated At"}
${new Date(link.updatedAt).toLocaleString()}
  `;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title={t.shortLink || "Short Link"}
            text={link.slug}
          />
          <Detail.Metadata.Link
            title={t.targetUrl || "Target URL"}
            target={link.url}
            text={link.url}
          />
          <Detail.Metadata.Label
            title={t.createdAt || "Created At"}
            text={new Date(link.createdAt).toLocaleString()}
          />
          <Detail.Metadata.Label
            title={t.updatedAt || "Updated At"}
            text={new Date(link.updatedAt).toLocaleString()}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={link.url} />
          <Action.CopyToClipboard
            content={link.url}
            title={t.copyShortLink || "Copy Short Link"}
          />
          <Action
            icon={Icon.ArrowClockwise}
            title={t.refreshCache || "Refresh Cache"}
            onAction={onRefresh}
          />
          <Action
            icon={Icon.ChevronLeft}
            title={t.back || "Back"}
            onAction={pop}
            shortcut={{ modifiers: ["cmd"], key: "[" }}
          />
        </ActionPanel>
      }
    />
  );
}

import { useState, useMemo } from "react";
import { List, ActionPanel, Action, Icon, showToast, Toast, useNavigation, Image } from "@raycast/api";
import { useTranslation } from "./hooks/useTranslation";
import { useLinks } from "./hooks/useLinks";
import { LinkDetail } from "./components/LinkDetail";
import { LinkListView } from "./components/LinkListView";
import { ConfigView } from "./components/ConfigView";
import { CreateLinkView } from "./components/CreateLinkView";
import { queryLink, createLink } from "./utils/api";
import { Link, CreateLinkResponse } from "./types";
import { useConfig } from "./hooks/useConfig";

function MainContent() {
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const { links, isLoading, refreshLinks } = useLinks();
  const { push } = useNavigation();
  const { config } = useConfig();
  const showWebsitePreview = config?.showWebsitePreview === "true" ? true : false;
  const filteredLinks = useMemo(() => {
    if (!searchText) return [];
    return links.filter((link) => link && link.slug && link.slug.toLowerCase().includes(searchText.toLowerCase()));
  }, [links, searchText]);

  async function handleSearch(query: string) {
    if (!query.trim()) return;

    try {
      const result = await queryLink(query);
      if (result && typeof result === "object" && "slug" in result) {
        const link = result as Link;
        push(<LinkDetail link={link} onRefresh={refreshLinks} />);
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: t.linkNotFound,
          message: query,
        });
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: t.linkQueryFailed,
        message: String(error),
      });
    }
  }

  function handleLinkSelect(link: Link) {
    push(<LinkDetail link={link} onRefresh={refreshLinks} />);
  }

  function handleConfigured() {
    refreshLinks();
  }

  async function handleCreateLink(url: string, slug: string, comment?: string) {
    try {
      const newLink = (await createLink(url, slug, comment)) as CreateLinkResponse;
      await showToast({
        style: Toast.Style.Success,
        title: t.linkCreated,
        message: newLink?.link?.slug || slug,
      });
      if (newLink && newLink.link) {
        push(<LinkDetail link={newLink.link} onRefresh={refreshLinks} />);
      }
      refreshLinks();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: t.linkCreationFailed,
        message: String(error),
      });
    }
  }

  return (
    <List searchBarPlaceholder={t.searchSlugPlaceholder} onSearchTextChange={setSearchText} isLoading={isLoading}>
      {searchText ? (
        <>
          <List.Item
            icon={Icon.Globe}
            title={t.searchOnline(searchText)}
            actions={
              <ActionPanel>
                <Action title={t.search} onAction={() => handleSearch(searchText)} />
              </ActionPanel>
            }
          />
          {filteredLinks.map((link) => (
            <List.Item
              key={link.id}
              title={link.slug}
              subtitle={link.url}
              icon={
                showWebsitePreview
                  ? {
                      source: `https://unavatar.io/${new URL(link.url).hostname}?fallback=https://sink.cool/sink.png`,
                      mask: Image.Mask.Circle,
                    }
                  : Icon.Link
              }
              actions={
                <ActionPanel>
                  <Action title={t.viewDetails} onAction={() => handleLinkSelect(link)} />
                </ActionPanel>
              }
            />
          ))}
        </>
      ) : (
        <>
          <List.Item
            icon={Icon.List}
            title={t.viewAllShortLinks}
            actions={
              <ActionPanel>
                <Action.Push title={t.viewAllShortLinks} target={<LinkListView />} />
              </ActionPanel>
            }
          />
          <List.Item
            icon={Icon.Plus}
            title={t.createShortLink}
            actions={
              <ActionPanel>
                <Action.Push title={t.createShortLink} target={<CreateLinkView onSubmit={handleCreateLink} />} />
              </ActionPanel>
            }
          />
          <List.Item
            icon={Icon.Gear}
            title={t.settings}
            actions={
              <ActionPanel>
                <Action.Push title={t.settings} target={<ConfigView onConfigured={handleConfigured} />} />
              </ActionPanel>
            }
          />
        </>
      )}
    </List>
  );
}

export default function Command() {
  return <MainContent />;
}

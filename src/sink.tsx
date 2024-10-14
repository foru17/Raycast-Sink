import { useState, useEffect } from "react";
import {
  List,
  ActionPanel,
  Action,
  LocalStorage,
  Icon,
  showToast,
  Toast,
  useNavigation,
  Form,
} from "@raycast/api";
import { useTranslation } from "./hooks/useTranslation";
import { useLinks } from "./hooks/useLinks";
import { LinkDetail } from "./components/LinkDetail";
import { LinkListView } from "./components/LinkListView";
import { ConfigView } from "./components/ConfigView";
import { LanguageProvider } from "./contexts/LanguageContext";
import { createLink, queryLink } from "./utils/api";

type View = "main" | "list" | "detail" | "config" | "create" | "query";

function MainContent() {
  const [view, setView] = useState<View>("main");
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const { t } = useTranslation();
  const { links, isLoading, refreshLinks } = useLinks();
  const { push } = useNavigation();

  useEffect(() => {
    async function checkConfig() {
      const host = await LocalStorage.getItem<string>("host");
      const token = await LocalStorage.getItem<string>("token");
      const language = await LocalStorage.getItem<string>("language");
      const showWebsitePreview = await LocalStorage.getItem<boolean>(
        "showWebsitePreview"
      );
      if (!host || !token || !language || showWebsitePreview === null) {
        setView("config");
      }
    }
    checkConfig();
  }, []);

  if (view === "config") {
    return <ConfigView onConfigured={() => setView("main")} />;
  }

  if (view === "list") {
    return <LinkListView />;
  }

  if (view === "detail" && selectedLinkId) {
    const selectedLink = links.find((link) => link.id === selectedLinkId);
    if (selectedLink) {
      return <LinkDetail link={selectedLink} onRefresh={refreshLinks} />;
    }
  }

  async function handleCreateLink(url: string, slug?: string) {
    try {
      const newLink = await createLink(url, slug);
      console.log("newLink", newLink);
      await showToast({
        style: Toast.Style.Success,
        title: t.linkCreated,
        message: `${newLink.slug}`,
      });
      refreshLinks();
      push(<LinkDetail link={newLink.link} onRefresh={refreshLinks} />);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: t.linkCreationFailed,
        message: String(error),
      });
    }
  }

  async function handleQueryLink(slug: string) {
    try {
      const link = await queryLink(slug);
      if (link) {
        push(<LinkDetail link={link} onRefresh={refreshLinks} />);
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: t.linkNotFound,
          message: slug,
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

  // 主视图
  return (
    <List>
      <List.Item
        icon={Icon.List}
        title={t.viewAllShortLinks}
        actions={
          <ActionPanel>
            <Action
              title={t.viewAllShortLinks}
              onAction={() => setView("list")}
            />
          </ActionPanel>
        }
      />
      <List.Item
        icon={Icon.Link}
        title={t.createShortLink}
        actions={
          <ActionPanel>
            <Action.Push
              title={t.createShortLink}
              target={<CreateLinkForm onSubmit={handleCreateLink} />}
            />
          </ActionPanel>
        }
      />
      <List.Item
        icon={Icon.MagnifyingGlass}
        title={t.queryShortLink}
        actions={
          <ActionPanel>
            <Action.Push
              title={t.queryShortLink}
              target={<QueryLinkForm onSubmit={handleQueryLink} />}
            />
          </ActionPanel>
        }
      />
      <List.Item
        icon={Icon.Gear}
        title={t.settings}
        actions={
          <ActionPanel>
            <Action title={t.settings} onAction={() => setView("config")} />
          </ActionPanel>
        }
      />
    </List>
  );
}

function CreateLinkForm({
  onSubmit,
}: {
  onSubmit: (url: string, slug?: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const { t } = useTranslation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={t.createShortLink}
            onSubmit={() => onSubmit(url, slug || undefined)}
          />
        </ActionPanel>
      }>
      <Form.TextField
        id="url"
        title={t.targetUrl}
        placeholder={t.enterTargetUrl}
        value={url}
        onChange={setUrl}
      />
      <Form.TextField
        id="slug"
        title={t.customSlug}
        placeholder={t.enterCustomSlug}
        value={slug}
        onChange={setSlug}
      />
    </Form>
  );
}

function QueryLinkForm({ onSubmit }: { onSubmit: (slug: string) => void }) {
  const [slug, setSlug] = useState("");
  const { t } = useTranslation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={t.queryShortLink}
            onSubmit={() => onSubmit(slug)}
          />
        </ActionPanel>
      }>
      <Form.TextField
        id="slug"
        title={t.slug}
        placeholder={t.enterSlug}
        value={slug}
        onChange={setSlug}
      />
    </Form>
  );
}

export default function Command() {
  return (
    <LanguageProvider>
      <MainContent />
    </LanguageProvider>
  );
}

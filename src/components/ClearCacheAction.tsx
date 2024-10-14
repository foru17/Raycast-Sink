import { Action, ActionPanel, confirmAlert, showHUD } from "@raycast/api";
import { clearCache } from "../utils/cache";
import { useTranslation } from "../hooks/useTranslation";

export function ClearCacheAction() {
  const t = useTranslation();

  const handleClearCache = async () => {
    if (
      await confirmAlert({
        title: t.clearCacheConfirmTitle,
        message: t.clearCacheConfirmMessage,
        primaryAction: {
          title: t.clearCacheConfirm,
          style: Action.Style.Destructive,
        },
      })
    ) {
      clearCache();
      await showHUD(t.cacheCleared);
    }
  };

  return (
    <ActionPanel.Section>
      <Action
        title={t.clearCache}
        onAction={handleClearCache}
        style={Action.Style.Destructive}
      />
    </ActionPanel.Section>
  );
}

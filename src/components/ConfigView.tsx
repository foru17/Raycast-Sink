import {
  Action,
  ActionPanel,
  Form,
  useNavigation,
  showToast,
  Toast,
  LocalStorage,
  Detail,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { setApiConfig, checkTokenValid } from "../utils/api";
import { useTranslation } from "../hooks/useTranslation";
import { setCachedLinks } from "../utils/cache";

interface ConfigViewProps {
  onConfigured: (isConfigured: boolean) => void;
}

interface Config {
  host: string;
  token: string;
  showWebsitePreview: boolean;
  language: string;
}

export function ConfigView({ onConfigured }: ConfigViewProps) {
  const { pop } = useNavigation();
  const { t, language, setLanguage } = useTranslation();
  const [config, setConfig] = useState<Config>({
    host: "",
    token: "",
    showWebsitePreview: true,
    language: "en",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<Config | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const host = (await LocalStorage.getItem<string>("host")) || "";
        const token = (await LocalStorage.getItem<string>("token")) || "";
        const showWebsitePreview = await LocalStorage.getItem<string>(
          "showWebsitePreview"
        );
        const savedLanguage =
          (await LocalStorage.getItem<string>("language")) || "en";

        const loadedConfig = {
          host,
          token,
          showWebsitePreview: showWebsitePreview === "true",
          language: savedLanguage,
        };
        setConfig(loadedConfig);
        setOriginalConfig(loadedConfig);
        setLanguage(savedLanguage as "en" | "zh");
        setIsConfigValid(null);
      } catch (error) {
        console.error("Load config failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    setConfig((prevConfig) => ({ ...prevConfig, language }));
  }, [language]);

  async function verifyConfiguration(
    host: string,
    token: string
  ): Promise<boolean> {
    if (!host || !token) {
      await showToast({
        style: Toast.Style.Failure,
        title: t.configurationIncomplete,
      });
      return false;
    }

    setIsValidating(true);
    try {
      const isValid = await checkTokenValid(host, token);
      setIsConfigValid(isValid);
      await showToast({
        style: isValid ? Toast.Style.Success : Toast.Style.Failure,
        title: isValid
          ? t.configurationValidationSucceeded
          : t.configurationValidationFailed,
      });
      return isValid;
    } catch (error) {
      console.error("Verify config failed:", error);
      setIsConfigValid(false);
      await showToast({
        style: Toast.Style.Failure,
        title: t.configurationValidationFailed,
        message: String(error),
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  }

  async function handleSubmit(values: Config) {
    const hostChanged = values.host !== originalConfig?.host;
    const tokenChanged = values.token !== originalConfig?.token;

    if (hostChanged || tokenChanged) {
      const isValid = await verifyConfiguration(values.host, values.token);
      if (!isValid) {
        return;
      }
    }

    try {
      await LocalStorage.setItem("host", values.host);
      await LocalStorage.setItem("token", values.token);
      await LocalStorage.setItem(
        "showWebsitePreview",
        values.showWebsitePreview.toString()
      );
      await LocalStorage.setItem("language", values.language);
      if (hostChanged) {
        await setCachedLinks([]);
      }
      setApiConfig({ host: values.host, token: values.token });
      setConfig(values);
      setLanguage(values.language as "en" | "zh");
      setIsConfigValid(true);
      onConfigured(true);

      await showToast({
        style: Toast.Style.Success,
        title: t.configurationSaved,
      });
      pop();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: t.configurationSaveFailed,
        message: String(error),
      });
    }
  }

  if (isLoading) {
    return <Detail isLoading={true} />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={t.saveConfiguration}
            onSubmit={handleSubmit}
          />
          <Action
            title={t.verifyConfiguration}
            onAction={() => verifyConfiguration(config.host, config.token)}
          />
        </ActionPanel>
      }>
      <Form.Description
        title={t.configurationStatus}
        text={
          isValidating
            ? `${t.validating} 🔄` || "Validating"
            : isConfigValid === null
            ? `${t.notValidated} ❗` || "Not Validated"
            : isConfigValid
            ? `${t.valid} ✅` || "Valid"
            : `${t.invalid} ❌` || "Invalid"
        }
      />
      <Form.TextField
        id="host"
        title={t.apiHost}
        placeholder={t.enterApiHost}
        value={config.host}
        onChange={(newValue) => setConfig({ ...config, host: newValue })}
      />
      <Form.TextField
        id="token"
        title={t.apiToken}
        placeholder={t.enterApiToken}
        value={config.token}
        onChange={(newValue) => setConfig({ ...config, token: newValue })}
      />
      <Form.Dropdown
        id="language"
        title={t.language}
        value={config.language}
        onChange={(newValue) => {
          setConfig({ ...config, language: newValue });
          setLanguage(newValue as "en" | "zh");
        }}>
        <Form.Dropdown.Item value="en" title="English" />
        <Form.Dropdown.Item value="zh" title="中文" />
      </Form.Dropdown>

      <Form.Checkbox
        id="showWebsitePreview"
        title={t.showWebsitePreview}
        label={t.showWebsitePreviewDescription}
        value={config.showWebsitePreview}
        onChange={(newValue) =>
          setConfig({ ...config, showWebsitePreview: newValue })
        }
      />
    </Form>
  );
}

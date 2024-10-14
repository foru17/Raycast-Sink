import { useState, useEffect } from "react";
import { LocalStorage } from "@raycast/api";

interface Config {
  host: string;
  token: string;
  showWebsitePreview: boolean;
  language: string;
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const host = (await LocalStorage.getItem<string>("host")) || "";
        const token = (await LocalStorage.getItem<string>("token")) || "";
        const showWebsitePreview = await LocalStorage.getItem<string>(
          "showWebsitePreview"
        );
        const language =
          (await LocalStorage.getItem<string>("language")) || "en";

        setConfig({
          host,
          token,
          showWebsitePreview: showWebsitePreview === "true",
          language,
        });
      } catch (error) {
        console.error("Error loading config:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<Config>) => {
    if (config) {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);

      // 更新 LocalStorage
      await Promise.all([
        LocalStorage.setItem("host", updatedConfig.host),
        LocalStorage.setItem("token", updatedConfig.token),
        LocalStorage.setItem(
          "showWebsitePreview",
          updatedConfig.showWebsitePreview.toString()
        ),
        LocalStorage.setItem("language", updatedConfig.language),
      ]);
    }
  };

  return { config, isLoading, updateConfig };
}

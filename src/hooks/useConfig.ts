import { useState, useCallback } from "react";
import { getPreferenceValues } from "@raycast/api";
import { Config, Preferences } from "../types";

const getConfig = (): Config => {
  try {
    const preferences = getPreferenceValues<Preferences>();
    return {
      host: preferences.host,
      token: preferences.token,
      language: preferences.language || "en",
      showWebsitePreview: preferences.showWebsitePreview || "true",
    };
  } catch (error) {
    console.error("Config load failed:", error);
    return {
      host: "",
      token: "",
      language: "en",
      showWebsitePreview: "true",
    };
  }
};

export function useConfig() {
  const [config, setConfig] = useState<Config>(getConfig);
  const [isLoading, setIsLoading] = useState(false);

  const reloadConfig = useCallback(() => {
    setIsLoading(true);
    setConfig(getConfig());
    setIsLoading(false);
  }, []);

  return {
    config,
    isLoading,
    reloadConfig,
    getConfigValue: useCallback((key: keyof Config) => config[key], [config]),
  };
}

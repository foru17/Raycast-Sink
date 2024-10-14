import { getPreferenceValues } from "@raycast/api";
import { Preferences } from "../types";
import { useState, useEffect } from "react";
import { LocalStorage } from "@raycast/api";

const translations = {
  en: {
    createShortLink: "Create Short Link",
    queryShortLink: "Query Short Link",
    viewAllShortLinks: "View All Short Links",
    settings: "Settings",
    linkListCount: "Link List Count",
    searchBarPlaceholder: "Search links...",
    noLinksFound: "No Links Found",
    tryOtherSearchTerms: "Try other search terms",
    addLinksToStart: "Add some links to start using",
    saveConfiguration: "Save Configuration",
    configurationDescription:
      "Please configure your settings to get started with the Short Link Manager.",
    apiHost: "API Host",
    apiToken: "API Token",
    enterApiHost: "Enter API host URL",
    enterApiToken: "Enter your API token",
    showWebsitePreview: "Website Preview",
    showWebsitePreviewDescription: "Show website preview icon in the link list",
    configurationStatus: "Configuration Status",
    validating: "Validating",
    notValidated: "Not Validated",
    valid: "Valid",
    invalid: "Invalid",
    configurationIncomplete: "Configuration is incomplete",
    configurationValidationSucceeded: "Configuration validation succeeded",
    configurationValidationFailed: "Configuration validation failed",
    configurationSaved: "Configuration saved",
    configurationSaveFailed: "Failed to save configuration",
    verifyConfiguration: "Verify Configuration",
    language: "Language",
    linkCreated: "Short link created",
    linkCreationFailed: "Failed to create short link",
    linkNotFound: "Short link not found",
    linkQueryFailed: "Failed to query short link",
    targetUrl: "Target URL",
    enterTargetUrl: "Enter target URL",
    customSlug: "Custom Slug (optional)",
    enterCustomSlug: "Enter custom slug",
    slug: "Slug",
    enterSlug: "Enter slug to query",
    errorFetchingLinks: "Error fetching links",
    shortLink: "Short Link",
    createdAt: "Created At",
    updatedAt: "Updated At",
    copyShortLink: "Copy Short Link",
    refreshCache: "Refresh Cache",
    back: "Back",
  },
  zh: {
    createShortLink: "创建短链接",
    queryShortLink: "查询短链接",
    viewAllShortLinks: "查看所有短链接",
    settings: "设置",
    linkListCount: "链接数量",
    searchBarPlaceholder: "搜索链接...",
    noLinksFound: "没有找到链接",
    tryOtherSearchTerms: "尝试其他搜索词",
    addLinksToStart: "添加一些链接开始使用",
    saveConfiguration: "保存配置",
    configurationDescription: "请配置您的设置以开始使用短链接管理器。",
    apiHost: "API 主机",
    apiToken: "API 令牌",
    enterApiHost: "输入 API 主机 URL",
    enterApiToken: "输入您的 API 令牌",
    showWebsitePreview: "网站图标",
    showWebsitePreviewDescription: "在链接列表中显示网站图标",
    configurationStatus: "配置状态",
    validating: "验证中",
    notValidated: "未验证",
    valid: "有效",
    invalid: "无效",
    configurationIncomplete: "配置不完整",
    configurationValidationSucceeded: "配置验证成功",
    configurationValidationFailed: "配置验证失败",
    configurationSaved: "配置已保存",
    configurationSaveFailed: "保存配置失败",
    verifyConfiguration: "验证配置",
    language: "语言",
    linkCreated: "短链接创建成功",
    linkCreationFailed: "创建短链接失败",
    linkNotFound: "未找到短链接",
    linkQueryFailed: "查询短链接失败",
    targetUrl: "目标 URL",
    enterTargetUrl: "输入目标 URL",
    customSlug: "自定义 Slug（可选）",
    enterCustomSlug: "输入自定义 slug",
    slug: "短链 slug",
    enterSlug: "输入要查询的短链接标签",
    errorFetchingLinks: "获取链接时出错",
    shortLink: "短链接",
    createdAt: "创建时间",
    updatedAt: "更新时间",
    copyShortLink: "复制短链接",
    refreshCache: "刷新缓存",
    back: "返回",
  },
};

export function useTranslation() {
  const [language, setLanguage] = useState<"en" | "zh">("en");

  useEffect(() => {
    LocalStorage.getItem<"en" | "zh">("language").then((savedLanguage) => {
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    });
  }, []);

  const setNewLanguage = async (newLanguage: "en" | "zh") => {
    await LocalStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
  };

  return {
    t: translations[language],
    language,
    setLanguage: setNewLanguage,
  };
}

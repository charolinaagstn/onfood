import Constants from "expo-constants";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

/**
 * Helper to resolve the correct API base URL
 */
export const getBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_SERVER_URL?.trim();

  // If a valid custom server URL is specified (not placeholder gowez.com)
  if (
    envUrl &&
    !envUrl.includes("gowez.com") &&
    !envUrl.includes("example.com")
  ) {
    return envUrl.replace(/\/$/, "");
  }

  // Web platform uses relative path
  if (Platform.OS === "web") {
    return "";
  }

  // React Native Mobile (Expo Go / Dev Build) -> resolve developer machine Metro server IP
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:8081`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8081";
  }

  return "http://localhost:8081";
};

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      const baseUrl = getBaseUrl();
      const normalizedPath = url.startsWith("/") ? url : `/${url}`;
      fullUrl = `${baseUrl}${normalizedPath}`;
    }

    console.log(`[fetchAPI] Requesting: ${fullUrl}`);

    const response = await fetch(fullUrl, options);
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      if (contentType.includes("application/json")) {
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          // ignore
        }
      } else {
        const text = await response.text();
        console.warn(`[fetchAPI] Non-JSON error response from ${fullUrl}:`, text.slice(0, 150));
      }
      throw new Error(errorMessage);
    }

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Format respons tidak valid dari server (bukan JSON). Respon: ${text.slice(0, 100)}...`,
      );
    }
  } catch (error) {
    console.warn("Fetch warning:", error);
    throw error;
  }
};

export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data ?? result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

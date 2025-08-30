import type { ConfigContext, ExpoConfig } from "@expo/config";
import { config as baseConfig } from "./app.config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...baseConfig,
  ...config,
  name: "Shift Med",
  slug: "shift-app",
  version: "1.0.0",

  // Production optimizations
  newArchEnabled: true,
  jsEngine: "hermes",

  // Performance optimizations
  assetBundlePatterns: [
    "**/*",
    "!**/*.test.*",
    "!**/*.spec.*",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],

  // Splash screen optimization
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  // iOS production settings
  ios: {
    ...baseConfig.ios,
    supportsTablet: true,
    bundleIdentifier: "com.shiftmed.app",
    buildNumber: "1",
    infoPlist: {
      UIBackgroundModes: ["remote-notification"],
      NSLocationWhenInUseUsageDescription: "This app uses location to find nearby shifts.",
      NSCameraUsageDescription: "This app uses camera for profile photos.",
      NSPhotoLibraryUsageDescription: "This app uses photo library for profile photos.",
    },
  },

  // Android production settings
  android: {
    ...baseConfig.android,
    package: "com.shiftmed.app",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.RECEIVE_BOOT_COMPLETED",
      "android.permission.VIBRATE",
      "android.permission.WAKE_LOCK",
    ],
  },

  // Web production settings
  web: {
    ...baseConfig.web,
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
    build: {
      babel: {
        include: ["@expo/vector-icons"],
      },
    },
  },

  // Plugins for production
  plugins: [
    "expo-router",
    "expo-font",
    "expo-web-browser",
    "expo-notifications",
    "expo-location",
    "expo-camera",
    "expo-image-picker",
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "13.0",
          useFrameworks: "static",
        },
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: "34.0.0",
        },
      },
    ],
  ],

  // Experiments for production
  experiments: {
    typedRoutes: true,
    baseUrl: "/shift-med",
  },

  // Extra configuration
  extra: {
    ...baseConfig.extra,
    eas: {
      projectId: "55477812-99c6-4323-8bd0-cc7a71589fe8",
    },
    // Production API endpoints
    apiUrl: "https://api.shiftmed.com",
    // Analytics configuration
    analytics: {
      enabled: true,
      trackingId: "G-XXXXXXXXXX", // Replace with actual tracking ID
    },
  },

  // Owner information
  owner: "riwa11",

  // Privacy policy and terms
  privacy: "https://shiftmed.com/privacy",
  terms: "https://shiftmed.com/terms",
});

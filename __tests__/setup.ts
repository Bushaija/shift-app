import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock Expo Router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => children,
  PanGestureHandler: ({ children }: any) => children,
  TapGestureHandler: ({ children }: any) => children,
}));

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModalProvider: ({ children }: any) => children,
  BottomSheetModal: ({ children }: any) => children,
  BottomSheetView: ({ children }: any) => children,
  BottomSheetScrollView: ({ children }: any) => children,
  useBottomSheetModal: () => ({
    dismiss: jest.fn(),
    expand: jest.fn(),
    collapse: jest.fn(),
  }),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Home: 'Home',
  Calendar: 'Calendar',
  User: 'User',
  Briefcase: 'Briefcase',
  AlertTriangle: 'AlertTriangle',
  RefreshCw: 'RefreshCw',
  Moon: 'Moon',
  Sun: 'Sun',
  Settings: 'Settings',
  Bell: 'Bell',
}));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock fetch for API tests
global.fetch = jest.fn();

// Test environment setup
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllTimers();
});

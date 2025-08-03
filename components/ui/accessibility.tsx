import React from 'react';
import { AccessibilityInfo, View, Text, TouchableOpacity } from 'react-native';

// Accessibility hook for screen readers
export function useAccessibility() {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);

  React.useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };

    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  return { isScreenReaderEnabled };
}

// Accessible button component
export function AccessibleButton({
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  children,
  className = '',
  ...props
}: {
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'tab';
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      className={className}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

// Accessible text component
export function AccessibleText({
  children,
  accessibilityRole = 'text',
  accessibilityLabel,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  accessibilityRole?: 'text' | 'header' | 'link';
  accessibilityLabel?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Text
      accessible={true}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      className={className}
      {...props}
    >
      {children}
    </Text>
  );
}

// Accessible view component
export function AccessibleView({
  children,
  accessibilityRole = 'none',
  accessibilityLabel,
  accessibilityHint,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  accessibilityRole?: 'none' | 'button' | 'link' | 'header' | 'main' | 'navigation';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <View
      accessible={accessibilityRole !== 'none'}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
}

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = React.useState<string | null>(null);

  const focusElement = React.useCallback((elementId: string) => {
    setFocusedElement(elementId);
    // In a real implementation, you might want to programmatically focus the element
  }, []);

  const clearFocus = React.useCallback(() => {
    setFocusedElement(null);
  }, []);

  return { focusedElement, focusElement, clearFocus };
}

// High contrast mode detection
export function useHighContrast() {
  const [isHighContrastEnabled, setIsHighContrastEnabled] = React.useState(false);

  React.useEffect(() => {
    const checkHighContrast = async () => {
      const enabled = await AccessibilityInfo.isHighContrastEnabled();
      setIsHighContrastEnabled(enabled);
    };

    checkHighContrast();

    const subscription = AccessibilityInfo.addEventListener(
      'highContrastChanged',
      setIsHighContrastEnabled
    );

    return () => subscription?.remove();
  }, []);

  return { isHighContrastEnabled };
}

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Here you could send error reports to your analytics service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 justify-center items-center px-6">
            <View className="items-center space-y-6">
              <AlertTriangle size={64} color="#EF4444" />

              <View className="items-center space-y-2">
                <Text className="text-2xl font-bold text-gray-900">
                  Something went wrong
                </Text>
                <Text className="text-gray-600 text-center">
                  We're sorry, but something unexpected happened. Please try again.
                </Text>
              </View>

              <TouchableOpacity
                onPress={this.handleRetry}
                className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center"
              >
                <RefreshCw size={20} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

// Error display component
export function ErrorDisplay({
  error,
  onRetry,
  title = "Something went wrong",
  message = "Please try again"
}: {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
}) {
  if (!error) return null;

  return (
    <View className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <View className="flex-row items-start space-x-2">
        <AlertTriangle size={20} color="#EF4444" />
        <View className="flex-1">
          <Text className="text-red-800 font-medium">{title}</Text>
          <Text className="text-red-600 text-sm mt-1">{message}</Text>
          {onRetry && (
            <TouchableOpacity
              onPress={onRetry}
              className="mt-2 bg-red-600 px-3 py-1 rounded self-start"
            >
              <Text className="text-white text-sm">Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

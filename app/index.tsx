import { Redirect } from 'expo-router';
import { View, Text } from 'react-native'

export default function Index() {
  // For development: Skip onboarding and auth, go directly to home
  // TODO: When ready for production, uncomment the full flow below:
  /*
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<string | null>(null);
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const onboardingStatus = await getItem<string>('hasCompletedOnboarding');
        setHasCompletedOnboarding(onboardingStatus);
        await checkAuth();
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, [checkAuth]);

  if (isLoading) return null;
  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  if (hasCompletedOnboarding === 'true') return <Redirect href="/auth/signin" />;
  return <Redirect href="/onboarding" />;
  */

  return <Redirect href="/(tabs)/" />;
  // return (
  //   <View className="flex-1 justify-center items-center">
  //     <Text className="text-2xl font-bold">Welcome Home!</Text>
  //   </View>
  // );
}

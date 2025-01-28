import { StatusBar } from 'expo-status-bar';
import * as Network from 'expo-network';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Sentry from 'sentry-expo';

import { theme } from '../../theme';
import { Categories } from '../../screens/Categories';
import { Home } from '../../screens/Home';
import RealmContext from '../../realm';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Category } from '@/models/category';
import { Expense } from '@/models/expense';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from 'expo-router';


const routingInstrumentation =
  new Sentry.Native.ReactNavigationInstrumentation();

const devServerPort = 8081;
let devServerIpAddress: string | null = null;
Network.getIpAddressAsync().then((ip) => {
  devServerIpAddress = ip;
});

Sentry.init({
  dsn: 'https://4d8e522ac187444fa51215c63949cc74@o1418292.ingest.sentry.io/4504486326370304',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  enableInExpoDevelopment: true,
  enableAutoPerformanceTracing: true,
  enableAutoSessionTracking: true,
  // @ts-ignore
  attachScreenshot: true,

  integrations: [
    new Sentry.Native.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      shouldCreateSpanForRequest: (url) => {
        return (
          !__DEV__ ||
          !url.startsWith(`http://${devServerIpAddress}:${devServerPort}/logs`)
        );
      },
    }),
  ],
});

const Stack = createNativeStackNavigator();
const { RealmProvider } = RealmContext;
function HomeScreen() {
  const navigation = useNavigation<any>();
  return (
    <GestureHandlerRootView   >
    <RealmProvider schema={[Category, Expense]}>
        <StatusBar backgroundColor={theme.colors.background} style='inverted'/>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name='Home'
            component={Home}
          />
<Stack.Screen
  options={({ navigation }) => ({
    headerTitleStyle: { color: theme.colors.text },
    headerStyle: { backgroundColor: theme.colors.background },
    headerLeft: () => (
      <FontAwesome
        onPress={() => navigation.goBack()}
        name="chevron-left"
        size={24}
        color={theme.colors.text}
      />
    ),
  })}
  name="Categories"
  component={Categories}
/>

        </Stack.Navigator>
    </RealmProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.Native.wrap(HomeScreen);

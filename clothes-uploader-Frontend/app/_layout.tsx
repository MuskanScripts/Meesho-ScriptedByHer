import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';





const PinkPurpleTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#D15B9B',  // Default background color for light mode
    card: '#9B46E6',  // Purple card background color
    text: '#fff',  // White text
    border: '#fff',  // White border for buttons
    notification: '#9B46E6',  // Purple notification color
  },
};

const DarkPinkPurpleTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#9B46E6',  // Dark mode background with purple
    card: '#D15B9B',  // Pink card background color in dark mode
    text: '#fff',  // White text
    border: '#fff',  // White borders in dark mode
    notification: '#D15B9B',  // Light pink notification color
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const theme = colorScheme === 'dark' ? DarkPinkPurpleTheme : PinkPurpleTheme;

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Amplify } from "aws-amplify";
import "aws-amplify/auth/enable-oauth-listener";

// Amplify Configuration
const amplifyConfig : any = {
  Auth: {
    Cognito: {
      region : 'us-east-1',
      userPoolClientId: '6878lk42lk73vv8a7jr4uspknk',
      userPoolId: 'us-east-1_arploUSO9',
      loginWith: {
        oauth: {
          domain: 'nick.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid' , 'profile'],
          redirectSignIn: ['reistta://'],
          redirectSignOut: ['reistta://'],
          responseType: 'code',
          providers: ['Google']
        }
      }
    }
  }
};

// Configure Amplify
Amplify.configure(amplifyConfig);

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((err) =>
  console.warn("Error preventing splash screen auto-hide:", err)
);

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch((err) =>
        console.warn("Error hiding splash screen:", err)
      );
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerTintColor: "#333",
        headerTitleStyle: {
          fontFamily: "SpaceMono",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Sign In",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerTitle: "Sign Up",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="fedrated"
        options={{
          headerTitle: "Sign In with Google",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

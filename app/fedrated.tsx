// Federated.tsx
import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

const Federated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        // User is authenticated, redirect to home
        router.replace("/");
      }
    } catch (err) {
      // User is not authenticated, continue showing sign-in options
      console.log("User not authenticated:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (Platform.OS === "web") {
        // Web platform can use direct redirect
        await signInWithRedirect({ provider: "Google" });
        console.log("signInWithRedirect");
        
      } else {
        const res = await WebBrowser.openAuthSessionAsync(
          "https://nick.auth.us-east-1.amazoncognito.com/login?client_id=6878lk42lk73vv8a7jr4uspknk&response_type=code&scope=email+openid+phone&redirect_uri=reistta%3A%2F%2F"
        );
        console.log("result:::::::::" ,res);
        
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      setError(errorMessage);
      console.error("Google Sign-in Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in with Google</Text>

      <Button
        title={isLoading ? "Signing in..." : "Continue with Google"}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      />

      {isLoading && (
        <ActivityIndicator style={styles.loader} size="small" color="#0000ff" />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Federated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

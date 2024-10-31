import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { signInWithRedirect } from "aws-amplify/auth";

const Federated = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithRedirect({
        provider: "Google",
      });
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

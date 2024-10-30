import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { signIn } from "aws-amplify/auth";
import { router } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn({ username, password });
      router.push("/");
    } catch (error: any) {
      console.log("Error logging in:", error);
      if (error.message === "There is already a signed in user.") {
        router.push("/");
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        secureTextEntry={false}
        keyboardType="email-address"
        returnKeyType="next"
        placeholderTextColor="#000"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        returnKeyType="done"
        placeholderTextColor="#000"
      />
      {error !== "" && <Text>{error}</Text>}

      <Button title="Login" disabled={loading} onPress={handleLogin} />
      {loading && (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={styles.loading}
        />
      )}

      <Pressable disabled={loading} onPress={() => router.push("/signup")}>
        <Text style={{ padding: 10, color: "blue" }}>Go to Signup</Text>
      </Pressable>
      <Pressable disabled={loading} onPress={() => router.push("/fedrated")}>
        <Text style={{ padding: 10, color: "blue" }}>fedrated</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  loading: {
    marginTop: 10,
  },
});

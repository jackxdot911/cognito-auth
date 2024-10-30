import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { router } from "expo-router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Track signup or OTP step

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signUp({ username, password });
      setIsOtpSent(true); // Move to OTP verification step
      Alert.alert(
        "Signup Successful",
        "Please enter the OTP sent to your email."
      );
    } catch (error: any) {
      console.log("Error signing up:", error.message);
      Alert.alert("Signup Error", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      await confirmSignUp({ username, confirmationCode: otp });
      Alert.alert("Success", "Your account is verified!");
      router.push("/"); // Redirect to main screen after verification
    } catch (error: any) {
      console.log("Error verifying OTP:", error.message);
      Alert.alert("Verification Error", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isOtpSent ? "OTP Verification" : "Signup"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#000"
        editable={!isOtpSent} // Disable editing after signup
      />

      {!isOtpSent ? (
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor="#000"
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="OTP Code"
          onChangeText={setOtp}
          value={otp}
          keyboardType="numeric"
          placeholderTextColor="#000"
        />
      )}
      {error !== "" && <Text>{error}</Text>}
      <Button
        disabled={loading}
        title={isOtpSent ? "Verify OTP" : "Signup"}
        onPress={isOtpSent ? handleOtpVerification : handleSignup}
      />
      {loading && (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={styles.loading}
        />
      )}
      <Pressable disabled={loading} onPress={() => router.push("/login")}>
        <Text style={{ padding: 10, color: "blue" }}>Go to login</Text>
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

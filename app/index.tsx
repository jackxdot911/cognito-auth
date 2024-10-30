import { useCallback, useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { fetchUserAttributes, signOut } from "@aws-amplify/auth";
import { fetchAuthSession, signInWithRedirect } from "aws-amplify/auth";
import authHeader from "../services/authHeader";

export default function Index() {
  const [userDetails, setUserDetails] = useState<any>();
  const [session, setSession] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error: any) {
      console.log("Error logging out:", error.message);
    } finally {
      setLogoutLoading(false);
    }
  };

  const checkUserSession = async () => {
    try {
      const { email, email_verified, sub } = await fetchUserAttributes();
      console.log(email);

      authHeader()
      
      setUserDetails({ email, email_verified, sub });
    } catch (err) {
      console.log("User not logged in or error getting user:", err);
      setUserDetails(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }

    try {
      const session = await fetchAuthSession();
      setSession({
        idToken: session?.tokens?.idToken,
        accessToken: session?.tokens?.accessToken,
      });
      console.log("id token", session?.tokens?.idToken);
      console.log("access token", session?.tokens?.accessToken);
    } catch (err) {
      console.log("User not logged in or error getting user:", err);
      setUserDetails(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkUserSession();
    }, [])
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Index Page!</Text>
      {userDetails ? (
        <Text style={styles.email}>Email: {userDetails?.email}</Text>
      ) : (
        <Text style={styles.errorText}>User not found</Text>
      )}
      <Button
        title={logoutLoading ? "Logging out..." : "Logout"}
        onPress={handleLogout}
        disabled={logoutLoading}
        color="#f44336"
      />
      {logoutLoading && (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={styles.loading}
        />
      )}
      <Button
        title="Sign In with Google"
        onPress={() => signInWithRedirect({ provider: "Google" })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    color: "#f44336",
    marginBottom: 20,
  },
  loading: {
    marginTop: 10,
  },
});
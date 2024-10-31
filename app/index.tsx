import { useCallback, useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Linking } from 'react-native';
import { 
  fetchUserAttributes, 
  signOut, 
  fetchAuthSession, 
  getCurrentUser
} from 'aws-amplify/auth';
import authHeader from "../services/authHeader";

type UserDetails = {
  email: string;
  email_verified: boolean;
  sub: string;
};

type SessionTokens = {
  idToken?: string;
  accessToken?: string;
};

export default function Index() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>();
  const [session, setSession] = useState<SessionTokens | null>();
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const handleOAuthResponse = async (url: string) => {
      try {
        // Check if user exists after OAuth redirect
        const currentUser = await getCurrentUser();
        if (currentUser) {
          await checkUserSession();
        }
      } catch (error) {
        console.error("Error handling OAuth response:", error);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleOAuthResponse(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log("Error logging out:", error instanceof Error ? error.message : String(error));
    } finally {
      setLogoutLoading(false);
    }
  };

  const checkUserSession = async () => {
    try {
      const userAttrs = await fetchUserAttributes();
      setUserDetails({
        email: userAttrs.email,
        email_verified: userAttrs.email_verified === 'true',
        sub: userAttrs.sub
      });
      
      await authHeader();

      const currentSession = await fetchAuthSession();
      setSession({
        idToken: currentSession.tokens?.idToken?.toString(),
        accessToken: currentSession.tokens?.accessToken?.toString(),
      });

      console.log("id token", currentSession.tokens?.idToken);
      console.log("access token", currentSession.tokens?.accessToken);
    } catch (error) {
      console.log("User not logged in or error getting user:", error);
      setUserDetails(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Initial session check
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          await checkUserSession();
        } else {
          setLoading(false);
          router.push("/login");
        }
      } catch (error) {
        console.log("Error checking initial auth:", error);
        setLoading(false);
        router.push("/login");
      }
    };

    initializeAuth();
  }, []);

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
        <Text style={styles.email}>Email: {userDetails.email}</Text>
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
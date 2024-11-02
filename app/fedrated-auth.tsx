// import {
//   Button,
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { signInWithRedirect, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
// import { router } from "expo-router";
// import * as WebBrowser from "expo-web-browser";

// // Enable WebBrowser redirect handling
// WebBrowser.maybeCompleteAuthSession();

// const Federated = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const user = await getCurrentUser();
//       if (user) {
//         router.replace("/");
//       }
//     } catch (err) {
//       console.log("User not authenticated:", err);
//     }
//   };

//   const handleAuthCode = async (url: string) => {
//     try {
//       // Extract the code from the URL
//       const code = new URL(url).searchParams.get('code');
//       if (!code) {
//         throw new Error('No authorization code received');
//       }

//       console.log('Received auth code:', code);

//       // Try to get the auth session which should trigger the code exchange
//       const session = await fetchAuthSession();
//       console.log('Auth session obtained:', !!session);

//       // Verify the user is authenticated
//       const user = await getCurrentUser();
//       console.log('User authenticated:', !!user);

//       if (user) {
//         router.replace("/");
//       } else {
//         throw new Error('Failed to authenticate user after code exchange');
//       }
//     } catch (err) {
//       console.error('Error handling auth code:', err);
//       throw err;
//     }
//   };

//   const constructHostedUIURL = () => {
    
//     const hostedUIURL = 
//       "https://nick.auth.us-east-1.amazoncognito.com/login?client_id=6878lk42lk73vv8a7jr4uspknk&response_type=code&scope=email+openid+phone&redirect_uri=reistta%3A%2F%2F";

//     console.log('Hosted UI URL:', hostedUIURL);
//     return hostedUIURL;
//   };

//   const handleGoogleSignIn = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (Platform.OS === "web") {
//         await signInWithRedirect({ provider: "Google" });
//       } else {
//         console.log('Starting Google Sign In...');
        
//         const authURL = constructHostedUIURL();
//         const result = await WebBrowser.openAuthSessionAsync(
//           authURL,
//           'reistta://',
//           {
//             showInRecents: true,
//             preferEphemeralSession: true,
//           }
//         );
        
//         console.log('WebBrowser Result:', JSON.stringify(result, null, 2));
        
//         if (result.type === 'success' && result.url) {
//           console.log('Success URL:', result.url);
//           await handleAuthCode(result.url);
//         } else if (result.type === 'dismiss') {
//           console.log('Auth session was dismissed');
//           setError('Sign in was cancelled. Please try again.');
//         }
//       }
//     } catch (err) {
//       console.error('Detailed error:', JSON.stringify(err, null, 2));
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to sign in with Google";
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign in with Google</Text>

//       <Button
//         title={isLoading ? "Signing in..." : "Continue with Google"}
//         onPress={handleGoogleSignIn}
//         disabled={isLoading}
//       />

//       {isLoading && (
//         <ActivityIndicator style={styles.loader} size="small" color="#0000ff" />
//       )}

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       <Text style={styles.infoText}>
//         Make sure you have a Google account set up on your device.
//       </Text>
//     </View>
//   );
// };

// export default Federated;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   loader: {
//     marginTop: 10,
//   },
//   errorText: {
//     color: "red",
//     marginTop: 10,
//     textAlign: "center",
//   },
//   infoText: {
//     marginTop: 20,
//     color: '#666',
//     textAlign: 'center',
//   }
// });
import {
    Button,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { signInWithRedirect, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"

const androidClientId = "589716530340-6hgl3jmk77hjfvms2vbl02umdgdgtjii.apps.googleusercontent.com"

WebBrowser.maybeCompleteAuthSession();

const Federated = () => {
    const config = {
        androidClientId
    }
    const [req , res , promptAsync] = Google.useAuthRequest(config);

    const handleToken = () => {
        if(res?.type === "success"){
            const {authentication} = res;
            const token = authentication?.accessToken;
            console.log("access token", token);
        }
    }

    useEffect(()=>{
        handleToken();
    },[res])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in with Google</Text>
            <Button
                title={"Continue with Google"}
                onPress={()=>promptAsync()}
            />
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
    infoText: {
        marginTop: 20,
        color: '#666',
        textAlign: 'center',
    }
});
import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { signInWithRedirect } from 'aws-amplify/auth'


const fedrated = () => {
  return (
    <View>
      <Text>fedrated</Text>
      <Button
        title="Sign In with Google"
        onPress={() => signInWithRedirect({ provider: "Google" })}
      />
    </View>
  )
}

export default fedrated

const styles = StyleSheet.create({})
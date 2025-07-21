import React from 'react'
import { View, Button, Text, ActivityIndicator } from 'react-native'
import { useLoginViewModel } from '../viewmodels/loginViewModel'

const LoginScreen = () => {
  const { login, token, error, loading } = useLoginViewModel()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator />
      ) : token ? (
        <Text>Logged in!\nToken: {token.substring(0, 30)}...</Text>
      ) : (
        <Button title="Login with Keycloak" onPress={login} />
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  )
}

export default LoginScreen
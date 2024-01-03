import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from 'react'

function SignIn() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  return (
    <View>
      <Text>Enter your email:
        <br></br>
        <TextInput 
          id="email" 
          placeholder="Enter your email address" 
          value={email}
          onChangeText={(value) => setEmail(value)}
          />
      </Text>
      <Text>Password:
        <br></br>
        <TextInput 
          id="password" 
          placeholder="Enter your password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry 
          />
      </Text>
      <Pressable 
        id="login-submit"
        role="button" aria-label="Submit details"
        style={{ width: 100, height: 20, border: 2 }}
        onPress={() => { 
          //Send off to auth
          setEmail('')
          setPassword('') 
        }}
        >
        {/* Insert button-type component here, placeholder text below */}
        <Text> 
          Submit
        </Text>
      </Pressable>
    </View>
  );
}

export default SignIn;

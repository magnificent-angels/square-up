import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Button, Text, Layout, Card } from '@ui-kitten/components';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Card status='primary'>
      <Text category='label' style={{marginBottom: 10}}>Enter your email:</Text>
      <Input
        placeholder='Enter your email address'
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 20 }}
      />
      
      <Text category='label' style={{marginBottom: 10}}>Password:</Text>
      <Input
        placeholder='Enter your password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{ marginBottom: 20 }}
      />

      <Button
        onPress={() => {
          setEmail('');
          setPassword('');
        }}>
        Submit
        </Button>
      </Card>
    </Layout>
  );
}

export default SignIn;

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

function LandingPage() {
  const nav = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        style={{ marginVertical: 4 }} 
        size='large'
        onPress={() => nav.navigate('SignIn')}>
        Log In
      </Button>
      <Button 
        style={{ marginVertical: 4 }} 
        size='large'
        appearance='ghost'
        onPress={() => nav.navigate('SignUp')}>
        Register
      </Button>
    </Layout>
    </SafeAreaView>
  );
}

export default LandingPage;

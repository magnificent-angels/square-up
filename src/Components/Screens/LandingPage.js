import React, { useContext } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../../Context/UserContext';
import { StyleSheet } from 'react-native';


function LandingPage() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  return (
    <Layout style={styles.container}>
      {!user ? (
        <>
          <Text category='h1'>Logo goes here</Text>
          <Button style={styles.button} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Button>
          <Button style={styles.button} onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Button>
        </>
      ) : (
        <Button onPress={() => navigation.navigate('Profile')}>
          Go to Profile
        </Button>
      )}
    </Layout>
  );
}

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginVertical: 4,
  },
});

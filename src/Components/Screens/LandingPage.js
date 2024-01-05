import React, { useContext, useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../../Context/UserContext';
import { Dimensions, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';


function LandingPage() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const TopAnimation = useRef(null);
  const BoardGameAnimation = useRef(null);
  const BottomAnimation = useRef(null);
  return (
    <Layout style={styles.container}>
      {!user ? (
        <>
        <LottieView
            autoPlay
            ref={TopAnimation}
            style={{
              position: 'absolute',
              width: Dimensions.get('window').width,
              height: 'auto',
              top: 0,
            }}
            source={require('../../../assets/animations/TopAnimation.json')}
          />
          <LottieView
            autoPlay
            ref={BoardGameAnimation}
              style={{
              width: 350,
              height: 'auto',
              left: 8.5,
              top: -2.5,
            }}
            source={require('../../../assets/animations/BoardGame.json')}
          />
          <Text category='h1' style={styles.landingHeader}>Connect with Game Enthusiasts Like You!</Text>
            <Button style={styles.button} onPress={() => navigation.navigate('SignIn')} size='large'>
              Log In
              </Button>
            <Button style={styles.button} onPress={() => navigation.navigate('SignUp')} size='large'>
              Join SquareUp
            </Button>
          <LottieView
            autoPlay
            ref={BottomAnimation}
            style={{
              width: Dimensions.get('window').width,
              height: 'auto',
              position: 'absolute',
              bottom: 0,
            }}
            source={require('../../../assets/animations/bottomAnimation.json')}
          />
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
    paddingVertical: 10,
    marginVertical: 4,
    fontSize: 20,
    width: 200,
  },
  landingHeader: {
    textAlign: 'center',
    marginBottom: 50,
  }
});

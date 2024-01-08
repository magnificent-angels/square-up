import React, { useState, useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

function LandingPage() {
  const [isTopReversed, setIsTopReversed] = useState(false);

  const navigation = useNavigation();
  const TopAnimation = useRef(null);
  const BoardGameAnimation = useRef(null);
  const BottomAnimation = useRef(null);

  const handleTopAnimationFinish = () => {
    setIsTopReversed(!isTopReversed);
    TopAnimation.current.play(isTopReversed ? 0 : 100, isTopReversed ? 100 : 0);
  };

  return (
    <Layout style={styles.container}>
      <LottieView
        autoPlay
        ref={TopAnimation}
        style={styles.topAnimation}
        source={require('../../../assets/animations/TopAnimation.json')}
        speed={1}
        loop={false}
        onAnimationFinish={handleTopAnimationFinish}
      />
      <LottieView
        autoPlay
        ref={BoardGameAnimation}
        style={styles.boardGameAnimation}
        source={require('../../../assets/animations/BoardGame.json')}
      />
      <Text category='h1' style={styles.landingHeader}>
        Connect with Game Enthusiasts Like You!
      </Text>
      <Button style={styles.button} onPress={() => navigation.navigate('SignIn')} size='large'>
        Log In
      </Button>
      <Button style={styles.button} onPress={() => navigation.navigate('SignUp')} size='large' appearance='ghost'>
        Join SquareUp
      </Button>
      <LottieView
        autoPlay
        ref={BottomAnimation}
        style={styles.bottomAnimation}
        source={require('../../../assets/animations/bottomAnimation.json')}
        speed={1.35}
      />
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
  topAnimation: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: 'auto',
    top: 0,
  },
  boardGameAnimation: {
    width: 350,
    height: 'auto',
    left: 8.5,
    top: -2.5,
  },
  bottomAnimation: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: 'auto',
    bottom: 0,
  },
  button: {
    paddingVertical: 10,
    marginVertical: 4,
    fontSize: 20,
    width: 200,
    zIndex: 1,
  },
  landingHeader: {
    textAlign: 'center',
    marginBottom: 50,
  },
});

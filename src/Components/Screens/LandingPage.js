import { View, Text,Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native"


function LandingPage() {
  const nav = useNavigation()

  return (
    <View>
      <Text>Logo goes here</Text>
      <Pressable onPress={()=>{ nav.navigate('SignUp') }}>
        <Text>Sign up</Text>
      </Pressable>
      <Pressable onPress={()=>{ nav.navigate('SignIn')}}>
        <Text>Sign in</Text>
      </Pressable>
    </View>
  );
}

export default LandingPage;

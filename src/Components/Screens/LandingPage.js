import { View, Text,Pressable } from "react-native";

function LandingPage() {
  return (
    <View>
      <Text>Logo goes here</Text>
      <Pressable onPress={onPressFunction}>
        <Text>Log In</Text>
      </Pressable>
    </View>
  );
}

export default LandingPage;

import { Layout, Card, Button, Avatar, Divider } from "@ui-kitten/components";
import { FlatList, View, Text, Image, ImageBackground, SafeAreaView, StyleSheet } from "react-native";
// import { ImageBackground } from "react-native-web";

function WishList({ wishListItem }) {

    console.log(wishListItem)
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wishListItem}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Image source={{ uri: item.url }} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default WishList;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  profileContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#2766f9",
    borderTopColor: "#2766f9",
    borderTopWidth: 8,
    boxShadow: "0px 0px 5px 5px rgba(0,0,0,0.9)",
  },
  content: {
    alignSelf: "center",
  },
  contentContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#2766f9",
    borderTopColor: "#2766f9",
    borderTopWidth: 4,
    boxShadow: "0px 0px 5px 5px rgba(0,0,0,0.9)",
    position: "relative",
    padding: 5,
  },
  editIcon: {
    top: 2,
    right: -60,
    position: "absolute",
    color: "white",
  },
  editDescription: {
    top: 8,
    right: -35,
    position: "absolute",
  },
  createIcon: {
    top: 1,
    right: -75,
    position: "absolute",
    color: "white",
  },
  createDescription: {
    top: 5,
    right: -50,
    position: "absolute",
  },
});

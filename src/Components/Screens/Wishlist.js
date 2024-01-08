import { Layout, Card, Button, Avatar, Divider } from "@ui-kitten/components";
import { FlatList, View, Text, Image, ImageBackground, SafeAreaView, StyleSheet } from "react-native";

function WishList({ wishListItem }) {

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wishListItem}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Image style={styles.image} source={{ uri: item.url }} />
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
  },
  itemContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 200, 
    height: 200,
    resizeMode: "cover", 
    borderRadius: 10, 
  },
});

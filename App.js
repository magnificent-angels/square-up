import { NavigationContainer } from "@react-navigation/native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import Theme from "./assets/Themes.json";
import { UserProvider } from "./src/Components/Context/UserContext";
import Main from "./src/Components/Navigation/Main";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function App() {
  return (
    <UserProvider>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...Theme }}>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </ApplicationProvider>
    </UserProvider>
  );
}

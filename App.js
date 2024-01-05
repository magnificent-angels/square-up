import { NavigationContainer } from "@react-navigation/native";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import Theme from './assets/Themes.json'
import { UserProvider } from "./Context/UserContext";
import Main from "./src/Components/Navigation/Main";

export default function App() {
  


  return (
    <UserProvider>
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...Theme }}>
        <NavigationContainer>
          <Main/>
        </NavigationContainer>
      </ApplicationProvider>
    </UserProvider>
  );
}



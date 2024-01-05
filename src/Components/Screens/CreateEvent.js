import { Text, TextInput} from 'react-native'
import { auth } from '../../firebase'
import {collection, query, where, doc, getDoc} from 'firebase/firestore'
import { db } from '../../firebase'
import { useEffect, useState } from 'react'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

function CreateEvent({game}) {

  const [userData, setUserData] = useState(null)
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState=(dayjs())
  const [deadline, setDeadline] = useState(dayjs())
  const [location, setLocation] = useState('')

  const user = auth.currentUser

  const onSubmit = data => console.log(data);

  useEffect(() => {
    const docRef = doc(db, "users", user.uid)
    getDoc(docRef).then((result) => {
      setUserData(result.data())
    })
  }, [])

  const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } = game
  const eventObj = {
    gameName: name,
    minPlayers,
    maxPlayers,
    playingTime,
    imageUrl
  }


  if (user) return (
  <SafeAreaView>
    <Text>Organise an event, {userData.username}!</Text>
    <Text style={styles.label}>Name of event: </Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeEventName}
      value={eventName}
    />
    <Text>Select the date and time for your event: </Text>
    {/* <DateTimePicker 
      value={eventDate}
      onValueChange={(date) => setEventDate(date)}
    />     */}
    <Text>What is the deadline for signing up?</Text>
    {/* <DateTimePicker 
      value={deadline}
      onValueChange={(date) => setDeadline(date)}
    /> */}
    <Text>Enter a postcode for the event: </Text>
    <TextInput 
      style={styles.input}
      onChangeText={onChangeLocation}
      value={location}
      placeholder="eg M1 7ED"
    />
    <Button title="Create event" onSubmit={handleSubmit(onSubmit)}></Button>
  </SafeAreaView>
  );

}


const styles = StyleSheet.create({
input: {
  height: 40,
  margin: 12,
  borderWidth: 1,
  padding: 10,
},
});


export default CreateEvent
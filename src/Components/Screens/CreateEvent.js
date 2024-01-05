import { Text, TextInput, View, StyleSheet, Button } from 'react-native'
import { auth } from '../../firebase'
import { doc, getDoc, GeoPoint } from 'firebase/firestore'
import { db } from '../../firebase'
import { useEffect, useState } from 'react'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { getLatLong } from '../../utils/postcodeLookup'

function CreateEvent({game}) {

  const [userData, setUserData] = useState(null)
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(dayjs())
  const [deadline, setDeadline] = useState(dayjs())
  const [postcode, setPostcode] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  const user = auth.currentUser
  const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } = game
  
  const onSubmit = () => {
    getLatLong(postcode)
    .then(({latitude, longitude}) => {
      setLatitude(latitude)
      setLongitude(longitude)
    })
    .then(() => {
      const eventObj = {
        location: new GeoPoint(latitude, longitude),
        eventName,
        eventDate,
        deadline,
        organiserUsername: userData.username,
        organiserUid: user.uid,
        gameName: name,
        minPlayers,
        maxPlayers,
        playingTime,
        imageUrl,
      }
    })
  }

  useEffect(() => {
    const docRef = doc(db, "users", user.uid)
    getDoc(docRef).then((result) => {
      setUserData(result.data())
      setIsLoading(false)
    })
  }, [])


  if (isLoading) return <Text>Loading...</Text>

  return (
  <View>
    <Text>Organise an event, {userData.username}!</Text>
    <Text style={styles.label}>Name of event: </Text>
    <TextInput
      style={styles.input}
      onChangeText={(input) => setEventName(input)}
      value={eventName}
    />
    <Text>Select the date and time for your event: </Text>
    <DateTimePicker 
      value={eventDate}
      onValueChange={(date) => setEventDate(date)}
    />    
    <Text>What is the deadline for signing up?</Text>
    <DateTimePicker 
      value={deadline}
      onValueChange={(date) => setDeadline(date)}
    />
    <Text>Enter a postcode for the event: </Text>
    <TextInput 
      style={styles.input}
      onChangeText={(input) => setPostcode(input)}
      value={postcode}
      placeholder="eg M1 7ED"
    />
    <Button title="Submit" onPress={onSubmit}></Button>

  </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "80%",
  },
  label : {
    fontSize: 16
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  formHeader: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default CreateEvent
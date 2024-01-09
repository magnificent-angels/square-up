import { Layout, Text, Input, Button, Spinner, RangeCalendar } from '@ui-kitten/components';
import { useState, useEffect } from 'react';
import { getLatLong } from '../../utils/postcodeLookup';
import { auth, db } from '../../firebase';
import { doc, getDoc, GeoPoint, addDoc, collection } from 'firebase/firestore';
import { StyleSheet } from 'react-native';

function CreateEvent({ game, setEventBeingCreated, setEventCreated }) {
  const [userData, setUserData] = useState(null);
  const [eventName, setEventName] = useState('');
  const [dateRange, setDateRange] = useState({});
  const [postcode, setPostcode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const user = auth.currentUser;
  const { name, minPlayers, maxPlayers, playingTime, imageUrl } = game;

  const onSubmit = () => {
    if (dateRange.startDate && dateRange.endDate) {
      getLatLong(postcode)
        .then(({ latitude, longitude }) => {
          const dateTime = dateRange.startDate.getTime();
          const eventDeadline = dateRange.endDate.getTime();
          return [dateTime, eventDeadline, latitude, longitude];
        })
        .then(([dateTime, eventDeadline, latitude, longitude]) => {
          return addDoc(collection(db, 'events'), {
            location: new GeoPoint(latitude, longitude),
            eventName,
            dateTime,
            eventDeadline,
            organiserUsername: userData.username,
            organiserUid: user.uid,
            gameName: name,
            minPlayers: +minPlayers,
            maxPlayers: +maxPlayers,
            playingTime: +playingTime,
            imageUrl,
          });
        })
        .then(() => {
          setEventName('');
          setDateRange({});
          setPostcode('');
          setEventCreated(true);
          setEventBeingCreated(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const docRef = doc(db, 'users', user.uid);
    getDoc(docRef).then((result) => {
      setUserData(result.data());
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return (
    <Layout style={styles.loadingContainer}>
      <Spinner size='giant' />
    </Layout>
  );

  return (
    <Layout style={styles.container}>
      <Text category="h5">Organise an event {userData.username}!</Text>
      <Input
        placeholder="Enter event name"
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
        label={"Enter a name for the event:"}
      />
      <Text>Select the date range for your event:</Text>
      <RangeCalendar
        range={dateRange}
        onSelect={setDateRange}
      />
      <Input
        placeholder="eg M1 7ED"
        value={postcode}
        onChangeText={setPostcode}
        style={styles.input}
        label={"Enter a postcode for the event:"}
      />
      <Button onPress={onSubmit} style={styles.button}>
        Submit
      </Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  label: {
    marginVertical: 8,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
});

export default CreateEvent;

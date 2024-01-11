import { Layout, Text, Input, Button, Spinner, RangeCalendar } from '@ui-kitten/components';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Context/UserContext';
import dayjs from 'dayjs';
import { getLatLong } from '../../utils/postcodeLookup';
import { db } from '../../firebase';
import { doc, getDoc, GeoPoint, addDoc, collection } from 'firebase/firestore';
import { StyleSheet } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function CreateEvent({ game, setEventBeingCreated, setEventCreated }) {
  const [eventName, setEventName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [eventDate, setEventDate] = useState(dayjs());
  const [eventTime, setEventTime] = useState("");
  const [deadline, setDeadline] = useState(dayjs());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDeadlinePickerVisible, setDeadlinePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const { user, events, setEvents } = useContext(UserContext);
  const { name, minPlayers, maxPlayers, playingTime, imageUrl } = game;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const showDeadlinePicker = () => {
    setDeadlinePickerVisibility(true);
  };

  const hideDeadlinePicker = () => {
    setDeadlinePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setEventDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    setEventTime(time);
    hideTimePicker();
  };

  const handleDeadlineConfirm = (date) => {
    setDeadline(date);
    hideDeadlinePicker();
  };

  const handleDates = () => {
    const dateString = eventDate.toISOString();
    const timeString = eventTime.toISOString();
    const newDateString = dateString.slice(0, 11).concat(timeString.slice(11));
    const newDate = new Date(newDateString);
    const milliseconds = newDate.getTime();
    return milliseconds;
  };

  const handleDeadline = () => {
    const dateString = deadline.toISOString()
    const timeString = eventTime.toISOString()
    const newDateString = dateString.slice(0, 11).concat(timeString.slice(11))
    const newDate = new Date(newDateString)
    const milliseconds = newDate.getTime()
    return milliseconds
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const onSubmit = () => {
      getLatLong(postcode)
        .then(({ latitude, longitude }) => {
          const dateTime = handleDates(eventDate)
          const eventDeadline = handleDeadline(deadline)
          return [dateTime, eventDeadline, latitude, longitude];
        })
        .then(([dateTime, eventDeadline, latitude, longitude]) => {
          return addDoc(collection(db, 'events'), {
            location: new GeoPoint(latitude, longitude),
            eventName,
            dateTime,
            eventDeadline,
            organiserUsername: user.displayName,
            organiserUid: user.uid,
            organiserAvatar: user.photoURL,
            gameName: name,
            minPlayers: +minPlayers,
            maxPlayers: +maxPlayers,
            playingTime: +playingTime,
            imageUrl,
            attendees: [{ username: user.displayName, avatarUrl: user.photoURL }],
            waitlist: []
          });
        })
        .then(() => {
          setEventName('')
          setEventTime('')
          setEventDate(dayjs())
          setDeadline(dayjs())
          setPostcode('')
          setEventCreated(true)
          setEventBeingCreated(false)
          setIsLoading(false)
        })
        .catch((err) => {
          console.log(err);
        });
  };

  if (isLoading)
    return (
      <Layout style={styles.loadingContainer}>
        <Spinner size="giant" />
      </Layout>
    );

  return (
    <Layout style={styles.container}>
      <Text category="h6" style={styles.header}>
        Organise an event, {userData.username}!
      </Text>
      <Input
        placeholder="Enter event name"
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
        label={"Enter a name for the event:"}
      />
      <Text category="label" style={styles.label}>
        Select the date and time for your event:
      </Text>
      <Button title="Show Date Picker" onPress={showDatePicker} style={styles.button}>
        Select the date
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <Button title="Show Time Picker" onPress={showTimePicker} style={styles.button}>
        Select the time
      </Button>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
      <Text category="label" style={styles.label}>
        What is the deadline for signing up?
      </Text>
      <Button title="Show Deadline Picker" onPress={showDeadlinePicker} style={styles.button}>
        Deadline date for signup
      </Button>
      <DateTimePickerModal
        isVisible={isDeadlinePickerVisible}
        mode="date"
        onConfirm={handleDeadlineConfirm}
        onCancel={hideDeadlinePicker}
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
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    textAlign: "center",
    paddingBottom: 10,
  },
  label: {
    textAlign: "left",
    fontWeight: "800",
    fontSize: 12,
    color: "#8F9BB3",
    fontFamily: "System",
    marginBottom: 4,
    marginLeft: "4%",
  },
  input: {
    margin: 10,
  },
  button: {
    marginBottom: 15,
    width: "92.5%",
    alignSelf: "center",
  },
});

export default CreateEvent;

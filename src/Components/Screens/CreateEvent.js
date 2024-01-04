import {View, Text} from 'react-native'
import { auth } from '../../firebase'
import {collection, query, where, doc, getDoc} from 'firebase/firestore'
import { db } from '../../firebase'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { TextInput } from 'react-native-web'



function CreateEvent({game}) {
const [userData, setUserData] = useState(null)
const { register, handleSubmit, formState: { errors } } = useForm();
console.log(errors);
const user = auth.currentUser

const onSubmit = data => console.log(data);

useEffect(() => {
    
    const docRef = doc(db, "users", user.uid)
    getDoc(docRef).then((result) => {
        setUserData(result.data())
    } )

}, [])

const eventObj = {}


    const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } = game

 if (user) return (
<View>
    <Text>Organise an event, {userData.username}!</Text>
  
      <TextInput type="text" placeholder="Event name:" {...register("Event name:", {required: true, maxLength: 50})} />
      <TextInput type="datetime-local" placeholder="Date:" {...register("Date:", {required: true})} />
      <TextInput type="text" placeholder="Postcode:" {...register("Postcode:", {required: true})} />
      <TextInput type="submit" />
      <Button title="Create event" onSubmit={handleSubmit(onSubmit)}></Button>
</View>
  );
}





export default CreateEvent
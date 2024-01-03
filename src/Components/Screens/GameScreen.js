import getGame from "../../utils/gamesApi"
import { useState, useEffect } from 'react'
import {View, Text, Image} from 'react-native'

function GameScreen(search) {
  const [game, setGame] = useState({})

  const lookup = search.search
  
  useEffect(() => {
            getGame(lookup)
            .then((gameData) => {
                setGame(gameData)
            })}, [search])
  
        const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } = game
  
        return (
            <View>
                <Text>{name}</Text>
                <Image source={{ uri: `${imageUrl}`}} style={{width: 100, height: 100}}></Image>
                <Text>{minPlayers} - {maxPlayers} players</Text>
                <Text>Approximate play time: {playingTime} minutes</Text>
            </View>
        )
 
}

export default GameScreen
import getGame from "../../utils/gamesApi"
import { useState, useEffect } from 'react'
import {View, Text, Image} from 'react-native'

const Error = (props) => {
    const { msg } = props
    return (
        <View> 
            <Text>{msg}</Text>
        </View>
        )
     }

function GameScreen(search) {
  const [game, setGame] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
      setIsLoading(true)
      setIsError(false)
      getGame(search.search)
      .then((gameData) => {
            setGame(gameData)
            setIsLoading(false)
            })
        .catch(() => {
            setIsError(true)
            setIsLoading(false)
        })}, [search])
  
        if (isError) return <Error msg="Game not found" />
        
        const { name, description, minPlayers, maxPlayers, playingTime, imageUrl } = game

        return (
            <View>
                {isLoading ? <Text>Loading...</Text> :
                <View>
                    <Text>{name}</Text>
                    <Image source={{ uri: `${imageUrl}`}} style={{width: 100, height: 100}}></Image>
                    <Text>{minPlayers} - {maxPlayers} players</Text>
                    <Text>Approximate play time: {playingTime} minutes</Text>
                </View>
                }
            </View>
        )
 
}

export default GameScreen
import axios from 'axios'

const bggApi = axios.create({
    baseURL: 'https://boardgamegeek.com/xmlapi'
})
const getGame = (game) => {
    const XMLParser = require('react-xml-parser')
    const urlifiedGame = game.replaceAll(' ', '%20')
    const url = `/search?search=${urlifiedGame}&exact=1`
    return bggApi.get(url)
    .then(({data}) => {
        const xml = new XMLParser().parseFromString(data);
        const firstResult = {
            name: xml.getElementsByTagName('name')[0].value,
            id: xml.getElementsByTagName('boardgame')[0].attributes.objectid
            }
        return firstResult
    })
    .then((firstResult) => {
        return bggApi.get(`/boardgame/${firstResult.id}`)
    })
    .then(({data}) => {
        const xml = new XMLParser().parseFromString(data);
        const names = xml.getElementsByTagName('name')
        const name = names.find((name) => {
            return name.attributes.primary === 'true'
        })
        const gameData = {
            id: xml.getElementsByTagName('boardgame')[0].attributes.objectid,
            name: name.value,
            description: xml.getElementsByTagName('description')[0].value,
            imageUrl: xml.getElementsByTagName('image')[0].value,
            minPlayers: xml.getElementsByTagName('minplayers')[0].value,
            maxPlayers: xml.getElementsByTagName('maxplayers')[0].value,
            playingTime: xml.getElementsByTagName('playingtime')[0].value,
        }
        return gameData
    })
    .catch((err) => {
        return Promise.reject()
    })
}
export default getGame



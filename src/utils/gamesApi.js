import axios from 'axios'
const bggApi = axios.create({
    baseURL: 'https://boardgamegeek.com/xmlapi'
})
const getGame = (game) => {
    console.log(game)
    const XMLParser = require('react-xml-parser');
    return bggApi.get(`/search`, {
        params: {
            search: game,
            exact: 1,
        headers: {
            "content-type": "application/xml; charset=utf-8"
            }
        }
    })
    .then(({data}) => {
        const xml = new XMLParser().parseFromString(data);
        console.log(xml)
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
        console.log('fetch', err)
    })
}
export default getGame



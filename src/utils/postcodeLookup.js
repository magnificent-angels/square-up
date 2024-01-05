import axios from "axios"

export const getLatLong = (postcode) => {
    return axios.get(`http://api.postcodes.io/postcodes/${postcode}`)
    .then(({data}) => {
        const { latitude, longitude } = data.result
        return { latitude, longitude }
    })
    .catch((err) => {
        console.log(err)
    })
} 
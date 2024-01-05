import axios from "axios"

export const getLatLong = (postcode) => {
    return axios.get(`GETapi.postcodes.io/postcodes/${postcode}`)
    .then((res) => {
        console.log(res)
    })
} 
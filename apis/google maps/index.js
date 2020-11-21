const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const queryString = require('query-string');
const fetch = require("node-fetch");

const GM_PLACES_ENDPOINT = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"
const GM_PLACES_DETAILS_ENDPOINT = "https://maps.googleapis.com/maps/api/place/details/json?"

const GM_PLACES_PARAMS = {
    inputtype: "textquery",
    key: GOOGLE_MAPS_API_KEY
}

const GM_PLACES_DETAILS_PARAMS = {
    fields: "address_components",
    key: GOOGLE_MAPS_API_KEY
}

const fetchGMPlaceID = async query => {
    const params = { ...GM_PLACES_PARAMS, input: query }
    const urlParams = queryString.stringify(params)
    const url = GM_PLACES_ENDPOINT + urlParams
    let results = await fetch(url)
        .then(res => res.json())
        .then(json => json.candidates[0].place_id)
        .catch(err => new Error(err))
    return results
}

const fetchGMPlaceDetails = async query => {
    const params = { ...GM_PLACES_DETAILS_PARAMS, place_id: query }
    const urlParams = queryString.stringify(params)
    const url = GM_PLACES_DETAILS_ENDPOINT + urlParams
    let results = await fetch(url)
        .then(res => res.json())
        .then(json => json)
        .catch(err => new Error(err))
    return results
}

module.exports = {
    getPlaceID: fetchGMPlaceID,
    getPlaceDetails: fetchGMPlaceDetails
}
const express = require('express');
const router = express.Router();
const GM = require('../apis/google maps/index');
const util = require('../util');
const cache = require("../cache");
const { request } = require('../app');

router.post('/location', async (req, res) => {
    const { location } = req.body
    let data, results
    data = cache.getQuery(location)

    try {
        // Check if this query has been searched already within GoogleAPI
        if(!data) {
            const placeID = await GM.getPlaceID(location)
            results = await GM.getPlaceDetails(placeID)
            cache.setQuery(location, results)
        } else { results = data }

        const { locality, admin_level } = util.determineLocality(results)
        let fields = await util.covidDataPipelineV2(locality, admin_level).then(fields => fields)
        res.json(fields).status(200);
    } catch(err) {
        console.log(err)
        res.send("Could not find place").status(200);
    }
})

// This function is a poor consequence of Short Cut's short comings
router.get('/fields', async (req, res) => {
    let decoded = decodeURI(req.url + ".")
    let data = decoded.split("?").slice(1)
    let state = data[0]
    let fields = data[1].split(".").filter(arr => arr.length)

    let output = []
    for(let f of fields) { output = [...output, f.trim()] }
    fields = util.identifyFields(output)
    const { requestedData } = await util.fetchFilteredData(fields, state)
    const speech = util.generateSpeech(requestedData, state)
    res.send(speech).status(200);
})

module.exports = router;
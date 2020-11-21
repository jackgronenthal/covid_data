const express = require('express');
const router = express.Router();
const GM = require('../apis/google maps/index');
const util = require('../util');

router.post('/location', async (req, res) => {
    const { location } = req.body
    try {
        let placeID = await GM.getPlaceID(location)
        let results = await GM.getPlaceDetails(placeID)
        let locationData = util.determineLocality(results)
        let data = await util.covidDataPipeline(locationData)
        let output = util.convertDataToSpeech(data)
        res.send(output).status(200);
    } catch(err) {
        console.log(err)
        res.send("Could not find place").status(200);
    }
})

module.exports = router;
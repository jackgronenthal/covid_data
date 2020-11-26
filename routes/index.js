const express = require('express');
const router = express.Router();
const GM = require('../apis/google maps/index');
const util = require('../util');

router.post('/location', async (req, res) => {
    const { location } = req.body
    try {
        let placeID = await GM.getPlaceID(location)
        let results = await GM.getPlaceDetails(placeID)
        const { locality, admin_level } = util.determineLocality(results)

        // let data = await util.covidDataPipeline(locationData)
        // let output = util.convertDataToSpeech(data)
        let fields = await util.covidDataPipelineV2(locality, admin_level).then(fields => fields)
        res.send(JSON.stringify({ fields })).status(200);
    } catch(err) {
        console.log(err)
        res.send("Could not find place").status(200);
    }
})

module.exports = router;
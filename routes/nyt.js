const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const neatCsv = require('neat-csv');
const { COUNTRY_LABEL, STATE_ADMIN_LEVEL: STATE_ADMIN_LEVEL, COUNTY_LABEL } = require('../constants');


const NYT_URL_GEN = path => `https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-${path}.csv`
const NYT_HIST_URL_GEN = path => `https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-${path}.csv`

const LIVE_US = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us.csv"
const LIVE_STATES = NYT_URL_GEN("states")
const LIVE_COUNTIES = NYT_URL_GEN("counties")
const HIST_US = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv"
const HIST_STATES = NYT_HIST_URL_GEN("states")
const HIST_COUNTIES = NYT_HIST_URL_GEN("counties")

const live = async level => {
    let url
    switch(level) {
        case COUNTY_LABEL:
            url = LIVE_COUNTIES; break;
        case STATE_ADMIN_LEVEL:
            url = LIVE_STATES; break;
        default:
            url = LIVE_US;
    }
    let csv = await fetch(url).then(res => res.text()).then(text => text).catch(err => err)
    return await (async () => await neatCsv(csv))();
}

const hist = async level => {
    let url
    switch(level) {
        case COUNTY_LABEL:
            url = HIST_COUNTIES; break;
        case STATE_ADMIN_LEVEL:
            url = HIST_STATES; break;
        default:
            url = HIST_US;
    }
    let csv = await fetch(url).then(res => res.text()).then(text => text).catch(err => err)
    return await (async () => await neatCsv(csv))();
}

module.exports = {
    live,
    hist,
    router
}
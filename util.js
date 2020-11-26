const { format } = require("morgan")
const cache = require('./cache');
const NYT = require('./routes/nyt')
const { COUNTRY_LABEL, STATE_ADMIN_LEVEL: STATE_ADMIN_LEVEL , COUNTY_LABEL } = require('./constants');
const { live } = require("./routes/nyt");
const fs = require('fs');
const CTP = require("./apis/covidtracking")

const HIST_PREF = "HIST_"

const determineLocality = places => {

    const formatter = (locality, admin_level, buffer = undefined) => ({ locality, admin_level, buffer })
    let data = places.result.address_components;
    let county
    for(let i = 0; i < data.length; i++) {
        let { types } = data[i]
        
        if(types[0] === COUNTY_LABEL) county = data[i].long_name
        if(types[0] === STATE_ADMIN_LEVEL) {
            if(county) {
                return formatter(county, COUNTY_LABEL, data[i].long_name)
            } else {
                return formatter(data[i].long_name, STATE_ADMIN_LEVEL)
            }
        }
        if(types[0] === COUNTRY_LABEL) return formatter(data[i].long_name, COUNTRY_LABEL)
            
    }
}

const refreshCovidData = async (level, name) => { 
    data = cache.getVal(level)
    let data_hist = cache.getVal(HIST_PREF + level + name)
    if(data && data_hist) { return { status: true, data: data.value, data_hist: data_hist.value }}
    data = await NYT.live(level)
    if(level === STATE_ADMIN_LEVEL) 
        data_hist = await CTP.hist(name)
    status = cache.setVal(level, data)
    status_hist = cache.setVal(HIST_PREF + level + name, data_hist)
    return { status: status && status_hist, data, data_hist }
}

const refresh = async level => {
    if(level.slice(5) === HIST_PREF) {
        data_hist = await NYT.hist(level)
    } else {
        data = await NYT.live(level)
    }
}

const extractLocality = async (data, data_hist, name, level, buffer) => {
    let key 
    switch(level) {
        case COUNTY_LABEL:
            key = "county"; break;
        case STATE_ADMIN_LEVEL:
            key = "state"; break;
        default:
            key = "country";
    }
    if(key === 'country') {
        const live = data[0]
        const hist = await CTP.hist_country()
        return { live, hist }
    }
    if(key === 'state') {
        const live = data.filter(place => place[key].toLowerCase() === name.toLowerCase())[0]
        const hist = { ... await CTP.hist(name), state: name }
        return { live, hist }
    }
    if(key === 'county')
        county = name.toLowerCase().slice(0, name.indexOf("County")).trim()
        return { live: data.filter(place => place[key].toLowerCase() === county.toLowerCase() && place['state'].toLowerCase() === buffer.toLowerCase())[0] }
}

const covidDataPipeline = async ({ name, level, buffer }) => {
    const { status, data, data_hist } = await refreshCovidData(level, name)
    if(!status) { return new Error("Could not refresh NYT data.") }
    return extractLocality(data, data_hist, name, level, buffer)
}

const convertDataToSpeech = ({ live, hist }) => {
    const { cases, county, state, deaths } = live
    let hist_cases = 1
    if(hist) hist_cases = hist.cases
    
    percent_change = Number(((() => 100 * (cases - hist_cases) / hist_cases )()).toFixed(1));
    mag_change = (() => Math.abs(cases - hist_cases))();
    if(county) 
        return `The New York Times reports that ${county} county has had ${cases} cases of COVID-19.` 
    if(state)
        return `The New York Times reports that the state of ${state} has had ${cases} cases of COVID-19. Within the last week, there has been ${percent_change >= 0 ? "an increase" : "a decrease"} of ${mag_change} cases, a change of ${percent_change} percent.`
    return `The New York Times reports that the United States has had ${cases} cases of COVID-19. Within the last week, there has been ${percent_change >= 0 ? "an increase" : "a decrease"} of ${mag_change} cases, a change of ${percent_change} percent.`
}

const initialize_data = () => {
    categories = [
        COUNTY_LABEL, STATE_ADMIN_LEVEL, COUNTRY_LABEL
    ]
    categories_to_update = []
    for(let i = 0; i < categories.length; i++) {
        success = cache.getVal(categories[i])
        if(success) continue
        refresh(categories[i])
    }
}

/**
 * 
 * @param {String} locality: The name of the location (e.g. Illinois, Kane County, United States)
 * @param {String} admin_level: The Google Maps administration level 
 */
const covidDataPipelineV2 = (locality, admin_level) => {
    const isLocalityState = admin_level => admin_level === STATE_ADMIN_LEVEL
    
    if(isLocalityState(admin_level)) { return covidDataPipelineV2State(locality) }
    return "NOT IMPLEMENTED YET"
}

const covidDataPipelineV2State = async locality => {
    const fields = await CTP.fetchStateFields(locality).then(fields => fields).catch(err => err)
    return orderToggledFields(fields)
}

// Removes Date and State from response; orders based off relevance for user to toggle
const orderToggledFields = fields => {
    const extractObjValue = obj => obj[Object.keys(obj)[0]]
    const extractProperty = obj => Object.keys(obj)[0]

    fields.sort((a, b) => extractObjValue(a) - extractObjValue(b))
    for(let key of fields) { console.log(extractProperty(key)) }
    return 
}

module.exports = {
    determineLocality,
    covidDataPipeline,
    convertDataToSpeech,
    initialize_data,
    covidDataPipelineV2,
    covidDataPipelineV2State
}
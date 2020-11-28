const COUNTY_LABEL = "administrative_area_level_2"
const STATE_ADMIN_LEVEL = "administrative_area_level_1"
const COUNTRY_LABEL = "country"

const ENABLED_FIELDS = {'positive': { order: 0, readableName: "Positive Cases", description: "Total amount of positive cases." }, 
'totalTestResults': { order: 5, readableName: "Performed Tests", description: "Total amount of performed tests." }, 
'hospitalizedCurrently': { order: 7, readableName: "Currently Hospitalized", description: "Amount of present hospitalizations." }, 
'inIcuCurrently': { order: 8, readableName: "Currently in ICU", description: "Amount of present ICU patients." }, 
'onVentilatorCurrently': { order: 9, readableName: "Currently on Ventilator", description: "Amont of present patients on a ventilator." }, 
'death': { order: 1, readableName: "Deaths", description: "Total amount of deaths." }, 
"positiveIncrease": { order: 3, readableName: "Change in Positive Tests", description: "Amount change from yesterday's positive tests." }, 
"totalTestResultsIncrease": { order: 6, readableName: "Change in Tests Performed", description: "Amount change from yesterday's performed tests." },
"deathIncrease": { order: 4, readableName: "Change in Deaths", description: "Amount change from yesterday's deaths." }}

module.exports = {
    COUNTY_LABEL,
    STATE_ADMIN_LEVEL,
    COUNTRY_LABEL,
    ENABLED_FIELDS
}
const { hist } = require("./routes/nyt")

const COUNTY_LABEL = "administrative_area_level_2"
const STATE_ADMIN_LEVEL = "administrative_area_level_1"
const COUNTRY_LABEL = "country"

const ENABLED_FIELDS = {
    'positive': { order: 0, readableName: "Positive Cases", description: "Total amount of positive cases." }, 
    'totalTestResults': { order: 5, readableName: "Performed Tests", description: "Total amount of performed tests." }, 
    'hospitalizedCurrently': { order: 7, readableName: "Currently Hospitalized", description: "Amount of present hospitalizations." }, 
    'inIcuCurrently': { order: 8, readableName: "Currently in ICU", description: "Amount of present ICU patients." }, 
    'onVentilatorCurrently': { order: 9, readableName: "Currently on Ventilator", description: "Amont of present patients on a ventilator." }, 
    'death': { order: 1, readableName: "Deaths", description: "Total amount of deaths." }, 
    "positiveIncrease": { order: 3, readableName: "Change in Positive Tests", description: "Amount change from yesterday's positive tests." }, 
    "totalTestResultsIncrease": { order: 6, readableName: "Change in Tests Performed", description: "Amount change from yesterday's performed tests." },
    "deathIncrease": { order: 4, readableName: "Change in Deaths", description: "Amount change from yesterday's deaths." }
}

const prefix = state => `The COVID Tracking project reports that the state of ${state}`
const determineDirection = ({ value, hist_value }) => value >= hist_value ? "an increase" : "a decrease"
const determinePercentChange = ({ value, hist_value }) => Number((100 * Math.abs(value - hist_value) / value).toFixed(1))

const ENABLED_FIELDS_RESPONSE = {
    "positive": data => `${prefix(data.state)} has accumulated ${data.value} positive cases of COVID-19. One week ago ${data.state} had accumulated ${data.hist_value} positive cases, representing ${determineDirection(data)} of ${determinePercentChange(data)} percent.`,
    'totalTestResults': data => `${prefix(data.state)} has performed ${data.value} COVID-19 tests. One week ago ${data.state} had performed ${data.hist_value} tests, representing ${determineDirection(data)} of ${determinePercentChange(data)} percent.`,
    'hospitalizedCurrently': data => `${prefix(data.state)} has ${data.value} COVID-19 patients currently hospitalized. One week ago ${data.state} had ${data.hist_value} hospitalized patients, representing ${determineDirection(data)} of ${determinePercentChange(data)} percent.`,
    'inIcuCurrently': data => `${prefix(data.state)} has ${data.value} COVID-19 patients currently in the ICU. One week ago ${data.state} had ${data.hist_value} ICU patients, representing ${determineDirection(data)} of ${determinePercentChange(data)} percent.`,
    'onVentilatorCurrently': data => `${prefix(data.state)} has ${data.value} COVID-19 patients currently on a ventilator. One week ago ${data.state} had ${data.hist_value} ventilated patients, representing ${determineDirection(data)} of ${determinePercentChange(data)} percent.`,
    'death': data => `${prefix(data.state)} has accumulated ${data.value} deaths due to COVID-19. One week ago ${data.state} had accumulated ${data.hist_value} deaths, representing ${determineDirection(data)} of ${determinePercentChange(data)} percent.`
}

const STATES_BY_ABR = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

module.exports = {
    COUNTY_LABEL,
    STATE_ADMIN_LEVEL,
    COUNTRY_LABEL,
    ENABLED_FIELDS,
    ENABLED_FIELDS_RESPONSE,
    STATES_BY_ABR
}
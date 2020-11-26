const fetch = require('node-fetch');

const url =  ""
const gen_CTP_url = (state, date) => `https://api.covidtracking.com/v1/states/${state}/${date}.json`
const gen_CTP_COUNTRY_url = () => `https://api.covidtracking.com/v1/us/${one_week_ago()}.json`
const WEEK = 604800000

/** The state parameter should come in the form of a two-length long lower cased state abbreviation (e.g. il, ca, fl, ny) */
const genCurCtpUrl = state => `https://api.covidtracking.com/v1/states/${state.length === 2 ? state : STATES[state].toLowerCase()}/current.json`

const STATES = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'American Samoa': 'AS',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District Of Columbia': 'DC',
  'Federated States Of Micronesia': 'FM',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Guam': 'GU',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Marshall Islands': 'MH',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Northern Mariana Islands': 'MP',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Palau': 'PW',
  'Pennsylvania': 'PA',
  'Puerto Rico': 'PR',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virgin Islands': 'VI',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY'
}

const hist_country = async () => {
    let date = one_week_ago()
    let url = gen_CTP_COUNTRY_url()
    let results =  await fetch(url).then(res => res.json()).then(res => res).catch(err => err)
    return { cases: results.positive, deaths: results.death }
}

const one_week_ago = () => {
    let now = new Date()
    let hist_date = now - WEEK
    let histDate = new Date(hist_date)
    let year = histDate.getFullYear()
    let month = String(histDate.getUTCMonth() + 1)
    if(month.length === 1) month = "0" + month
    let day = String(histDate.getUTCDate())
    if(day.length === 1) day = "0" + day
    let date = year + month + day
    return date
}

const hist_state = async state => {
    let date = one_week_ago()
    let url = gen_CTP_url(STATES[state], date)
    let results =  await fetch(url).then(res => res.json()).then(res => res).catch(err => err)
    return { cases: results.positive, deaths: results.death }
}

const fetchStateFields = async state => {
    const enabledFields = { 
        'positive': 0, 
        'totalTestResults': 5, 
        'hospitalizedCurrently': 7, 
        'inIcuCurrently': 8, 
        'onVentilatorCurrently': 9, 
        'death': 1, 
        "positiveIncrease": 3, 
        "totalTestResultsIncrease": 6,
        "deathIncrease": 4
    }
    const st = STATES[state].toLowerCase()
    const url = genCurCtpUrl(st)
    const results = await fetch(url).then(res => res.json()).then(json => json)
    let fields = []
    for(const key in results) { if(results[key] !== undefined && key in enabledFields) fields = [...fields, { [key]: enabledFields[key] }] }
    return fields
} 

module.exports = {
    hist: hist_state,
    hist_country,
    fetchStateFields,
}


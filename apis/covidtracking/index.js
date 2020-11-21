const fetch = require('node-fetch');

const url =  ""
const gen_CTP_url = (state, date) => `https://api.covidtracking.com/v1/states/${state}/${date}.json`
const gen_CTP_COUNTRY_url = () => `https://api.covidtracking.com/v1/us/${one_week_ago()}.json`
const WEEK = 604800000

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

module.exports = {
    hist: hist_state,
    hist_country
}


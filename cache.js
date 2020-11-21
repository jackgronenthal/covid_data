const NodeCache = require('node-cache');
const UPDATE_PERIOD = 86400

const myCache = new NodeCache( { stdTTL: UPDATE_PERIOD, checkperiod: UPDATE_PERIOD + 20 } );

const getVal = key => {
    value = myCache.get(key);
    return value
}

const setVal = (key, value) => {
    let success = myCache.set(key, {key, value}, 10000);
    return success
}

module.exports = {
    getVal,
    setVal
}

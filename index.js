const { Requester, Validator } = require('@chainlink/external-adapter')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
    if (data.Response === 'Error') return true
    return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
// { "id": 1, "data": { "from": "ETH", "to": "USD" } }
const customParams = {
    base: ['base', 'from', 'coin'],
    quote: ['quote', 'to', 'market'],
    endpoint: false
}

const createRequest = (input, callback) => {
    const jobRunID = input.id;
    // https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD
    const params = {
        fsym: "ETH",
        tsyms: "USD",
    }
    const config = {
        url: "https://min-api.cryptocompare.com/data/price",
        params
    }
    Requester.request(config, customError)
        .then(response => {
            console.log(response.data.USD);
            callback(response.status, {jobRunID, USD: response.data.USD});
        })
        .catch(error => {
            callback(500, Requester.errored(jobRunID, error))
        })
}

module.exports.createRequest = createRequest

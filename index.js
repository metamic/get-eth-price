const { Requester, Validator } = require('@chainlink/external-adapter')

const customError = (data) => {
    if (data.Response === 'Error') return true
    return false
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

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
            const res = {
                jobRunID, 
                data: {
                    symbol: "ETH-USD",
                    last: {
                        price: response.data.USD,
                        timestamp: Date.now()
                      }
                }
            }
            callback(response.status, res);
        })
        .catch(error => {
            callback(500, Requester.errored(jobRunID, error))
        })
}

module.exports.createRequest = createRequest

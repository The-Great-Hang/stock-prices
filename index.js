var MarketUtil = require('./src/marketUtil.js');
var symbolsPromise = require('./src/symbols.js').symbols;
var dbUtil = require('./src/dbUtil.js');


var start = new Date("01/01/2012");
var end   = new Date("01/29/2017");




function fetchAndUpdate(symbol) {

    return Promise.all([dbUtil.earliestInDB(symbol), dbUtil.lastestInDB(symbol)])
        .then(vals => {
            var earlist = vals[0];
            var latest = vals[1];

            return Promise.all([
                MarketUtil.getHistorical(symbol, earlist, start),
                MarketUtil.getHistorical(symbol, latest, end),
            ]) 
            .then(prices => prices[0].concat(prices[1]))
        })
        .then(prices => {
            try {
                return dbUtil.insertIntoDB(prices);
            }
            catch(e) {
                console.log("Failed to fetch symbol ", symbol, e, prices);
            }

        })
        .then(() => console.log("Insert ", symbol, " done"))
}


symbolsPromise.then(symbols => {
    symbols.forEach(symbol => {
        MarketUtil.isSymbolOvercap(symbol)
            .then(bool => {
                if (bool) {
                    console.log("Start fetching symbol ", symbol);
                    fetchAndUpdate(symbol);
                }
            })
    });
})
.catch(error=>console.log(error));





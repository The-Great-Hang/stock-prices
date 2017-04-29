var yahooFinance = require('yahoo-finance');
var symbolsPromise = require('./symbols.js').symbols;
var moment = require('moment');



function getMarketCap(symbol) {

    return yahooFinance.snapshot({
        symbol: symbol,
        fields: ['s', 'j1']
    })
    .then(snapshot => {
        if (snapshot) {
            return snapshot.marketCapitalization;
        }
    });
}

function isSymbolOvercap(symbol, limit) {
    return getMarketCap(symbol)
        .then(cap => {
            if (cap.charAt(cap.length-1) === "B") {
                return true;
            }

            return false;
        })
        .catch(reason => false);
}

function getSymbolsOverCap(cap) {
    
    return symbolsPromise
        .then(symbols => 
            Promise.all(symbols.map(symbol => {
                return isSymbolOvercap(symbol)
                    .then(bool => bool ? symbol: null);
            }))
        )
        .then(values => 
            values.reduce((acc, val) => {
                if (val) {
                    acc.push(val);
                }
                return acc;
            }, [])
        )
}

function getHistorical(symbol, start, end) {

    if (start > end) {
        return Promise.resolve([]);
    }

    return yahooFinance.historical({
        symbol: symbol,
        from:  start,
        to:    end
    })
}


exports.getSymbolsOverCap = getSymbolsOverCap;
exports.isSymbolOvercap = isSymbolOvercap;
exports.getHistorical = getHistorical;;


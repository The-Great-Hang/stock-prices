var fs = require('fs');
var readline = require('readline');


function lineToSymbol(line) {
    return line.split(",")[0].slice(1, -1).trim();
}

function fileToSymbol(fileName) {
    return new Promise(function(fulfill) {

        var symbols = [];
        var file = readline.createInterface({
            input: fs.createReadStream(fileName)
        });

        file.on('line', function(line) {
            var symbol = lineToSymbol(line);
            if (symbol !== 'Symbol') {
                symbols.push(symbol);
            }
        });

        file.on('close', function() {
            fulfill(symbols);
        });
    });
}


exports.symbols = function() {

    return Promise.all([
        fileToSymbol('symbol_list/amex'),
        fileToSymbol('symbol_list/nyse'),
        fileToSymbol('symbol_list/nasdaq')
    ]).then(function(symbols) {
        return [].concat(symbols[0], symbols[1], symbols[2]);
    });
}()






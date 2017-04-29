var MongoClient = require('mongodb').MongoClient;



var dbCollection = function() {
    var url = "mongodb://localhost:27017/market";

    return MongoClient.connect(url)
        .then(db => {
            var collection = db.collection('historical_price');
            collection.createIndex({symbol: 1, date: 1, adjClose: 1});
            return collection;
        });
}();
        
function lastestInDB(symbol) {
    return dbCollection
        .then(collection => {
            return collection.find({symbol: symbol}).sort({date:-1}).limit(1).toArray()
        })
        .then(result => result[0].date)
        .catch(() => null);
}

function earliestInDB(symbol) {
    return dbCollection
        .then(collection => {
            return collection.find({symbol: symbol}).sort({date:1}).limit(1).toArray()
        })
        .then(result => result[0].date)
        .catch(() => null);

}

function insertIntoDB(prices) {
    prices.map(price => {
        price.date = new Date(price.date);
    })

    return dbCollection.then(collection => {
        return collection.insertMany(prices);
    });
}



exports.dbCollection = dbCollection;
exports.lastestInDB = lastestInDB;
exports.earliestInDB = earliestInDB;
exports.insertIntoDB = insertIntoDB;
        

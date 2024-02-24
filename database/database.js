const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;
const mongoURI = process.env.MONGODB_URI;

async function connectTo(){
    const connection =  await MongoClient.connect(mongoURI);
    database = connection.db('blog');
}


function DbConn(){
    if(!database){
        throw new Error('not connected');
    }
    return database;
}

module.exports = {
    connectTo : connectTo,
    DbConn: DbConn
}
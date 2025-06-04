//cli cmds  =>npm install mongodb //this installs mongodb.js driver
//netstart mongodb

const insertBooks=require('./insert_books');


const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';


const db = client.db(dbName);
const collection = db.collection(collectionName);

async function connect() {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    await insertBooks();
    return client;
}

//TASK2
//genre search
async function genre_search(name) {
    const con=await connect();
    db.books.find({genre:"name"});  
}
//search by year
async function year_search(year) {
    const con=await connect();
    db.books.find({published_year:{$gte:year}})
}

//author search
async function author_search(name) {
    const con=await connect();
    db.books.find({author:name})   
}

//price update
async function alterprice(title,new_price){
    const conn=await connect();
    db.books.updateOne(
        {title:title},
        {$set:{price:new_price}}
    )
}

//delete book
async function erase(name) {
    const con =await connect();
    db.books.deleteOne({title:name})  
}

//TASK3
//inquiry
async function inquire(year,bool) {
    const con=await connect();
    db.books.find({published_year:year,in_stock:bool})
}
//projection
async function proj() {
    const con= await connect();
    db.books.find(
        {},
        {title:1,author:1,price:1})
}
//sorting ascending
async function sot_asc() {
    const con= await connect();
    db.books.find({}).sort({price:1})
}

//sorting descending
async function sot_des() {
    const con=await connect();
    db.books.find({}).sort({price:-1})
}
//limit and skip
async function lim() {
    const con=await connect();
    db.books.find().skip().limit()
}
//TASK4
TASK4

//avg price
async function avgPrice(gen) {
    const con = await connect();
    db.books.aggregate([
        {$group: {_id:gen,avgPrice: { $avg: "$price" }}},
        { $sort: { avgPrice: -1 } }  
    ]);
}

//book count
async function book_count() {
    const con=await connect();
    db.books.aggregate([
        {
            $group: {
                id: "$author",
                bookCount: { $sum: 1 }
            }
        }
    ]);
}
//decade
async function deca() {
    db.books.aggregate([
        {
            $project: {
                decade: { $subtract: ["$year", { $mod: ["$year", 10] }] } // Calculate decade
                }
            },
            {
                $group: {
                    _id: "$decade",
                    bookCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
}

//TASK 5

//INDEXING
db.books.createIndex({"title":1});

//compound index
db.books.createIndex({author:1,published_year:-1})

//EXPLAIN
db.books.find({ title: "The Great Gatsby" }).explain("executionStats");




const http = require('http');
const url = require('url');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb+srv://harry119753:tony5317@cluster0.iphnsby.mongodb.net/test';

let chatArray = [];
let state = 0;
http.createServer(function (req, res) {
    let path = url.parse(req.url, true).pathname;
    console.log("Request:" + path);
    if (path == "/") {

        fs.readFile("index.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
            return;
        });
    } else if (path == "/breath") {

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ url: 'breath.html' }));
        res.end();
        return;
    } else if (path == "/vocal-cords") {


        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ url: 'vocal-cords.html' }));
        res.end();
        return;

    } else if (path == "/sing") {


        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ url: 'sing.html' }));
        res.end();
        return;

    } else if (path == "/chat") {


        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ url: 'chat.html' }));
        res.end();
        return;

    } else if (path == "/sing.html") {

        fs.readFile("sing.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
            return;
        });
    } else if (path == "/page-css.css") {

        fs.readFile("page-css.css", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(data);
            res.end();
            return;
        });
    }
    else if (path == "/breath.html") {

        fs.readFile("breath.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
            return;
        });
    }
    else if (path == "/vocal-cords.html") {

        fs.readFile("vocal-cords.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
            return;
        });
    } else if (path == "/chat.html") {

        fs.readFile("chat.html", function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
            return;
        });
    } else if (path == "/chatting") {
        if (state == 0) {
            state = 1;
        }
        let q = url.parse(req.url, true).query;
        res.writeHead(200, { "Content-Type": "application/json" });
        if (q.user) {
            let chatJSON = { user: q.user, say: q.say, time: Date().toLocaleString() };
            chatArray.push(chatJSON);
        }
        console.log(JSON.stringify(chatArray));
        res.end(JSON.stringify(chatArray));
    } else if (path == "/chat/save") {
        if (state == 0) {
            return;
        } else {
            console.log("save.db out function...");
            MongoClient.connect(dburl, function (err, db) {
                console.log("save.db in function...");
                if (err) throw err;
                const dbo = db.db("mydb");
                console.log("save.db connecting...");
                dbo.collection("chat").insertMany(chatArray, false, function (err, res) {
                    console.log(JSON.stringify(chatArray));
                    if (err) throw err;
                    db.close();
                });
            });
            state = 0;
            chatArray.length = 0;
            res.end();
        }

    } else if (path == "/chat/reload") {

        console.log("reload.db out function...");
        MongoClient.connect(dburl, function (err, db) {
            console.log("reload.db in function...");
            if (err) throw err;
            const dbo = db.db("mydb");
            console.log("reload.db connecting...");
            dbo.collection("chatRecords").find().toArray(function (err, result) {
                if (err) throw err;
                let tmp = [];
                for (let record in result) {
                    let obj = { user: result[record].user, say: result[record].say, time: result[record].time };
                    tmp.push(obj);
                }
                console.log(result);
                chatArray = tmp;
                db.close();
            });
        });
        res.writeHead(200, { "Content-Type": "application/json" });;
        res.end(JSON.stringify(chatArray));
        chatArray.length = 0;
        state=0;
    }
    else {
        res.end();
    }
}).listen(8080);
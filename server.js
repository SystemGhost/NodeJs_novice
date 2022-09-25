var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);
var ObjectID = require("mongodb").ObjectID;
let db;

var artists = [
    {
        id: 1,
        name: "Metallica",
    },
    {
        id: 2,
        name: "Iron Maiden",
    },
    {
        id: 3,
        name: "Deep Purple",
    },
];

// app.get("/artists", function (req, res) {
//     res.send(artists);
// });

// app.get("/artists/:id", function (req, res) {
//     const artist = artists.find((a) => a.id === Number(req.params.id));
//     console.log(artist);
//     res.send(artist);
// });

app.get("/", function (req, res) {
    res.send("Hello API");
});

// app.listen(3012, function () {
//     console.log("API app started");
// });

// app.post("/artists", function (req, res) {
//     var artist = {
//         id: Date.now(),
//         name: req.body.name,
//     };
//     artists.push(artist);
//     res.send(artist);
// });

app.put("/artists/:id", function (req, res) {
    const artist = artists.find((a) => a.id === Number(req.params.id));
    artist.name = req.body.name;
    res.sendStatus(200);
});

app.delete("/artists/:id", function (req, res) {
    artists = artists.filter((a) => a.id !== Number(req.params.id));
    res.sendStatus(200);
});

async function run() {
    try {
        // Подключаемся к серверу
        await mongoClient.connect();
        // обращаемся к базе данных my_api
        const database = mongoClient.db("my_api");
        db = database; // add database
        // выполняем пинг для проверки подключения
        const result = await db.command({ ping: 1 });
        console.log("Подключение с сервером успешно установлено");
        console.log(result);
        app.listen(3012, function () {
            console.log("API app started");
        });
    } catch (err) {
        console.log(err);
        console.log("Возникла ошибка", err);

        if (err) {
            await mongoClient.close();
            console.log("Подключение закрыто");
        }
    }
    // } finally {
    //     // Закрываем подключение при завершении работы или при ошибке

    // }
}
run();

app.post("/artists", function (req, res) {
    var artist = {
        name: req.body.name,
    };

    db.collection("artists").insertOne(artist, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(artist);
    });
});

app.get("/artists", function (req, res) {
    db.collection("artists")
        .find()
        .toArray(function (err, docs) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs);
        });
});

app.get("/artists/:id", function (req, res) {
    db.collection("artists").findOne(
        { _id: ObjectID(req.params.id) },
        function (err, doc) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(doc);
        }
    );
});

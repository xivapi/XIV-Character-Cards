const fetch = require("node-fetch");
const express = require('express');
const app = express();
const port = 80;

const { CardCreator } = require('./create-card');

const creator = new CardCreator();
creator.init();

app.get('/characters/id/:charaId', async (req, res) => {
    try {
        const png = await creator.createCard(req.params.charaId);

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': png.length
        });
        res.end(png, 'binary');
    }catch(error){
        res.send(error);
    }
})

app.get('/characters/name/:world/:charName', async (req, res) => {
    var response = await fetch(`https://xivapi.com/character/search?name=${req.params.charName}&server=${req.params.world}`);
    var data = await response.json();
    
    if (data.Results[0] === undefined)
    {
        res.status(404).send("Character not found.");
        return;
    }

    try {
        const png = await creator.createCard(data.Results[0].ID);

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': png.length
        });
        res.end(png, 'binary');
    }catch(error){
        res.send(error);
    }
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
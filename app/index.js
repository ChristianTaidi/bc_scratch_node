const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2pServer = require('./p2p-server');

const app = express();

const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (request, response) =>{
    response.json(bc.chain);
});

app.post('/mine', (request,response) =>{
    const block = bc.addBlock(request.body.data);
    console.log(`New block added ${block.toString()}`);;
    
    p2pServer.syncChains();

    response.redirect('/blocks');
})

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`));
p2pServer.listen();
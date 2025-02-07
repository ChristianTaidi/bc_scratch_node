const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const app = express();

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pServer);


app.use(bodyParser.json());


app.get('/blocks', (request, response) =>{
    response.json(bc.chain);
});

app.get('/mine-transactions',(req,res)=>{
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks');
})

app.post('/mine', (request,response) =>{
    const block = bc.addBlock(request.body.data);
    console.log(`New block added ${block.toString()}`);;
    
    p2pServer.syncChains();

    response.redirect('/blocks');
})

app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
});

app.post('/transact',(req,res)=>{
    const {recipient,amount} = req.body;
    //ToDo add bc to method call as 3rd parameter
    const transaction = wallet.createTransaction(recipient,amount,bc,tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/public-key',(req,res)=>{
    res.json({publicKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`));
p2pServer.listen();
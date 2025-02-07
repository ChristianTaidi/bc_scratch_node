const {INITIAL_BALANCE} = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
class Wallet{
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    toString(){
        return `Wallet-
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}`
    }

    //ToDo add blockchain to method signature
    createTransaction(recipient,amount,blockchain,transactionPool){

        //this.balance = this.calculateBalance(blockchain);
        if(amount>this.balance){
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.update(this,recipient,amount);
        }else{
            transaction = Transaction.newTransaction(this,recipient,amount);
            transactionPool.updateOrAddTransaction(transaction);
        }
        return transaction;

    }

    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];

        //Gets all transactions in the blockchain

        blockchain.chain.forEach(block => block.data.forEach(transaction=>{
            transactions.push(transaction);
        }));

        //Gets the transactions related to this wallet
        const walletInputTs = transactions.filter(
            transaction => transaction.input.address === this.publicKey);
                   
        let startTime = 0;

        console.log(walletInputTs.transactions+" "+balance);

        //Returns the most recent transaction

        if(walletInputTs.length > 0){
            const recentInputT = walletInputTs.reduce(
                (prev,current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );  
            balance = recentInputT.outputs.find(output=>output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        transactions.forEach(transaction=>{
            if(transaction.input.timestamp > startTime){
                transaction.outputs.find(output => {
                    if(output.address === this.publicKey){
                        balance += output.amount;
                    }
                });
            }
        });

        console.log(walletInputTs+" "+balance);

        return balance;

    }
}

module.exports = Wallet;
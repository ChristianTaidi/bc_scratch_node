const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const {INITIAL_BALANCE} = require('../config');

describe('Wallet test',()=>{
    let wallet,tp,bc;
    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    })

    describe('creating a tansaction',()=>{
        let transaction, sendAmount, recipient;
        beforeEach(()=>{
            sendAmount = 50;
            recipient = 'r3nd0m-4ddr355';
            //ToDo add bc variable to method call
            transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
        });

        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                            //ToDo add bc variable to method call

                wallet.createTransaction(recipient,sendAmount,bc,tp);
            });

            it('doubles the `sendAmount` subtracted from the wallet balance',()=>{
                expect(transaction.outputs.find(output=>output.address ===wallet.publicKey).amount)
                .toEqual(wallet.balance-sendAmount*2);
            })

            it('clones the `sendAmount` output for the recipient',()=>{
                expect(transaction.outputs.filter(output=> output.address===recipient).map(output=>output.amount)).toEqual([sendAmount,sendAmount]);
            })
        });
    });

    describe('calculating a balance', ()=>{
        let addBalance, repeatAdd, senderWallet;
        beforeEach(()=>{
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for(let i=0;i<repeatAdd;i++){
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }

            bc.addBlock(tp.transactions);
 
        });
        it('calculates the balance for the recipient',()=>{
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE+(addBalance*repeatAdd));

        });

        it('calculates the balance for the sender',()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE-(addBalance*repeatAdd));
        });

        describe('and the recipient conducts a transaction',()=>{
            let subtrtactBalance, recipientBalance;

            beforeEach(()=>{
                tp.clear();
                subtrtactBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey,subtrtactBalance,bc,tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another transaction to the recipient',()=>{
                beforeEach(()=>{
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculates the recipient balance only using transactions since it´s most recent one',()=>{
                    expect(wallet.calculateBalance(bc)).toEqual((recipientBalance-subtrtactBalance)+addBalance);
                });
            });
        });
    });
});
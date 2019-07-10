# bc_scratch_node

This project is meant to be a learning experience on how to build a blockchain using nodejs 

I´m building this by following a course, [Link to the course](https://www.udemy.com/build-blockchain/learn/lecture/9314324?start=15#overview)

## Tools 🛠️
[VisualStudio Code](https://code.visualstudio.com/)

## Steps :memo:

1. Build the model objects :heavy_check_mark:
  
   - [x] Built the block class 
   - [x] Built the blockchain class 
2. Build the behaviour of the chain :heavy_check_mark:
  
   - [x] Built the API (GET/POST) 
   - [x] Built the mining function (POST request) 
   - [x] Built the blockchain validation 
   - [x] Built the blockchain replacement 
3. Build the p2p connectivity :heavy_check_mark:
  
   - [x] Built the P2P socket listener 
   - [x] Built the blockchain sync betweeen peers 
  
4. Build the proof of work for the mining feature :heavy_check_mark:

   - [x] Built the proof of work and nonce to avoid colisions and set the difficulty for mining a block
   - [x] Built the dynamic block difficulty feature depending on the time taken to mine a block

5. Build the wallet and transaction classes :heavy_check_mark:

   - [x] Built the wallet class
   - [x] Built the transaction class
   - [x] Built the transaction updating feature
   - [x] Built the verification to check if transactions are valid
   
6. Transaction Pool and mining transactions :heavy_check_mark:

   - [x] Built the transaction pool
   - [x] Built the relation between transactions and wallets
   - [x] Built the post and get endpoints for transaction management
   - [x] Built the feature that allows sharing the pool between peers
   
7. Transaction Mining and currency balance

   - [x] Built the miner class
   - [x] Implement the mining only for valid transactions
   - [x] Built the mining reward for the miners
   - [x] Built the endpoint for mining transactions
   - [x] Built the feature that updates all the peers when a transaction is mined
   - [x] Built the balance calculation for each wallet
   - [x] Built the balance calculation whenever a transaction is made
   
## Need to fix an issue that makes the wallet balance calculation wrong, it resets the wallet currency whenever a transaction is mined and the balance updated, it might be an issue that involves the transaction selection when checking the most recent ones.

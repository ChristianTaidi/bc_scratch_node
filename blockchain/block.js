const {DIFFICULTY, MINE_RATE} = require('../config');
const ChainUtil = require('../chain-util');
class Block{

    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.nonce = nonce;
        this.data = data;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block -
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0,10)}
            Hash      : ${this.hash.substring(0,10)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}
            `;
    }

    static genesis(){
        return new this('Genesis time','-------','f1rs7-h45h',[],0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data){
        let nonce = 0;
        let timestamp;
        let hash;
        let {difficulty} = lastBlock;
        const lastHash = lastBlock.hash;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hashFun(timestamp,lastHash,data,nonce, difficulty);
    
        }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp,lastHash,hash,data,nonce,difficulty);
    }
    
    static hashFun(timestamp, lastHash, data, nonce, difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const{timestamp, lastHash, data,nonce,difficulty} = block;
        return Block.hashFun(timestamp,lastHash,data, nonce,difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty -1;
        return difficulty;
    }
}

module.exports = Block; 
// Block chain
// data
// previous hash
// this hash
const sha256 = require('crypto-js/sha256');
class Block {
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
    this.timestamp = new Date().getTime();
    this.hash = this.calculateHash();
    this.nonce = 1;
  }
  calculateHash() {
    return sha256(
      this.data + this.previousHash + this.timestamp + this.nonce
    ).toString();
  }
}

// const block = new Block('Hello', '0');
// console.log(block);

// chain
class Chain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1;
  }
  createGenesisBlock() {
    return new Block('Genesis Block', '0');
  }

  getAnswer(difficulty) {
    // hast that start with 0;
    let answer = '';
    for (let i = 0; i < difficulty; i++) {
      answer += '0';
    }
    return answer;
  }
  // mine block
  mineBlock(difficulty) {
    while (true) {
      this.hash = this.calculateHash();
      this.nonce++; 
      if (this.hash.substring(0, difficulty) === this.getAnswer(difficulty)) {
        this.hash = this.calculateHash();
      } else {
        break;
      }
    }
    console.log('Block mined', this.hash);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  // add block to chain
  addBlock(newBlock) {
    // data
    // find hash of last block, set as previous hash
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  isChainValid() {
    if (this.chain.length === 1) {
      if (this.chain[0].hash !== this.chain[0].calculateHash()) {
        return false;
      }
      return true;
    }
    for (let i = 1; i < this.chain.length; i++) {
      // check from 2nd block onwards
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('Data has changed');
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('Previous hash is not correct');
        return false;
      }
    }
    return true;
  }
}

const chain = new Chain();
console.log(chain.isChainValid());

// console.log(chain);

const block1 = new Block('Block 1', '0');
chain.addBlock(block1);
const block2 = new Block('Block 2', '');
chain.addBlock(block2);
console.log(chain);

console.log(chain.isChainValid());

//try to change the previous hash
chain.chain[1].data = 'Block 2a';
// chain.chain[2].previousHash = '0';
chain.chain[1].hash = chain.chain[1].calculateHash();
// console.log(chain.chain[2]);
console.log(chain);
console.log(chain.isChainValid());

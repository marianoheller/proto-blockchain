const chalk = require("chalk");
const R = require("ramda");
const pki = require("./pki");
const Block = require("./block");
const Transaction = require("./transaction");

const KEY_PAIR = pki.generateKeyPair();

function Blockchain(genesisTransaction) {
  return {
    blocks: [Block(null, genesisTransaction)],
    addToBlockchain(transaction) {
      const newBlock = Block(R.last(this.blocks), transaction);
      newBlock.render();
      this.blocks.push(newBlock);
    },
    isValid() {
      const tuples = R.aperture(2, this.blocks);
      return (
        this.blocks.every(b => b.isValid()) &&
        tuples.every(([a, b]) => a.blockHash === b.prevBlockHash)
      );
    }
  };
}

const bc = Blockchain(
  Transaction(null, KEY_PAIR.publicKey, 9999, KEY_PAIR.privateKey)
);

console.log("The blockchain is valid: " + chalk.green(bc.isValid()));

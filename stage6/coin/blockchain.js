const chalk = require("chalk");
const R = require("ramda");
const pki = require("./pki");
const Block = require("./block");
const { Transaction, isTransaction } = require("./transaction");

const isBlockchainValid = bc => {
  const { blocks } = bc;
  const tuples = R.aperture(2, blocks);
  return (
    blocks.every(b => b.isValid()) &&
    tuples.every(([a, b]) => a.blockHash === b.prevBlockHash)
  );
};

function Blockchain(genesisTransaction) {
  if (!isTransaction(genesisTransaction))
    throw new Error("Not a valid transaction");
  return {
    blocks: [Block(null, genesisTransaction)],
    addToBlockchain(transaction) {
      if (!isTransaction(transaction))
        throw new Error("Not a valid transaction");
      const newBlock = Block(R.last(this.blocks), transaction);
      newBlock.render();
      this.blocks.push(newBlock);
    },
    isValid() {
      return isBlockchainValid(this);
    }
  };
}

module.exports = {
  Blockchain,
  isBlockchainValid
};

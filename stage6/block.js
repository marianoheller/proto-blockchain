const chalk = require("chalk");
const pow = require("./pow");

const mineBlock = blockContents => {
  const nonce = pow.findNonce(blockContents);
  return {
    nonce,
    blockHash: pow.hash(blockContents + nonce)
  };
};

function Block(prevBlock, transaction) {
  const isGenesisBlock = !prevBlock;
  const prevBlockHash = isGenesisBlock ? null : prevBlock.blockHash;
  const blockContents = prevBlockHash + transaction;
  const { blockHash, nonce } = mineBlock(blockContents);

  return {
    transaction,
    nonce,
    blockHash,
    prevBlockHash,
    render() {
      console.log(chalk.yellow("---Block---"));
      console.log("Transaction: " + chalk.green(transaction.render()));
      console.log("Nonce: " + chalk.green(nonce));
      console.log("Block hash: " + chalk.green(blockHash));
      console.log("Prev block hash: " + chalk.green(prevBlockHash));
      console.log(chalk.yellow("---End Block---"));
      console.log();
    },
    isValid() {
      return pow.isValidNonce(nonce, blockContents);
    }
  };
}

module.exports = Block;

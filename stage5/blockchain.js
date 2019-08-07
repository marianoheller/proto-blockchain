const chalk = require("chalk");
const R = require("ramda");
const pow = require("./pow");

const mineBlock = blockContents => {
  const nonce = pow.findNonce(blockContents);
  return {
    nonce,
    blockHash: pow.hash(blockContents + nonce)
  };
};

function Block(prevBlock, msg) {
  const isGenesisBlock = !prevBlock;
  const prevBlockHash = isGenesisBlock ? null : prevBlock.blockHash;
  const blockContents = prevBlockHash + msg;
  const { blockHash, nonce } = mineBlock(blockContents);

  return {
    msg,
    nonce,
    blockHash,
    prevBlockHash,
    render() {
      console.log(chalk.yellow("---Block---"));
      console.log("Message: " + chalk.green(msg));
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

function Blockchain(genesisMsg) {
  return {
    blocks: [Block(null, genesisMsg)],
    addToBlockchain(msg) {
      const newBlock = Block(R.last(this.blocks), msg);
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

const bc = Blockchain("---Genesis Block---");
bc.addToBlockchain("Peli A");
bc.addToBlockchain("Peli B");
bc.addToBlockchain("Peli C");

console.log("The blockchain is valid: " + chalk.green(bc.isValid()));

const argv = require("minimist")(process.argv.slice(2));
const forge = require("node-forge");
const chalk = require("chalk");
const succ = require("./succ");

const NUM_ZEROES = 5;

const hash = msg => {
  const md = forge.md.sha256.create();
  md.update(msg);
  return md.digest().toHex();
};

const findNonce = msg => {
  let nonce = "AASDASDAS, NONCE FACTORY!!!";
  let count = 0;
  let isValid = isValidNonce(nonce, msg);
  while (!isValid) {
    nonce = succ(nonce);
    count++;
    isValid = isValidNonce(nonce, msg);
  }
  console.log(`Count: ${chalk.green(count)}`);
  console.log(`Nonce: ${chalk.yellow(nonce)}`);
  console.log(`Hash: ${chalk.blue(hash(msg + nonce))}`);
};

const isValidNonce = (nonce, msg) => {
  return hash(msg + nonce).startsWith(
    Array(NUM_ZEROES)
      .fill(0)
      .join("")
  );
};

const message = argv["message"];
if (!message) throw new Error("No message");
findNonce(message);

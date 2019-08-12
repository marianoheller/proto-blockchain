const argv = require("minimist")(process.argv.slice(2));
const R = require("ramda");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const { Blockchain, isBlockchainValid } = require("./coin/blockchain");
const { Transaction } = require("./coin/transaction");
const pki = require("./coin/pki");

const KEY_PAIR = pki.generateKeyPair();

const app = express();

const PORT = argv["p"];
const PEERPORT = argv["pp"];
if (!PORT) throw new Error(`Invalid params. Got p: ${PORT}, pp: ${PEERPORT}`);

app.use(bodyParser.json());
app.use(morgan("combined"));

let BLOCKCHAIN = null;
let PEERS = [];
if (!PEERPORT) {
  // Progenitor
  BLOCKCHAIN = Blockchain(
    Transaction(null, KEY_PAIR.publicKey, 9999, KEY_PAIR.privateKey)
  );
} else {
  PEERS = [PEERPORT];
}

const updateBlockchain = theirBlockchain => {
  if (!theirBlockchain) return;
  if (!BLOCKCHAIN || theirBlockchain.length <= BLOCKCHAIN.length) return;
  if (!isBlockchainValid(theirBlockchain)) return;
  BLOCKCHAIN = theirBlockchain;
};

const updatePeers = theirPeers => {
  PEERS = R.union(PEERS, theirPeers);
};

app.post("/gossip", (req, res) => {
  const theirBlockchain = req.body.blockchain;
  const theirPeers = req.body.peers;
  updateBlockchain(theirBlockchain);
  updatePeers(theirPeers);
  return req.send({
    blockchain: BLOCKCHAIN,
    peers: PEERS
  });
});

app.post("/sendMoney", async (req, res) => {
  const to = await client.getPubKey(req.body.to);
  const amount = Number(req.body.amount);
  BLOCKCHAIN.addToBlockchain(
    Transaction(KEY_PAIR.publicKey, to, amount, KEY_PAIR.privateKey)
  );
  return res.send("OK! Block mined.");
});

app.get("/key", (req, res) => {
  return res.send(KEY_PAIR.publicKey);
});

app.listen(PORT, () => {
  console.log(`Blockchain app listening on port ${PORT}!`);
});

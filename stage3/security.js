const forge = require("node-forge");
const { rsa } = forge.pki;

const generateKeyPair = () => {
  return rsa.generateKeyPair({ bits: 512, e: 0x10001 });
};

const sign = (msg, privateKey) => {
  const md = forge.md.sha1.create();
  md.update(msg, "utf8");
  return privateKey.sign(md);
};

const validSignature = (signature, cipherText, publicKey) => {
  const md = forge.md.sha1.create();
  md.update(cipherText);
  return publicKey.verify(md.digest().bytes(), signature);
};

const pair = generateKeyPair();
console.log("GOT PAIR", pair);
const text = "asdasd";
const signature = (text, pair.privateKey);
console.log("SIGNED", signature);
const isValid = validSignature(signature, text, pair.publicKey);
console.log("IS VALID", isValid);

module.exports = {
  generateKeyPair,
  sign,
  validSignature
};

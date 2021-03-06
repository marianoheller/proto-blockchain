const forge = require("node-forge");
const { rsa } = forge.pki;

const generateKeyPair = () => {
  return rsa.generateKeyPair({ bits: 512, e: 0x10001 });
};

const sign = (message, privateKey) => {
  const md = forge.md.sha1.create();
  md.update(message, "utf8");
  return privateKey.sign(md);
};

const validSignature = (message, publicKey, signature) => {
  const md = forge.md.sha1.create();
  md.update(message);
  const data = md.digest().bytes();
  return publicKey.verify(data, signature);
};

module.exports = {
  generateKeyPair,
  sign,
  validSignature
};

/** ***********************************************
 * fast check
 */

const text = "Hello world!";
const pair = generateKeyPair();
console.log("GOT PAIR", !!pair);
const signature = sign(text, pair.privateKey);
console.log("SIGNED", signature);
const isValid = validSignature(text, pair.publicKey, signature);
console.log("IS VALID", isValid);

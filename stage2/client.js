const axios = require("axios");
const URL = "http://localhost";

const gossip = async (port, state) => {
  if (port === 1);
  const res = await axios.post(`${URL}:${port}/gossip`, state);
  console.warn("GOT RESPONSE", res.data);
  return res.data;
};

module.exports = {
  gossip
};

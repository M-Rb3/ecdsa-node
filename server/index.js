const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const { Signature, recoverPublicKey } = require("@noble/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const balances = {
  "030ccca7e0a01ffc764b4faae67c21bc29af9fe99195a5a9b514c7399a931cfd08": 100,
  "02e7550d5af70f48faec3a6b591b7cfe9b6d87ddc8f4112afad30e9bd8f37e1ca1": 50,
  "02d266d5defc4c94da90eab63f4f1b6276066db5f87f87cf172ea0a1fce76a9e91": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  console.log(balance);
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signatureHex, recipient, amount, msgHash, recovery } = req.body;

  // get public key from signature
  const sender = toHex(recoverPublicKey(msgHash, signatureHex, recovery, true));
  console.log(sender);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

// // get signature from signature hex value
// const signature = Signature.fromCompact(signatureHex);

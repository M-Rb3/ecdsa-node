import server from "./server";

import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";
import { bytesToHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ privateKey, sendAmount, recipient, handleSetState }) {
  async function transfer(evt) {
    evt.preventDefault();
    const msgHash = bytesToHex(
      sha256(utf8ToBytes(`withdraw ${parseInt(sendAmount)}`))
    );
    // sign a transaction using sender private key
    const signature = secp.sign(msgHash, privateKey);
    console.log(signature);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signatureHex: signature.toCompactHex(), // send the Hex value of the signature
        amount: parseInt(sendAmount),
        recipient,
        msgHash,
        recovery: signature.recovery,
      });
      handleSetState({ balance });
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={(e) => handleSetState({ sendAmount: e.target.value })}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={(e) => handleSetState({ recipient: e.target.value })}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

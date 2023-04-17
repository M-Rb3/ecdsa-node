import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ privateKey, handleSetState, balance, address }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    handleSetState({
      privateKey,
    });
    if (privateKey) {
      const publicKey = toHex(secp256k1.getPublicKey(privateKey));
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      handleSetState({
        balance,
        address: publicKey,
      });
    } else {
      handleSetState({
        balance: 0,
      });
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        type Private Key to sign the transaction
        <input
          placeholder="private key"
          value={privateKey}
          onChange={onChange}
        ></input>
        <div>address</div>
        <div>{address}</div>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

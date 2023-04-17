import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [state, setState] = useState({
    balance: 0,
    privateKey: "",
    address: "",
    sendAmount: "",
    recipient: "",
  });

  const { balance, privateKey, address, sendAmount, recipient } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privateKey={privateKey}
        address={address}
        handleSetState={handleSetState}
      />
      <Transfer
        handleSetState={handleSetState}
        privateKey={privateKey}
        sendAmount={sendAmount}
        recipient={recipient}
      />
    </div>
  );
}

export default App;

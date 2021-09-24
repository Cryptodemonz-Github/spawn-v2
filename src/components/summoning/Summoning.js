import { useEffect, useState } from "react";
import Web3 from "web3";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";

const Summoning = (props) => {
  const [web3, setWeb3] = useState(undefined);
  //dummy
  let amount = 1;

  //will take amount
  const Summon = async () => {
    await props.contract.methods.mintToken(amount).send({
      from: props.accounts[0],
      value: amount * web3.utils.toWei(web3.utils.toBN(60), "milli"),
      gasLimit: amount * "300000",
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  };

  useEffect(() => {
    setWeb3(new Web3(window.ethereum));
  }, []);

  useEffect(() => {
    if (props.accounts !== undefined && props.accounts.length > 0) {
      props.setConnected(true);
    } else {
      props.setConnected(false);
    }
  }, [props.accounts]);

  return (
    <div>
      {!props.connected ? (
        <button onClick={props.ConnectMetaMask}>Connect</button>
      ) : (
        <button onClick={Summon}>Summon</button>
      )}
    </div>
  );
};

export default Summoning;

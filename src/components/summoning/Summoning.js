import { useEffect, useState } from "react";
import Web3 from "web3";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";

const Summoning = () => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
    Demonzv2_testing,
    "0x840244370Cabc0b2F09751D071799Ca81cD1BCeC"
  );
  const [connected, setConnected] = useState(undefined);
  const [accounts, setAccounts] = useState([]);

  //dummy
  let account = "0x21751deC771cE1F6AA6017d8Ca7332f122652FfD";
  let amount = 1;

  useEffect(() => {
    if (window.ethereum && window.ethereum.isConnected) {
      setAccounts(RequestAccounts());
    }
  }, []);

  useEffect(() => {
    if (accounts !== undefined && accounts.length > 0) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [accounts]);

  //will take amount
  const Summon = async () => {
    contract.methods.mintToken(amount).send({
      from: account,
      gasLimit: amount * "300000",
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  };

  const ConnectMetaMask = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "1" }],
        });
      } catch (error) {
        console.error(error);
      }
      setAccounts(accounts);
    } else {
      alert(
        "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
      );
      return 0;
    }
  };

  const RequestAccounts = async () => {
    const accs = await window.ethereum
      .request({
        method: "eth_accounts",
      })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
    return accs;
  };

  return (
    <div>
      {!connected ? (
        <button onClick={ConnectMetaMask}>Connect</button>
      ) : (
        <button onClick={Summon}>Summon</button>
      )}
    </div>
  );
};

export default Summoning;

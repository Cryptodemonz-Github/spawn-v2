import Web3 from "web3";
import Demonzv1_testing from "../../config/Demonzv1_testnet.json";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";
import { useState, useEffect } from "react";

const Sacrificing = (props) => {
  const [web3, setWeb3] = useState(undefined);
  const [contractV1, setContractV1] = useState(undefined);
  const [tokenIDs, setTokenIDs] = useState([]);
  const [images, setImages] = useState([]); // URLs from OpenSea

  // dummy
  let account = "0x21751deC771cE1F6AA6017d8Ca7332f122652FfD";
  let idArray = [1, 2, 3];
  let amount = 1;

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contractV1 = new web3.eth.Contract(
      Demonzv1_testing,
      "0xae16529ed90fafc927d774ea7be1b95d826664e3"
    );
    setWeb3(web3);
    setContractV1(contractV1);
  }, []);

  useEffect(() => {
    if (props.accounts !== undefined && props.accounts.length > 0) {
      props.setConnected(true);
    } else {
      props.setConnected(false);
    }
  }, [props.accounts]);

  const getTokenIDs = async () => {
    const tokenCount = await contractV1.methods
      .balanceOf(props.accounts[0])
      .call();
    for (let i = 0; i < tokenCount; i++) {
      let tokenId = await contractV1.methods
        .tokenOfOwnerByIndex(props.accounts[0], i)
        .call();
      setTokenIDs((old) => [...old, tokenId]);
    }

    return tokenIDs;
  };

  const getImage = async (tokenID) => {
    const url =
      "https://api.opensea.io/api/v1/assets?token_ids=" +
      { tokenID } +
      "&asset_contract_address=0xae16529ed90fafc927d774ea7be1b95d826664e3&order_direction=desc&offset=0&limit=20";
    try {
      const response = await fetch(url, { method: "GET" });
      const json = await response.json();
      console.log(json.assets[0].image_url);
      setImages((old) => [...old, json.assets[0].image_url]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const Sacrifice = async () => {
    await props.contract.methods.burnV1(idArray).call({
      from: account,
      gasLimit: amount * "300000",
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  };

  return (
    <div>
      {!props.connected ? (
        <button onClick={props.ConnectMetaMask}>Connect</button>
      ) : (
        <button onClick={Sacrifice}>Sacrifice</button>
      )}
    </div>
  );
};

export default Sacrificing;

import Web3 from "web3";
import Demonzv1_testing from "../../config/Demonzv1_testnet.json";
import DemonzV1ABI from "../../config/DemonzV1ABI.json";
import mockDemonzv1_testing from "../../config/mockDemonzv1_testnet.json";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";
import { useState, useEffect } from "react";

const Sacrificing = (props) => {
  const [contractV1, setContractV1] = useState(undefined);
  const [images, setImages] = useState([]); // tokenIDs and URLs from OpenSea
  const [sacrifice, setSacrifice] = useState([]);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contractV1 = new web3.eth.Contract(
      DemonzV1ABI,
      "0xae16529ed90fafc927d774ea7be1b95d826664e3"
    );
    setContractV1(contractV1);
  }, []);

  useEffect(() => {
    if (props.accounts !== undefined && props.accounts.length > 0) {
      props.setConnected(true);
    } else {
      props.setConnected(false);
    }
  }, [props.accounts]);

  useEffect(() => {
    if (contractV1 !== undefined && props.accounts[0] !== undefined) {
      getTokens();
    }
  }, [contractV1]);

  const getTokens = async () => {
    const tokenCount = await contractV1.methods
      .balanceOf(props.accounts[0])
      .call();
    for (let i = 0; i < tokenCount; i++) {
      let tokenId = await contractV1.methods
        .tokenOfOwnerByIndex(props.accounts[0], i)
        .call();
      getImage(tokenId);
    }
  };

  const getImage = async (tokenID) => {
    const url =
      "https://api.opensea.io/api/v1/assets?token_ids=" +
      tokenID +
      "&asset_contract_address=0xae16529ed90fafc927d774ea7be1b95d826664e3";
    try {
      const response = await fetch(url, { method: "GET" });
      const json = await response.json();
      console.log(json.assets[0].image_url);
      setImages((old) => [
        ...old,
        { id: tokenID, image: json.assets[0].image_url },
      ]);
    } catch (error) {
      console.log("error", error);
    }
  };

  const Sacrifice = async () => {
    let sacrificeIDs = [];
    for (let i = 0; i < sacrifice.length; i++) {
      sacrificeIDs.push(Number(sacrifice[i].id));
    }

    await contractV1.methods
      .setApprovalForAll("0xae16529ed90fafc927d774ea7be1b95d826664e3", true)
      .send({
        from: props.accounts[0],
      });
    await props.contract.methods.burnV1(sacrificeIDs).send({
      from: props.accounts[0],
    });
    setSacrifice([]);
  };

  const metaMaskUI = () => {
    if (!props.connected) {
      return (
        <button className="metamask-connect" onClick={props.ConnectMetaMask}>
          Connect to metamask
        </button>
      );
    } else {
      return (
        <p>
          <span className="meta-title">Connected: </span>
          <span>
            {props.accounts[0].slice(0, 6)}
            ...
            {props.accounts[0].slice(
              props.accounts[0].length - 4,
              props.accounts[0].length
            )}
          </span>
        </p>
      );
    }
  };

  const sacrificeBtn = () => {
    return <p>test</p>;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="metamask">{metaMaskUI()}</div>
      </div>

      <div className="top-spacer"></div>

      <div className="row ">
        <div className="col-xl-4">
          <div className="card border-dark bg-dark mb-3 sacrificing-card left text-center">
            Select which demonz you would like to sacrifice!
            <div className="image-container">
              {images.map((d) => (
                <img
                  src={d.image}
                  onClick={() => {
                    setImages(images.filter(({ id }) => id !== d.id));
                    setSacrifice((old) => [
                      ...old,
                      {
                        id: d.id,
                        image: d.image,
                      },
                    ]);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card border-dark bg-dark mb-3 sacrificing-card center text-center">
            Confirm that these are the demonz you would like to sacrifice!
            <div className="image-container">
              {sacrifice.map((d) => (
                <img
                  src={d.image}
                  onClick={() => {
                    setSacrifice(sacrifice.filter(({ id }) => id !== d.id));
                    setImages((old) => [
                      ...old,
                      {
                        id: d.id,
                        image: d.image,
                      },
                    ]);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card border-dark bg-dark mb-3 sacrificing-card right text-center">
            <button onClick={Sacrifice}>Sacrifice</button>
            {props.connected ? (
              <button onClick={props.DisconnectMetaMask}>Disconnect</button>
            ) : (
              <button onClick={props.ConnectMetaMask}>Connect</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sacrificing;

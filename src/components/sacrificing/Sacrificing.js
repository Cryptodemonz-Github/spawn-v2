import Web3 from "web3";
import Demonzv1_testing from "../../config/Demonzv1_testnet.json";
import Demonzv1_production from "../../config/Demonzv2_production.json";
import mockDemonzv1_testing from "../../config/mockDemonzv1_testnet.json";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";
import DemonzV2_production from "../../config/Demonzv2_production.json";
import { useState, useEffect } from "react";

const Sacrificing = (props) => {
  const [contractV1, setContractV1] = useState(undefined);
  const [images, setImages] = useState([]); // tokenIDs and URLs from OpenSea
  const [sacrifice, setSacrifice] = useState([]);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    const contractV1 = new web3.eth.Contract(
      Demonzv1_production,
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
    if (sacrificeCheck()[1]) {
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
  }
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
        <button className="metamask-connect" onClick={props.DisconnectMetaMask}>
          Connected: {props.accounts[0].slice(0, 6)}
            ...
            {props.accounts[0].slice(
              props.accounts[0].length - 4,
              props.accounts[0].length
            )}
        </button>
      );
    }
  };

  const sacrificeCheck = () => {
    if (sacrifice.length < 3) {
      return ['There is not enough demonz to sacrifice.', false];
    } else if (sacrifice.length > 9) {
      return ['You are trying to sacrifice too many Demonz.', false];
    } else if (sacrifice.length % 3 !== 0) {
      return ['You have an odd number of Demonz, the correct values are 3, 6, and 9.', false];
    } else {
      return ['', true];
    }
  }

  const sacrificeBtn = () => {
    let msg = (
        <div>
          <p className="text-danger">{ sacrificeCheck()[0] }</p>
        </div>
    );

    if (sacrificeCheck()[1]) {
      return (
        <div>
          {msg}
          <button className="custombtn sacrifice" onClick={Sacrifice}></button>
        </div>
      )
    } else {
      return (
        <div>
          {msg}
          <button className="custombtn sacrifice" onClick={Sacrifice} disabled></button>
        </div>
      )
    }
  }

  const pageLoggedOut = () => {
    return (
      <div className="container-xl">
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card border-dark bg-dark mb-3 dialogue-card">
            <div className="card-body">
              <div class="row">
                <div class="col text-center">
                  <img
                    className="character"
                    src="/images/lilith.gif"
                    alt="Lilith"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div className="dialogue-container">
                    <div className="css-typing">
                      <p>Human... why aren't you logged into Metamask?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  const pageLoggedIn = () => {
    return (
    <div className="row">
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
          Confirm that these are the Demonz you would like to sacrifice! <br />
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
          <h4>Rules Of The Sacrifice</h4>
          <ul className="mb-5">
            <li>We require 3 v1 Demonz for 1 v2 Demonz.</li>
            <li>You can sacrifice a maximum of 9 Demonz per transaction.</li>
            <li><small className="text-muted">Your eternal soul.</small></li>
            <li>You can summon a total of 20 v2.</li>
          </ul>
          {sacrificeBtn()}
        </div>
      </div>
    </div>
    )
  }

  const pageHandler = () => {
    if (!props.connected) {
      return pageLoggedOut();
    } else {
      return pageLoggedIn();
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="metamask">{metaMaskUI()}</div>
      </div>

      <div className="top-spacer"></div>

      {pageHandler()}
    </div>
  );
};

export default Sacrificing;

import Web3 from "web3";
import Demonzv1_testing from "../../config/Demonzv1_testnet.json";
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
      Demonzv1_testing,
      "0x0Ca71FDd88e546BDab694185Dd249e8fBc64eFd3"
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
    /*
    await contractV1.methods
      .setApprovalForAll("0x75c85470F23b5dd690B8E23ff000Af280D7E72F9", true)
      .send({
        from: props.accounts[0],
      });*/
    await props.contract.methods.burnV1(sacrificeIDs).send({
      from: props.accounts[0],
    });
    setSacrifice([]);
  };

  return (
    <div>
      {!props.connected ? (
        <button onClick={props.ConnectMetaMask}>Connect</button>
      ) : (
        <>
          <button onClick={Sacrifice}>Sacrifice</button>
          <div className="row ">
            <div className="col-md-6">
              <div className="container full">
                <div className="top-spacer"></div>
                <div className="row justify-content-md-center">
                  <div className="col-md-6">
                    <div className="card border-dark bg-dark mb-3 dialogue-card">
                      {images.map((d) => (
                        <div>
                          <img
                            src={d.image}
                            height="100px"
                            width="100px"
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
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="container full">
                <div className="top-spacer"></div>
                <div className="row justify-content-md-center">
                  <div className="col-md-6">
                    <div className="card border-dark bg-dark mb-3 dialogue-card">
                      {sacrifice.map((d) => (
                        <div>
                          <img src={d.image} height="100px" width="100px" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sacrificing;

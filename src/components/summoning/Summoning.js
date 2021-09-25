import { useEffect, useState } from "react";
import Web3 from "web3";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";

const Summoning = (props) => {
  const [web3, setWeb3] = useState(undefined);
  const [numToMint, setNumToMint] = useState(1);

  const checkAmountFailsafe = () => {
    if (numToMint > 3 || numToMint <= 0) {
      return 1;
    } else {
      return numToMint;
    }
  };

  const Summon = async () => {
    await props.contract.methods.mintToken(checkAmountFailsafe()).send({
      from: props.accounts[0],
      gasLimit: checkAmountFailsafe() * "300000",
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

  return (
    <div className="container-xl">
      <div className="row">
        <div className="metamask">{metaMaskUI()}</div>
      </div>

      <div className="top-spacer"></div>

      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div className="card border-dark bg-dark mb-3 summon-card">
            <div className="card-body">
              <div className="row">
                <div className="col text-center">
                  <fieldset className="form-group">
                    <label for="customRange3" className="form-label">
                      How many Demonz v2 would you like? <br />
                      Slide the skull and tell us!
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="1"
                      value={numToMint}
                      onChange={(event) => {
                        setNumToMint(event.target.value);
                      }}
                    />
                    <p className="blood">{numToMint}</p>
                  </fieldset>
                </div>
              </div>
              <div className="row">
                <div className="col text-center mt-2">
                  <button
                    className="custombtn summon"
                    onClick={Summon}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summoning;

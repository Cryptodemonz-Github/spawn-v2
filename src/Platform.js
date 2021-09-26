import React from "react";
import Web3 from "web3";
import Summoning from "./components/summoning/Summoning";
import Sacrificing from "./components/sacrificing/Sacrificing";
import Demonzv2_testing from "./config/Demonzv2_testnet.json";
import Demonzv2_production from "./config/Demonzv2_production.json";

class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      welcomeMsg: true,
      decision: "none",
      moveForward: "false",
      web3: undefined,
      contract: undefined,
      connected: false,
      accounts: [],
    };
  }

  SetAccounts = (accounts) => {
    this.setState({ accounts: accounts });
  };

  SetConnected = (connected) => {
    this.setState({ connected: connected });
  };

  Init = () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        Demonzv2_production,
        //"0x840244370Cabc0b2F09751D071799Ca81cD1BCeC"
        "0x3148e680b34f007156e624256986d8ba59ee82ee"
      );
      this.setState({ web3: web3 });
      this.setState({ contract: contract });
    }
  };

  DisconnectMetaMask = () => {
    this.setState({ connected: false });
    this.setState({ accounts: [] });
  };

  ConnectMetaMask = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        });
      } catch (error) {
        console.error(error);
      }
      this.setState({ accounts: accounts });
    } else {
      alert(
        "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
      );
      return 0;
    }
  };

  RequestAccounts = async () => {
    const accounts = await window.ethereum
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
    this.setState({ accounts: accounts });
  };

  Handler() {
    if (this.state.moveForward === "false") {
      return this.WelcomeMsg();
    } else {
      switch (this.state.decision) {
        case "sacrifice":
          return this.Sacrifice();

        case "summoning":
          return this.Summoning();
      }
    }
  }

  componentWillMount() {
    this.Init();

    if (window.ethereum && window.ethereum.isConnected) {
      this.RequestAccounts();
    }

    if (this.state.accounts !== undefined && this.state.accounts.length > 0) {
      this.setState({ connected: true });
    } else {
      this.setState({ connected: false });
    }
  }

  componentDidMount() {
    console.log("Loaded successfully");
  }

  WelcomeMsg() {
    const dialogueContainer = () => {
      switch (this.state.decision) {
        case "none":
          return (
            <div className="css-typing">
              <p>I'm so glad to see you made it, I thought you were chicken!</p>
              <p>We're about to get started</p>
              <p>
                <a
                  href="#"
                  onClick={() => {
                    this.setState({ decision: "sacrifice" });
                  }}
                >
                  Join the sacrifice
                </a>
              </p>
            </div>
          );

        case "sacrifice":
          return (
            <div className="css-typing">
              <p>The bloodlust on you!</p>
              <p>Fine, bring your lowley demonz and follow me.</p>
              <div className="row">
                <div className="col text-center">
                  <button
                    type="button"
                    className="custombtn follow"
                    onClick={() => {
                      this.setState({ moveForward: "true" });
                    }}
                  ></button>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="container-xl">
        <div className="top-spacer"></div>
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
                      {dialogueContainer()}
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

  // just need a place to call test contract
  Sacrifice() {
    return (
      <Sacrificing
        connected={this.state.connected}
        contract={this.state.contract}
        accounts={this.state.accounts}
        ConnectMetaMask={this.ConnectMetaMask}
        setAccounts={this.SetAccounts}
        setConnected={this.SetConnected}
        DisconnectMetaMask={this.DisconnectMetaMask}
      />
    );
  }

  Summoning() {
    return (
      <Summoning
        connected={this.state.connected}
        contract={this.state.contract}
        accounts={this.state.accounts}
        ConnectMetaMask={this.ConnectMetaMask}
        setAccounts={this.SetAccounts}
        setConnected={this.SetConnected}
        DisconnectMetaMask={this.DisconnectMetaMask}
      />
    );
  }

  render() {
    return this.Handler();
  }
}

export default Wrapper;
